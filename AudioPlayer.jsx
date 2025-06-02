// 5. AudioPlayer.jsx - Lecteur audio simple
import React from 'react';

const AudioPlayer = ({ audioUrl }) => (
  <div className="card p-3 mb-3">
    <h4>🔊 Lecture de l'audio</h4>
    {audioUrl ? <audio controls className="w-100" src={audioUrl} /> : <p>Pas d'audio disponible.</p>}
  </div>
);

export default AudioPlayer;