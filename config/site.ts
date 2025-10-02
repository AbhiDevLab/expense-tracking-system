export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Expense Tracker",
  description: "Make your calculated and visioned expenses with ease.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  links: {
    github: "https://github.com/AbhiDevLab",
    twitter: "https://twitter.com/x",
    discord: "https://discord.gg/873902320507834368",
    sponsor: "https://github.com/sponsors/AbhiDevLab",
  },
};
