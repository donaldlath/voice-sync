const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ msg: 'Non autorisé, aucun token fourni' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // on attache l'ID de l'utilisateur au `req`
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token invalide' });
  }
};

module.exports = protect;
