import React, { useState } from 'react';
import VoiceRecorderForm from './VoiceRecorderForm';
import TextEntry from './TextEntry';
import PresenterViewer from './PresenterViewer';
import FakeLipSync from './FakeLipSync';
import AudioPlayer from './AudioPlayer';
import HistoryList from './HistoryList';


const App = () => {
  const [text, setText] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [history, setHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSave = (blob) => {
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);
    setHistory((prev) => [url, ...prev]);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">💡 Application Voix + Présentateur IA</h2>
      <VoiceRecorderForm />
      <TextEntry text={text} setText={setText} />
      <PresenterViewer />
      <FakeLipSync isPlaying={isPlaying} />
      <AudioPlayer audioUrl={audioUrl} />
      <HistoryList history={history} />
    </div>
  );
};

export default App;