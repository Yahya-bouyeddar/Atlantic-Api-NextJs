/**
 * Call API - same origin (Next.js API routes)
 */
export async function apiFetch(path, options = {}) {
  const url = path.startsWith("http") ? path : path;
  return fetch(url, options);
}
