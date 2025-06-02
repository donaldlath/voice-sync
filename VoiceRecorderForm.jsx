// 1. VoiceRecorderForm.jsx - Nouveau formulaire vocal avec tous les boutons
import React, { useState, useRef } from 'react';

const VoiceRecorderForm = () => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunks.current = [];

    mediaRecorderRef.current.ondataavailable = (e) => {
      audioChunks.current.push(e.data);
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setAudioBlob(blob);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const handleSave = () => {
    if (audioBlob) {
      alert("Audio sauvegardé localement !");
    }
  };

  return (
    <div className="card p-4 mb-4">
      <h4>🎤 Formulaire d’enregistrement vocal</h4>
      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={startRecording} disabled={recording}>
          ▶️ Démarrer
        </button>
        <button className="btn btn-danger me-2" onClick={stopRecording} disabled={!recording}>
          ⏹️ Arrêter
        </button>
        <button className="btn btn-secondary me-2" onClick={() => audioUrl && new Audio(audioUrl).play()} disabled={!audioUrl}>
          🔁 Réécouter
        </button>
        <button className="btn btn-success" onClick={handleSave} disabled={!audioBlob}>
          💾 Sauvegarder
        </button>
      </div>
      {audioUrl && (
        <audio className="w-100 mt-3" controls src={audioUrl} />
      )}
    </div>
  );
};

export default VoiceRecorderForm;