// api/recepty/vytvorit.js

import corsMiddleware from '../../middleware/cors'
import authMiddleware from '../../middleware/auth'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  // Povolit CORS a ověřit JWT token
  await corsMiddleware(req, res)
  await authMiddleware(req, res)

  // Kontrola, že uživatel má roli 'alchymista'
  const roles = req.user['https://your-app.com/roles'] || []
  if (!roles.includes('alchymista')) {
    return res.status(403).json({ error: 'K vytváření receptů musíš mít status alchymista' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, description, image_url, ingredients, steps, difficulty, servings, calories } = req.body

  // Základní validace vstupních dat
  if (!name || !ingredients || !steps || !difficulty || !servings) {
    return res.status(400).json({ error: 'Chybí povinná pole' })
  }

  try {
    // Vložit nový recept s approved=false (nutno schválit)
    const { data, error } = await supabase
      .from('recipes')
      .insert([{
        name,
        description,
        image_url,
        ingredients,
        steps,
        difficulty,
        servings,
        calories,
        approved: false  // výchozí stav
      }])

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při vytváření receptu' })
    }

    // Vrátit nově vytvořený záznam
    return res.status(201).json(data[0])
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
