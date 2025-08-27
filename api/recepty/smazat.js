// api/recepty/smazat.js

import corsMiddleware from '../../middleware/cors'
import authMiddleware from '../../middleware/auth'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  // Povolit CORS a ověřit JWT token
  await corsMiddleware(req, res)
  await authMiddleware(req, res)

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'Chybí ID receptu' })
  }

  try {
    // Odstranit recept z databáze
    const { data, error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při mazání receptu' })
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Recept nenalezen' })
    }

    // Vrátit potvrzení o úspěšném smazání
    return res.status(200).json({ message: 'Recept úspěšně smazán' })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
