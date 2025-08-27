import { verify } from 'jsonwebtoken';

const AUTH0_SECRET = process.env.AUTH0_CLIENT_SECRET;

export default async function authMiddleware(req, res) {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Chybí nebo neplatný Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify JWT token s tajným klíčem
    const decoded = verify(token, AUTH0_SECRET);

    // Přidej uživatelská data do objektu request pro další zpracování
    req.user = decoded;

  } catch (error) {
    res.status(401).json({ error: 'Neplatný nebo vypršelý token' });
    return;
  }
}
