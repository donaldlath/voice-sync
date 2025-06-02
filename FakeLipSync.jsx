// 4. FakeLipSync.jsx - Animation simple des lèvres
import React, { useEffect, useState } from 'react';

const FakeLipSync = ({ isPlaying }) => {
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setMouthOpen((prev) => !prev);
    }, 300);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="card p-3 mb-3 text-center">
      <h4>💬 Animation des lèvres</h4>
      <div style={{ fontSize: '3rem' }}>
        {mouthOpen ? '👄' : '😊'}
      </div>
    </div>
  );
};

export default FakeLipSync;