export function appBase() {
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

export function withBase(path) {
  const base = appBase();
  if (!path) return base || '/';
  if (path.startsWith('http')) return path;
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
