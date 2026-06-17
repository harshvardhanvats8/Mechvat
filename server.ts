import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// REST API for MechVat platform

// 1. AI Assistant & Tutor endpoint
app.post("/api/tutor", async (req, res) => {
  try {
    const { component, category, query } = req.body;
    if (!ai) {
      return res.status(503).json({ 
        error: "Gemini API key is not configured in environment variables. Please check the Secrets panel in AI Studio Settings." 
      });
    }

    let prompt = `You are the MechVat AI Engineering Tutor, an elite CAD/CAE software specialist and Senior Mechanical & Aerospace Engineer.
Explain the following topic:
Component: ${component || 'General Machinery'}
Category: ${category || 'Mechanical Engineering'}
User Query: ${query || 'Please explain working principles and materials.'}

Provide a comprehensive, high-quality response structured exactly with these sections (using clean Markdown):
### ⚙️ Working Principle & Kinematics
### 🛠️ Material Selection & Durability
### 📐 Core Engineering Blueprint Formulas (with variables explained)
### 💥 Common Failure Modes & Fatigue Limits
### 🎓 Key Technical Interview Questions (Include 2 conceptual questions & brief answers)

Keep the language professional, technically precise, and highly engaging.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in AI Tutor endpoint:", error);
    res.status(500).json({ error: error.message || "Failed to contact engineering AI assistant." });
  }
});

// 2. AI Design Generator endpoint
app.post("/api/design-generator", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!ai) {
      return res.status(503).json({
        error: "Gemini API key is not configured in environment variables. Please check the Secrets panel in AI Studio Settings."
      });
    }

    const fullPrompt = `You are a design generator for MechVat CAD system.
The user wants to generate design parameters and a virtual specification sheet for: "${prompt}".

Respond strictly with a JSON object in this format (no markdown backticks, just raw json):
{
  "name": "Design Name (e.g. Planetary Gearbox Unit)",
  "massKg": 12.5,
  "dimensions": { "length": "250mm", "width": "180mm", "height": "180mm" },
  "estimatedCostUSD": 450,
  "materials": ["Alloy Steel 4140", "Bronze bushings", "Synthetic gear oil"],
  "specifications": [
    { "label": "Gear Ratio", "value": "4:1" },
    { "label": "Input Power Max", "value": "15 kW" },
    { "label": "Max Output Torque", "value": "350 Nm" },
    { "label": "Efficiency", "value": "97%" }
  ],
  "assemblySteps": [
    "Step 1: Align sunburn housing with core planet carrier.",
    "Step 2: Press-fit ball bearings into output shafts.",
    "Step 3: Lubricate with high-pressure lithium grease before housing closure."
  ],
  "mathematicalVerification": "Torque = Power / Speed. (T = P / omega). Calculated output torque verified at 350 Nm under full 15kW continuous duty with an operating safety factor of 1.85 based on Soderberg criteria."
}

Generate realistic and scientifically sound details based on their input. Ensure it is valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Error in AI Design Generator:", error);
    res.status(500).json({ error: error.message || "Failed to generate design specifications." });
  }
});

// Vite server connection integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MechVat Engine running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
