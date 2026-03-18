const mongoose = require("mongoose");

const StartupSchema = new mongoose.Schema(
  {
    inputKeywords: { type: String, required: true },
    generatedIdea: { type: String, default: "" },
    title: { type: String, required: true },
    concept: { type: String, required: true },

    score: {
      total: { type: Number, default: 0 },
      innovation: { type: Number, default: 0 },
      demand: { type: Number, default: 0 },
      scalability: { type: Number, default: 0 },
      feasibility: { type: Number, default: 0 }
    },

    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    features: [{ type: String }],
    techStack: [{ type: String }],

    judge: {
      pros: [{ type: String }],
      cons: [{ type: String }],
      risks: [{ type: String }],
      verdict: { type: String, default: "" }
    },

    enhancement: {
      improvedIdea: { type: String, default: "" },
      advancedFeatures: [{ type: String }],
      futureScope: { type: String, default: "" }
    },

    suggestions: {
      growthTips: [{ type: String }],
      strategyImprovements: [{ type: String }]
    },

    pitches: {
      short: { type: String, default: "" },
      elevator: { type: String, default: "" },
      investor: { type: String, default: "" }
    },

    funding: {
      estimatedCost: { type: String, default: "" },
      breakEven: { type: String, default: "" },
      investmentLevel: { type: String, default: "" }
    },

    competitorAnalysis: {
      competitors: [{ type: String }],
      marketGap: { type: String, default: "" },
      advantages: [{ type: String }]
    },

    chartData: {
      growth: [{ type: Number }],
      demandSegments: [{ type: Number }]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Startup", StartupSchema);