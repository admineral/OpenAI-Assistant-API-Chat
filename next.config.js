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
  env: {
    REACT_APP_ASSISTANT_ID: process.env.REACT_APP_ASSISTANT_ID,
  },
};

module.exports = nextConfig;