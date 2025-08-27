// api/recepty/seznam.js

import corsMiddleware from '../../middleware/cors'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  // Povolit CORS pouze pro frontend doménu
  await corsMiddleware(req, res)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Načíst všechny schválené recepty setříděné podle data vložení
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        id,
        name,
        description,
        image_url,
        ingredients,
        steps,
        difficulty,
        servings,
        calories,
        created_at
      `)
      .eq('approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při načítání receptů' })
    }

    // Vrátit pole receptů
    return res.status(200).json(data)
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
