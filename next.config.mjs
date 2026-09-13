/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Private vault documents exist only in the secure deployment context, never in public Git.
  outputFileTracingIncludes: {
    '/api/vault/file': ['./private_docs/**/*'],
  },
};

export default nextConfig;
