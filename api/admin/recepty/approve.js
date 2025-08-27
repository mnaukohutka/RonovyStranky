// api/admin/recepty/approve.js

import corsMiddleware from '../../../middleware/cors'
import authMiddleware from '../../../middleware/auth'
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  await corsMiddleware(req, res)
  await authMiddleware(req, res)

  // Ověření role admin
  if (!req.user || !req.user['https://your-app.com/roles']?.includes('admin')) {
    return res.status(403).json({ error: 'Access denied' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { id } = req.body
  if (!id) {
    return res.status(400).json({ error: 'Missing recipe ID' })
  }

  try {
    // Nastavit approved = true pro dané ID
    const { data, error } = await supabase
      .from('recipes')
      .update({ approved: true })
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při schvalování receptu' })
    }
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Recept nenalezen' })
    }

    return res.status(200).json({ message: 'Recept byl schválen' })
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
