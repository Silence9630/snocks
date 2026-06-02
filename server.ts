import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

// Initialize Gemini SDK with telemetry headers as per the guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // AI Stock Analysis Endpoint
  app.post("/api/analyze", async (req, res) => {
    const { symbol, name, price, change, changePercent, sector, high, low } = req.body;

    if (!symbol || !name) {
      return res.status(400).json({ error: "Missing symbol or stock name" });
    }

    try {
      const prompt = `Perform a high-quality professional financial analysis for ${name} (${symbol}) in the sector ${sector || "Technology"}.
Current core stats for context:
- Current Price: $${price || "N/A"}
- Price Change: ${change >= 0 ? "+" : ""}${change || "0"} (${changePercent >= 0 ? "+" : ""}${changePercent || "0"}%)
- Price Session Range: High $${high || "N/A"} / Low $${low || "N/A"}

Please synthesize this data with your industry knowledge and return a deep macro analysis and investment outlook.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "You are a senior hedge-fund equity researcher and stock analyst. Produce concise, high-value, realistic analyses without promotional language. Keep statements objective and rooted in industry realities.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              symbol: { type: Type.STRING },
              name: { type: Type.STRING },
              sentiment: { type: Type.STRING, description: "Bullish, Bearish, or Neutral" },
              recommendation: { type: Type.STRING, description: "BUY, HOLD, or SELL" },
              score: { type: Type.INTEGER, description: "Numerical rating from 0 to 100 representing buy sentiment rating" },
              analysisText: { type: Type.STRING, description: "Detailed macro analysis of the stock based on conditions and trends" },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of 3 key business strengths or tailwinds"
              },
              risks: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of 3 key business risks or headwinds"
              },
              outlook: { type: Type.STRING, description: "Summary 1-sentence forward-looking outlook statement" }
            },
            required: ["symbol", "name", "sentiment", "recommendation", "score", "analysisText", "strengths", "risks", "outlook"]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini.");
      }

      const parsedAnalysis = JSON.parse(responseText.trim());
      res.json(parsedAnalysis);
    } catch (error: any) {
      console.error("Gemini stock analysis error:", error);
      res.status(500).json({
        error: "Failed to generate AI analysis",
        details: error.message || error
      });
    }
  });

  // Hot-reloading Vite dev server integration or production assets bundling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Serve client SPA fallback for unmatched routes
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Snocks Server] running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start full-stack server:", err);
  process.exit(1);
});
