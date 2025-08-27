import jwt from 'jsonwebtoken';

const AUTH0_SECRET = process.env.AUTH0_CLIENT_SECRET;

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header chybí' });
    return;
  }

  const token = authHeader.split(' ')[1]; // Bearer token

  try {
    const decoded = jwt.verify(token, AUTH0_SECRET);
    req.user = decoded; // Data o uživateli předáme dál
    next(); // Pokračování další funkcí/endpointem
  } catch (err) {
    res.status(401).json({ message: 'Neplatný token' });
  }
}
