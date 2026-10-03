/**
 * Organization-wide settings. Items marked TODO need confirmation from the
 * founding team before launch.
 */
export const site = {
  name: "CircuitSparks",
  legalName: "CircuitSparks",
  tagline: "Every engineer starts with a spark.",
  description:
    "CircuitSparks is a student-founded, youth-led 501(c)(3) bringing free, hands-on electronics workshops to middle schoolers, taught by high school mentors at local libraries and schools.",
  url: "https://circuitsparks.org", // TODO: confirm production domain
  email: "hello@circuitsparks.org", // TODO: confirm inbox
  sponsorshipEmail: "sponsors@circuitsparks.org", // TODO: confirm inbox
  gofundmeUrl: "https://www.gofundme.com/", // TODO: replace with campaign URL
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Programs", href: "/programs" },
  { label: "Mentors", href: "/mentors" },
  { label: "About", href: "/about" },
  { label: "Donate", href: "/donate" },
];

export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "Programs",
    items: [
      { label: "Curriculum", href: "/programs" },
      { label: "Register a student", href: "/register" },
      { label: "Host a workshop", href: "/contact?topic=host" },
    ],
  },
  {
    title: "Get involved",
    items: [
      { label: "Become a mentor", href: "/mentors" },
      { label: "Donate", href: "/donate" },
      { label: "Sponsor hardware", href: "/donate#sponsor" },
    ],
  },
  {
    title: "Organization",
    items: [
      { label: "About", href: "/about" },
      { label: "Governance", href: "/about#governance" },
      { label: "Transparency", href: "/about#transparency" },
    ],
  },
  {
    title: "Contact",
    items: [
      { label: "Contact us", href: "/contact" },
      { label: "Press", href: "/contact?topic=press" },
    ],
  },
];
