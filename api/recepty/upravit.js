// api/recepty/upravit.js

import corsMiddleware from '../../middleware/cors'
import authMiddleware from '../../middleware/auth'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  // Povolit CORS a ověřit JWT token
  await corsMiddleware(req, res)
  await authMiddleware(req, res)

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id, name, description, image_url, ingredients, steps, difficulty, servings, calories } = req.body
  if (!id) {
    return res.status(400).json({ error: 'Chybí ID receptu' })
  }

  // Základní validace
  if (!name || !ingredients || !steps || !difficulty || !servings) {
    return res.status(400).json({ error: 'Chybí povinná pole' })
  }

  try {
    // Aktualizovat recept; aprover status zůstává beze změny (nepovolujeme autopřeschválení)
    const { data, error } = await supabase
      .from('recipes')
      .update({
        name,
        description,
        image_url,
        ingredients,
        steps,
        difficulty,
        servings,
        calories
      })
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při aktualizaci receptu' })
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Recept nenalezen' })
    }

    // Vrátit aktualizovaný recept
    return res.status(200).json(data[0])
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
