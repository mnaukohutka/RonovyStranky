// api/admin/recepty/pending.js

import corsMiddleware from '../../../middleware/cors'
import authMiddleware from '../../../middleware/auth'
import { supabase } from '../../../lib/supabase'

export default async function handler(req, res) {
  await corsMiddleware(req, res)
  await authMiddleware(req, res)

  // Zkontrolujeme, zda je uživatel admin (přes claim v tokenu)
  if (!req.user || !req.user['https://your-app.com/roles']?.includes('admin')) {
    return res.status(403).json({ error: 'Access denied' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Načíst všechny recepty s approved = false
    const { data, error } = await supabase
      .from('recipes')
      .select('id, name, created_at')
      .eq('approved', false)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return res.status(500).json({ error: 'Chyba při načítání nevyřízených receptů' })
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Server error:', err)
    return res.status(500).json({ error: 'Vnitřní serverová chyba' })
  }
}
