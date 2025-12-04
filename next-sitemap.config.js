/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: "https://joaofaquino.run",
  generateRobotsTxt: true,
  exclude: ["/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
    ],
  },
};

module.exports = config;