const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

exports.generateVideoFromText = async (req, res) => {
  const { text } = req.body;
  const presenterVideo = req.file; // récupéré via multer

  if (!text || !presenterVideo) {
    return res.status(400).json({ error: 'Texte ou vidéo manquante' });
  }

  try {
    // ✅ Créer dynamiquement le dossier results si besoin
    const resultsDir = path.join(__dirname, '../wav2lip_module/results');
    fs.mkdirSync(resultsDir, { recursive: true });

    const form = new FormData();
    form.append('text', text);
    form.append('video', fs.createReadStream(presenterVideo.path));

    const flaskResponse = await axios.post(
      'http://localhost:5001/lip-sync', // ← adapte ce port si Flask tourne ailleurs
      form,
      {
        headers: form.getHeaders(),
        responseType: 'stream', // 👈 important si tu veux directement streamer la vidéo
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    // Crée un nom de fichier temporaire
    const outputFileName = `result_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../wav2lip_module/results', outputFileName);

    // Sauvegarde la vidéo reçue dans un fichier local
    const writer = fs.createWriteStream(outputPath);
    flaskResponse.data.pipe(writer);

    writer.on('finish', () => {
      res.json({ videoUrl: `/results/${outputFileName}` });
    });

    writer.on('error', (err) => {
      console.error('Erreur d\'écriture de la vidéo :', err);
      res.status(500).json({ error: 'Erreur lors de la sauvegarde de la vidéo' });
    });

  } catch (error) {
    console.error('Erreur en envoyant à l’API Wav2Lip :', error.message);
    res.status(500).json({ error: 'Erreur génération de la vidéo' });
  }
};
