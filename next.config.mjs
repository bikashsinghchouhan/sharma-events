const isGithubBuild = process.env.GITHUB_PAGES === 'true' || process.env.GITHUB_ACTIONS === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: isGithubBuild ? 'export' : undefined,
  // Keep basePath empty because the website is hosted on the custom domain sharmaevents.co.in
  basePath: '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

