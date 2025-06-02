// components/TextEntry.js
import React, { useState } from 'react';

function TextEntry() {
  const [text, setText] = useState('');

  const handleSubmit = () => {
    alert(`Texte soumis : ${text}`);
  };

  return (
    <div>
      <label className="form-label">Entrez un texte :</label>
      <input
        type="text"
        className="form-control mb-3"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tapez ici..."
      />
      <button className="btn btn-primary" onClick={handleSubmit}>
        Envoyer
      </button>
    </div>
  );
}

export default TextEntry;
