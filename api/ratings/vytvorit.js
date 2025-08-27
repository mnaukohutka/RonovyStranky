// api/ratings/vytvorit.js

import corsMiddleware from '../../middleware/cors'
import authMiddleware from '../../middleware/auth'
import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  await corsMiddleware(req, res)
  await authMiddleware(req, res)

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { recipe_id, score, comment } = req.body
  if (!recipe_id || !score) {
    return res.status(400).json({ error: 'Chybí povinná pole' })
  }

  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert([{ recipe_id, user_id: req.user.sub, score, comment }])

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při vytváření hodnocení' })
    }

    return res.status(201).json(data[0])
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
