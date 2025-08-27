// api/ratings/seznam.js

import corsMiddleware from '../../middleware/cors'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  await corsMiddleware(req, res)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { recipe_id } = req.query
  if (!recipe_id) {
    return res.status(400).json({ error: 'Missing recipe_id' })
  }

  try {
    // Načíst všechna hodnocení daného receptu
    const { data, error } = await supabase
      .from('ratings')
      .select('id, user_id, score, comment, created_at')
      .eq('recipe_id', recipe_id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při načítání hodnocení' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
