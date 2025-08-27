// api/recepty/detail.js

import corsMiddleware from '../../middleware/cors'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  // Povolit CORS pouze pro frontend doménu
  await corsMiddleware(req, res)

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.query
  if (!id) {
    return res.status(400).json({ error: 'Missing recipe ID' })
  }

  try {
    // Načíst detail receptu s daným ID pouze pokud je schválený
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
      .eq('id', id)
      .eq('approved', true)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při načítání detailu receptu' })
    }
    if (!data) {
      return res.status(404).json({ error: 'Recept nenalezen nebo není schválen' })
    }

    // Vrátit detail receptu
    return res.status(200).json(data)
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
