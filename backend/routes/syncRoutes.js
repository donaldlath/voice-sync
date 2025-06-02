const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { generateVideoFromText } = require('../controllers/syncController');
const protect = require('../middleware/authMiddleware');

const upload = multer({
  dest: path.join(__dirname, '../uploads') // ou un autre dossier temporaire
});

router.post('/generate-video',protect, upload.single('video'), generateVideoFromText);

module.exports = router;



