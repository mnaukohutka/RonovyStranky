import Cors from 'cors';

// Povolené metody a původ domény frontend klienta
const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: 'https://tvojeneocities.neocities.org',
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

// Pomocná funkce pro čekání na middleware v async funkci
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function corsMiddleware(req, res) {
  await runMiddleware(req, res, cors);
}
