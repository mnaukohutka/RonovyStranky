import corsMiddleware from '../../middleware/cors';
import authMiddleware from '../../middleware/auth';
import { supabase } from '../../lib/supabase';
import { jsonResponse } from '../../lib/utils';

export default async function handler(req, res) {
  // Povolit CORS
  await corsMiddleware(req, res);

  // Ověřit autentizaci uživatele (pokud endpoint vyžaduje přihlášení)
  await authMiddleware(req, res);

  if (req.method !== 'GET') {
    return jsonResponse(res, null, 'Metoda není podporována', 405);
  }

  // Načtení dat z tabulky 'recepty'
  const { data, error } = await supabase
    .from('recepty')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return jsonResponse(res, null, error.message, 500);
  }

  // Vrátit seznam receptů ve formátu JSON
  return jsonResponse(res, data, null, 200);
}
