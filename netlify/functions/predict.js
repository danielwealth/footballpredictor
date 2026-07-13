// netlify/functions/predict.js
import OpenAI from "openai";

export async function handler(event) {
  try {
    const { teamA, teamB } = JSON.parse(event.body);

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY, // set in Netlify env vars
    });

    const prompt = `
      Analyze the past performance of ${teamA} and ${teamB}.
      Consider recent form, head-to-head record, possession stats,
      shots on target, injuries, and home advantage.
      Predict the outcome of their match (Win, Draw, or Lose).
    `;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const aiPrediction = response.choices[0].message.content.trim();

    let result;
    if (aiPrediction.toLowerCase().includes("win")) {
      if (aiPrediction.toLowerCase().includes(teamA.toLowerCase())) {
        result = `${teamA} is predicted to win.`;
      } else {
        result = `${teamB} is predicted to win.`;
      }
    } else if (aiPrediction.toLowerCase().includes("draw")) {
      result = "The match is predicted to be a draw.";
    } else {
      result = aiPrediction;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ result }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ result: "Error generating prediction." }),
    };
  }
}
