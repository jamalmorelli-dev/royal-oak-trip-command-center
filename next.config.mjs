/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isPwaExport = process.env.GROK_PWA_EXPORT === '1';
const basePath = isPwaExport ? '/royal-oak-trip-command-center' : '';

const nextConfig = {
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  outputFileTracingRoot: __dirname,
};

if (isPwaExport) {
  nextConfig.output = 'export';
  nextConfig.basePath = basePath;
  nextConfig.assetPrefix = basePath;
  nextConfig.trailingSlash = true;
} else {
  nextConfig.outputFileTracingIncludes = {
    '/api/vault/file': ['./private_docs/**/*'],
  };
}

export default nextConfig;
