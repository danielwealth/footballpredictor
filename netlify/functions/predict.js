import OpenAI from 'openai';

export default async function handler(req, res) {
  try {
    const { teamA, teamB } = JSON.parse(req.body);

    const client = new OpenAI({
      apiKey: process.env.REACT_APP_OPENAI_API_KEY, // stored in Netlify env vars
    });

    const prompt = `
      Analyze the past performance of ${teamA} and ${teamB}.
      Consider recent form, head-to-head record, possession stats,
      shots on target, injuries, and home advantage.
      Predict the outcome of their match (Win, Draw, or Lose).
    `;

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
    });

    const aiPrediction = response.choices[0].message.content.trim();

    // Parse like your Java code
    let result;
    if (aiPrediction.toLowerCase().includes('win')) {
      if (aiPrediction.toLowerCase().includes(teamA.toLowerCase())) {
        result = `${teamA} is predicted to win.`;
      } else {
        result = `${teamB} is predicted to win.`;
      }
    } else if (aiPrediction.toLowerCase().includes('draw')) {
      result = 'The match is predicted to be a draw.';
    } else if (aiPrediction.toLowerCase().includes('goal')) {
      const score = aiPrediction.split('goal')[1]?.trim();
      result = `Predicted goal score: ${score}`;
    } else {
      result = aiPrediction;
    }

    res.status(200).json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ result: 'Error generating prediction.' });
  }
}
