/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/admineral/OpenAI-Assistant-API-Chat",
        permanent: true,
      },
      {
        source: "/deploy",
        destination: "https://open-ai-assistant-api-chat.vercel.app",
        permanent: true,
      },
    ];
  },

  // Adding the experimental configuration
  experimental: {
    fetch: true,
  },
};

module.exports = nextConfig;
