/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/github",
        destination: "https://github.com/admineral",
        permanent: true,
      },
      {
        source: "/deploy",
        destination: "https://github.com/admineral",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
