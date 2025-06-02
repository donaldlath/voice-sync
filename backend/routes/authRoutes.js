const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Teste 🔐 route protégée
router.get('/me', protect, (req, res) => {
  res.json({ msg: 'Accès autorisé', userId: req.user.id });
});

module.exports = router;
