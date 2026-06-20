import React, { useState } from 'react';

const FootballMatchPredictor = () => {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    if (!teamA || !teamB) {
      setPrediction('Please enter both team names.');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/.netlify/functions/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamA, teamB }),
      });
      const data = await res.json();
      setPrediction(data.result);
    } catch (err) {
      setPrediction('Error fetching prediction.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>⚽ Football Match Predictor</h2>
      <input
        type="text"
        placeholder="Enter Team A"
        value={teamA}
        onChange={(e) => setTeamA(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Team B"
        value={teamB}
        onChange={(e) => setTeamB(e.target.value)}
      />
      <button onClick={handlePredict} disabled={loading}>
        {loading ? 'Predicting...' : 'Predict Outcome'}
      </button>
      {prediction && <p>{prediction}</p>}
    </div>
  );
};

export default FootballMatchPredictor;
