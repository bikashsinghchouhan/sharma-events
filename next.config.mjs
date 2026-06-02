const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGithubPages ? 'export' : undefined,
  basePath: isGithubPages ? '/sharma-events' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
