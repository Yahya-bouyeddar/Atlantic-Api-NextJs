/**
 * Validate BON DE COULAGE request body (for use in API routes)
 * @param {Object} body - request body (JSON or form fields)
 * @returns {{ valid: boolean, errors?: string[] }}
 */
function validateBonRequest(body = {}) {
  const { att_reference, reference_2, date, proprietaire, projet, adresse, documentType } = body;
  const errors = [];

  if (documentType === "ATT" && (!date || !att_reference)) {
    errors.push("date et référence requis pour attestation");
  }
  if (!reference_2) errors.push("reference_2 est requis");
  if (!proprietaire) errors.push("proprietaire est requis");
  if (!projet) errors.push("projet est requis");
  if (!adresse) errors.push("adresse est requis");
  if (body.notes && !Array.isArray(body.notes)) {
    errors.push("notes doit être un tableau de strings");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true };
}

module.exports = { validateBonRequest };
