// Everything personal lives here. Edit this file, replace public/profile.jpg, and you're done.
// It currently holds the original content of rakibulx33.me's first design, as a working example.

export const NAME = "Rakibul Hasan";
export const FIRST_NAME = "Rakibul";
export const SITE_TITLE = "rakibul"; // shown in the top-left of the nav, as rakibul.dev
export const ROLE = "full-stack-developer"; // typed in the hero as "~$ full-stack-developer"
export const LOCATION = "dhaka.bd"; // the little "~/dhaka.bd" tag on the photo
export const OPEN_TO_WORK = "Open to new projects"; // set to "" to hide the badge

export const INTRO =
  "A developer from Bangladesh crafting scalable backends, polished web apps and creative tools, from AI-powered job platforms to queue management systems.";

export const ABOUT = {
  heading: "Developer · Builder · Problem Solver",
  paragraphs: [
    "I'm a full-stack developer who lives at the intersection of technology and entrepreneurship: designing systems, automating workflows and shipping products people actually use. End to end, from database schema to deployed product.",
    "From AI-powered job matching platforms and queue management systems to embedded projects on ESP8266, I enjoy taking ideas from sketch to production. Currently sharpening my craft with a B.Sc. in CSE, but I let the shipped work speak first.",
  ],
  highlights: ["Full-stack & backend development", "Data structures & algorithms", "AI / ML & system design", "Embedded systems & IoT"],
};

export const CONTACT = {
  email: "rakibulx33@gmail.com",
  lede: "Have an idea, a project or an opportunity? My inbox is always open. Let's collaborate and make it real.",
};

export const SOCIALS = {
  github: "https://github.com/rakibulx33",
  linkedin: "https://www.linkedin.com/in/rakibulx33",
};

/**
 * GitHub username. When set, the page fetches the real repos, stars and contribution
 * heatmap from GitHub (the public API, no token needed). Leave it empty to show the sample
 * projects below instead.
 */
export const GITHUB_USER = "rakibulx33";

export type SampleProject = { name: string; description: string; language: string; html_url: string };
export const SAMPLE_PROJECTS: SampleProject[] = [
  { name: "AI Job Match Platform", description: "AI-powered hiring engine matching candidates to roles using semantic search.", language: "TypeScript", html_url: "https://github.com/rakibulx33" },
  { name: "Queue Management System", description: "Real-time multi-counter queueing with live dashboards and SMS notifications.", language: "JavaScript", html_url: "https://github.com/rakibulx33" },
  { name: "ESP8266 IoT Suite", description: "Embedded firmware + dashboard for environment sensing and remote control.", language: "C++", html_url: "https://github.com/rakibulx33" },
];

export const SKILLS = [
  { icon: "code", label: "Languages", items: ["C", "C++", "Python", "JavaScript", "TypeScript", "Java", "C#"] },
  { icon: "database", label: "Web & Backend", items: ["Node.js", "Express", "Next.js", "React", "Tailwind", "REST"] },
  { icon: "cpu", label: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB"] },
  { icon: "wrench", label: "Tools", items: ["Git", "Docker", "Linux", "ESP8266", "JavaFX"] },
] as const;
