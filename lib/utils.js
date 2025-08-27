/**
 * Kontroluje, zda je řetězec validní e-mail
 * @param {string} email
 * @returns {boolean}
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Normalizuje textové pole – ořízne bílé znaky
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  return text.trim();
}

/**
 * Vytvoří jednotný JSON response formát
 * @param {object} data
 * @param {string|null} error
 */
export function jsonResponse(res, data = null, error = null, status = 200) {
  res.status(status).json({ data, error });
}
