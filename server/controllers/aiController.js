const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.explainMetrics = async (req, res) => {
  try {
    const { metrics } = req.body;
    
    if (!metrics) {
      return res.status(400).json({ error: "Metrics payload is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return res.status(500).json({ 
        error: "Missing GEMINI_API_KEY. Please configure your .env file.",
        fallback: "This is a fallback response since no API key is configured. In a real scenario, the LLM would analyze your metrics (Lead Time: " + metrics.leadTime + ", Bug Rate: " + metrics.bugRate + "%) and suggest concrete team dynamic improvements."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an expert engineering manager and agile coach. 
    Review the following DORA metrics for an engineering team:
    - Lead Time: ${metrics.leadTime} days
    - Cycle Time: ${metrics.cycleTime} days
    - Bug Rate: ${metrics.bugRate}%
    - Average PR Size: ${metrics.prSize} lines
    
    Provide a concise, 2-paragraph diagnostic explaining what these metrics imply about the team's dynamics, and give 3 actionable bullet points for improvement. Keep it professional and short.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ explanation: text });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate AI insights." });
  }
};
