const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI, Type } = require("@google/genai");
const Startup = require("./models/Startup");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const startupResponseSchema = {
  type: Type.OBJECT,
  properties: {
    generatedIdea: { type: Type.STRING },
    title: { type: Type.STRING },
    concept: { type: Type.STRING },
    score: {
      type: Type.OBJECT,
      properties: {
        total: { type: Type.NUMBER },
        innovation: { type: Type.NUMBER },
        demand: { type: Type.NUMBER },
        scalability: { type: Type.NUMBER },
        feasibility: { type: Type.NUMBER },
      },
      required: ["total", "innovation", "demand", "scalability", "feasibility"],
    },
    problem: { type: Type.STRING },
    solution: { type: Type.STRING },
    features: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    techStack: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    judge: {
      type: Type.OBJECT,
      properties: {
        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
        risks: { type: Type.ARRAY, items: { type: Type.STRING } },
        verdict: { type: Type.STRING },
      },
      required: ["pros", "cons", "risks", "verdict"],
    },
    enhancement: {
      type: Type.OBJECT,
      properties: {
        improvedIdea: { type: Type.STRING },
        advancedFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
        futureScope: { type: Type.STRING },
      },
      required: ["improvedIdea", "advancedFeatures", "futureScope"],
    },
    suggestions: {
      type: Type.OBJECT,
      properties: {
        growthTips: { type: Type.ARRAY, items: { type: Type.STRING } },
        strategyImprovements: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["growthTips", "strategyImprovements"],
    },
    pitches: {
      type: Type.OBJECT,
      properties: {
        short: { type: Type.STRING },
        elevator: { type: Type.STRING },
        investor: { type: Type.STRING },
      },
      required: ["short", "elevator", "investor"],
    },
    funding: {
      type: Type.OBJECT,
      properties: {
        estimatedCost: { type: Type.STRING },
        breakEven: { type: Type.STRING },
        investmentLevel: { type: Type.STRING },
      },
      required: ["estimatedCost", "breakEven", "investmentLevel"],
    },
    competitorAnalysis: {
      type: Type.OBJECT,
      properties: {
        competitors: { type: Type.ARRAY, items: { type: Type.STRING } },
        marketGap: { type: Type.STRING },
        advantages: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["competitors", "marketGap", "advantages"],
    },
    chartData: {
      type: Type.OBJECT,
      properties: {
        growth: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        demandSegments: { type: Type.ARRAY, items: { type: Type.NUMBER } },
      },
      required: ["growth", "demandSegments"],
    },
  },
  required: [
    "generatedIdea",
    "title",
    "concept",
    "score",
    "problem",
    "solution",
    "features",
    "techStack",
    "judge",
    "enhancement",
    "suggestions",
    "pitches",
    "funding",
    "competitorAnalysis",
    "chartData",
  ],
};

async function generateStartupData(input, mode = "fun") {
  const prompt = `
You are Startify AI, an expert startup strategist.

Input: "${input}"
Mode: "${mode}"

Rules:
- In fun mode, turn weird/random keywords into a realistic but creative startup.
- In normal mode, keep it practical and market-aware.
- Keep language crisp, modern, investor-friendly.
- Scores should be between 55 and 98.
- demandSegments must total 100.
- growth must have exactly 6 increasing integers.
- Return useful, UI-ready content.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: startupResponseSchema,
    },
  });

  const text = response.text;
  const data = JSON.parse(text);

  return data;
}

app.get("/", (req, res) => {
  res.json({ message: "Startify AI backend is running" });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { input, mode = "fun" } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({ error: "Input is required" });
    }

    const plan = await generateStartupData(input, mode);

    const saved = await Startup.create({
      inputKeywords: input,
      ...plan,
    });

    res.json(saved);
  } catch (error) {
    console.error("Generate Error:", error);
    res.status(500).json({
      error: error.message || "Internal Server Error",
    });
  }
});

app.get("/api/history", async (req, res) => {
  try {
    const history = await Startup.find().sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup Error:", err.message);
    process.exit(1);
  }
}

startServer();