import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./server/recipesData.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;

      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ error: "Se requiere un arreglo de mensajes válido." });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "No se ha configurado la clave GEMINI_API_KEY en las variables de entorno.",
        });
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });

      // Format conversation turns for Gemini
      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const modelsToTry = ["gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
      let lastError: any = null;
      let replyText = "";

      for (const modelName of modelsToTry) {
        let attempts = 0;
        while (attempts < 2) {
          attempts++;
          try {
            const response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction: SYSTEM_PROMPT,
                temperature: 0.1,
              },
            });

            if (response?.text) {
              replyText = response.text;
              break;
            }
          } catch (err: any) {
            lastError = err;
            console.warn(`Model ${modelName} attempt ${attempts} failed:`, err?.message || err);
            await new Promise((resolve) => setTimeout(resolve, 600 * attempts));
          }
        }

        if (replyText) {
          break;
        }
      }

      if (!replyText) {
        if (lastError) {
          throw lastError;
        }
        replyText = "Lo siento, pero no dispongo de esa información en la base de datos proporcionada.";
      }

      return res.json({
        reply: replyText,
      });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      return res.status(500).json({
        error: error?.message || "Ocurrió un error al procesar la consulta con el asistente virtual.",
      });
    }
  });

  // Vite middleware in development vs static serving in production
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
