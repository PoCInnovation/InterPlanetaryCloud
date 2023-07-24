/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  output: 'standalone',
}

module.exports = nextConfig;

/**
 * "@babel/core": "^7.22.5",
    "@chakra-ui/icons": "^2.0.19",
    "@chakra-ui/react": "^2.7.1",
    "@chakra-ui/styled-system": "^2.9.1",
    "@chakra-ui/system": "^2.5.8",
    "@chakra-ui/theme-tools": "^2.0.18",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "aleph-sdk-ts": "^3.6.3",
    "axios": "^1.4.0",
    "boring-avatars": "^1.10.1",
    "crypto-js": "^4.1.1",
    "encoding": "^0.1.13",
    "eth-crypto": "^2.6.0",
    "ethers": "^5.7.2",
    "framer-motion": "^10.12.17",
    "git-clone": "^0.2.0",
    "js-file-download": "^0.4.12",
    "next": "^13.4.11",
    "next-auth": "^4.22.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^4.10.1",
    "typescript": "^5.1.3",
    "zod": "^3.21.4"
 */