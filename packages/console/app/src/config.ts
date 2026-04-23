/**
 * Application-wide constants and configuration for OpenMythos
 */
export const config = {
  // Base URL - Update this if you host a landing page for your fork
  baseUrl: "https://openmythos.ai",

  // GitHub - Update these to point to your fork repository
  github: {
    repoUrl: "https://github.com", 
    starsFormatted: {
      compact: "0",
      full: "0",
    },
  },

  // Social links - You can point these to your own or leave them blank
  social: {
    twitter: "https://x.com",
    discord: "https://discord.gg",
  },

  // Static stats (Update these to reflect your fork's status)
  stats: {
    contributors: "1",
    commits: "1",
    monthlyUsers: "ALPHA",
  },
} as const
