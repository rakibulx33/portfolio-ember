import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { Github, Mail, Linkedin, ArrowDown, ExternalLink, Code2, Database, Cpu, Wrench, Star, GitFork, Users, BookMarked, Menu, X } from "lucide-react";
import { ABOUT, CONTACT, FIRST_NAME, GITHUB_USER, INTRO, LOCATION, NAME, OPEN_TO_WORK, ROLE, SAMPLE_PROJECTS, SITE_TITLE, SKILLS, SOCIALS } from "./config";

const portrait = { url: `${import.meta.env.BASE_URL}profile.jpg` };

const sections = [
  { id: "about", label: "01. whoami" },
  { id: "work", label: "02. ./projects" },
  { id: "stack", label: "03. skills.json" },
  { id: "activity", label: "04. git.log" },
  { id: "contact", label: "05. ping" },
];

const fallbackProjects = SAMPLE_PROJECTS.map((p) => ({ ...p, stargazers_count: 0, forks_count: 0 }));

const ICONS = { code: Code2, database: Database, cpu: Cpu, wrench: Wrench };
const stack = SKILLS.map((x) => ({ icon: ICONS[x.icon], label: x.label, items: [...x.items] }));

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5", "C++": "#f34b7d",
  C: "#555555", Java: "#b07219", "C#": "#178600", HTML: "#e34c26", CSS: "#563d7c", Shell: "#89e051",
};

type Repo = { name: string; description: string | null; language: string | null; stargazers_count: number; forks_count: number; html_url: string; fork?: boolean; updated_at?: string };
type GhUser = { public_repos: number; followers: number; following: number };
type Contrib = { date: string; count: number; level: number };

function Portfolio() {
  const heroImgRef = useRef<HTMLDivElement>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState<GhUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [contribTotal, setContribTotal] = useState<number | null>(null);
  const [contribDays, setContribDays] = useState<Contrib[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.3, smoothWheel: true });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (!GITHUB_USER) return () => lenis.destroy(); // no GitHub user set: show the sample content
    (async () => {
      try {
        const [u, r] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USER}`).then((x) => x.json()),
          fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`).then((x) => x.json()),
        ]);
        if (u && typeof u.public_repos === "number") setUser(u);
        if (Array.isArray(r)) {
          const owned = r.filter((x: Repo) => !x.fork);
          setRepos(owned);
          setTotalStars(owned.reduce((a: number, b: Repo) => a + (b.stargazers_count || 0), 0));
        }
      } catch { /* fallback */ }
    })();

    // Real GitHub contribution count
    (async () => {
      try {
        const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`).then((x) => x.json());
        if (res?.total != null) {
          const t = typeof res.total === "object"
            ? Object.values(res.total).reduce((a: number, b) => a + (b as number), 0)
            : res.total;
          setContribTotal(t as number);
        }
        if (Array.isArray(res?.contributions)) setContribDays(res.contributions);
      } catch { /* fallback */ }
    })();

    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = heroImgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      setTilt({ x: Math.max(-0.5, Math.min(0.5, x)), y: Math.max(-0.5, Math.min(0.5, y)) });
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const { scrollYProgress } = useScroll();
  const progressBar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const featured = useMemo(() => {
    const src = repos.length ? [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count || (b.updated_at || "").localeCompare(a.updated_at || "")).slice(0, 6) : fallbackProjects;
    return src as Repo[];
  }, [repos]);

  const languages = useMemo(() => {
    const counts: Record<string, number> = {};
    (repos.length ? repos : []).forEach((r) => { if (r.language) counts[r.language] = (counts[r.language] || 0) + 1; });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    if (!total) return [] as { name: string; pct: number; color: string }[];
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]).slice(0, 6)
      .map(([name, v]) => ({ name, pct: (v / total) * 100, color: LANG_COLORS[name] || "#ff6b1a" }));
  }, [repos]);

  return (
    <div className="relative min-h-screen text-foreground font-body overflow-x-hidden">
      {/* Static ember background (replaces the old 3D animation) */}
      <div
        aria-hidden
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(80% 55% at 72% 8%, oklch(0.46 0.15 45 / 0.38), transparent 60%)," +
            "radial-gradient(70% 50% at 12% 78%, oklch(0.42 0.18 20 / 0.30), transparent 65%)," +
            "#0a0606",
        }}
      />

      <motion.div
        style={{ scaleX: progressBar }}
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-gradient-to-r from-ember via-accent to-rose"
      />

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-40 px-6 lg:px-12 py-5 flex items-center justify-between">
        <a href="#top" className="font-mono text-sm tracking-tight mix-blend-difference text-white">
          {SITE_TITLE}<span className="text-ember">.</span>dev
        </a>
        <div className="hidden md:flex gap-7 font-mono text-xs text-white/70 mix-blend-difference">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="hover:text-white transition-colors">
              {s.label}
            </a>
          ))}
        </div>
        <button
          aria-label="Menu"
          onClick={() => setNavOpen(true)}
          className="md:hidden size-10 rounded-full glass flex items-center justify-center"
        >
          <Menu size={18} />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {navOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex justify-end p-6">
              <button aria-label="Close" onClick={() => setNavOpen(false)} className="size-10 rounded-full glass flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            <motion.div
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="px-8 pt-10 flex flex-col gap-6 font-display text-4xl"
            >
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} onClick={() => setNavOpen(false)} className="hover:ember-text transition-all">
                  {s.label}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section id="top" className="relative min-h-screen flex items-center px-6 lg:px-16 pt-28 pb-16 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative z-10"
          >
            {OPEN_TO_WORK && (
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 font-mono text-xs">
                <span className="size-1.5 rounded-full bg-ember animate-pulse" />
                {OPEN_TO_WORK}
              </div>
            )}
            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter">
              Hi, I'm
              <br />
              <span className="ember-text">{NAME}</span>
            </h1>
            <p className="mt-8 font-mono text-sm text-ember">~$ {ROLE}<span className="animate-pulse">|</span></p>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              {INTRO}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#work" className="group relative px-7 py-3.5 rounded-full bg-gradient-to-r from-ember to-rose text-primary-foreground font-medium ember-glow hover:scale-[1.03] transition-transform">
                View My Work →
              </a>
              <a href="#contact" className="px-7 py-3.5 rounded-full glass hover:border-ember/50 transition-colors">
                Get in Touch
              </a>
            </div>
            <div className="mt-12 flex gap-5 text-muted-foreground">
              <a href={SOCIALS.github} aria-label="GitHub" className="hover:text-ember transition-colors"><Github size={20} /></a>
              <a href={`mailto:${CONTACT.email}`} aria-label="Email" className="hover:text-ember transition-colors"><Mail size={20} /></a>
              <a href={SOCIALS.linkedin} aria-label="LinkedIn" className="hover:text-ember transition-colors"><Linkedin size={20} /></a>
            </div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            ref={heroImgRef}
            initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `perspective(1200px) rotateY(${tilt.x * 12}deg) rotateX(${-tilt.y * 12}deg)`,
              transformStyle: "preserve-3d",
            }}
            className="lg:col-span-5 relative aspect-[4/5] max-w-md mx-auto lg:mx-0 lg:ml-auto transition-transform duration-200 ease-out will-change-transform"
          >
            {/* rotating gradient halo */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-10 rounded-full opacity-70 blur-3xl pointer-events-none"
              style={{ background: "conic-gradient(from 0deg, oklch(0.78 0.18 55 / 0.55), oklch(0.65 0.22 25 / 0.4), oklch(0.78 0.18 55 / 0.1), oklch(0.78 0.18 55 / 0.55))" }}
            />
            {/* floating ember orbs */}
            <motion.span
              animate={{ y: [0, -18, 0], x: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-2 size-3 rounded-full bg-ember ember-glow"
            />
            <motion.span
              animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -left-4 size-2 rounded-full bg-rose ember-glow"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative h-full rounded-[2rem] overflow-hidden ember-glow border border-ember/30 group"
              style={{ transform: "translateZ(40px)" }}
            >
              <img
                src={portrait.url}
                alt={`${NAME} portrait`}
                className="h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[1200ms] ease-out"
                style={{ filter: "contrast(1.05) saturate(1.1)" }}
              />
              {/* color blend overlay matching site palette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(160deg, oklch(0.78 0.18 55 / 0.18), transparent 40%, oklch(0.14 0.02 30 / 0.55))", mixBlendMode: "soft-light" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(120% 80% at 80% 20%, oklch(0.65 0.22 25 / 0.35), transparent 60%)" }}
              />
              {/* animated scan line */}
              <motion.div
                animate={{ y: ["-10%", "110%"] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-x-0 h-24 pointer-events-none"
                style={{ background: "linear-gradient(180deg, transparent, oklch(0.78 0.18 55 / 0.25), transparent)" }}
              />
              {/* sweeping shine */}
              <motion.div
                animate={{ x: ["-120%", "220%"] }}
                transition={{ duration: 5, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                className="absolute inset-y-0 w-1/3 pointer-events-none skew-x-12"
                style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }}
              />
              {/* subtle grid */}
              <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: "linear-gradient(oklch(0.97 0.01 60) 1px, transparent 1px), linear-gradient(90deg, oklch(0.97 0.01 60) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              <div className="absolute inset-0 ring-1 ring-inset ring-ember/20 rounded-[2rem]" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[10px] text-white/80">
                <span className="px-2 py-1 rounded-full bg-black/40 backdrop-blur">~/{LOCATION}</span>
                <span className="px-2 py-1 rounded-full bg-black/40 backdrop-blur flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" /> online
                </span>
              </div>
            </motion.div>
          </motion.div>

        </div>

        <motion.a
          href="#about"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground"
          aria-label="Scroll"
        >
          <ArrowDown size={22} />
        </motion.a>
      </section>

      {/* Stats strip */}
      <section className="relative px-6 lg:px-16 py-12 border-y border-border/40 bg-background/30 backdrop-blur overflow-hidden">
        <motion.div
          aria-hidden
          animate={{ x: ["-10%", "10%"] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
          className="absolute inset-y-0 -left-20 -right-20 pointer-events-none opacity-50"
          style={{ background: "radial-gradient(60% 80% at 50% 50%, oklch(0.78 0.18 55 / 0.10), transparent 70%)" }}
        />
        <div className="relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { icon: GitFork, label: "Contributions / yr", value: contribTotal ?? 0, highlight: true },
            { icon: BookMarked, label: "Repositories", value: user?.public_repos ?? 15 },
            { icon: Star, label: "Stars Earned", value: totalStars },
            { icon: Users, label: "Followers", value: user?.followers ?? 2 },
            { icon: Code2, label: "Projects Shipped", value: Math.max(repos.length, 12) },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              className="text-center"
            >
              <s.icon className="mx-auto text-ember mb-2" size={20} />
              <div className={`font-display text-3xl font-bold ${s.highlight ? "ember-text" : "ember-text"}`}>
                <CountUp value={s.value} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>


      {/* About */}
      <Section id="about" badge="01. whoami" title="About Me">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-3 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <h3 className="text-3xl font-display font-semibold text-foreground">{ABOUT.heading}</h3>
            {ABOUT.paragraphs.map((t) => <p key={t}>{t}</p>)}
          </div>
          <div className="lg:col-span-2 glass rounded-3xl p-8 space-y-4">
            {ABOUT.highlights.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 font-mono text-sm"
              >
                <span className="text-ember">▸</span> {item}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Projects */}
      <Section id="work" badge="02. ls ./projects" title="Featured Projects">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((p, i) => (
            <motion.a
              key={p.name}
              href={p.html_url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="group glass rounded-2xl p-7 block hover:border-ember/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="font-mono text-xs text-ember">/{String(i + 1).padStart(2, "0")}</span>
                <ExternalLink size={16} className="opacity-40 group-hover:opacity-100 group-hover:text-ember transition-all" />
              </div>
              <h3 className="font-display text-2xl font-semibold mb-3 group-hover:ember-text transition-all break-words">{p.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5 min-h-[3rem]">
                {p.description || "A crafted project — open the repo for details."}
              </p>
              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
                {p.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="size-2 rounded-full" style={{ background: LANG_COLORS[p.language] || "#ff6b1a" }} />
                    {p.language}
                  </span>
                )}
                <span className="inline-flex items-center gap-1"><Star size={12} /> {p.stargazers_count}</span>
                <span className="inline-flex items-center gap-1"><GitFork size={12} /> {p.forks_count}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </Section>

      {/* Stack */}
      <Section id="stack" badge="03. cat skills.json" title="Tech Stack">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stack.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6"
            >
              <s.icon className="text-ember mb-4" size={22} />
              <h4 className="font-display font-semibold mb-4">{s.label}</h4>
              <div className="flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <span key={it} className="font-mono text-xs px-2 py-1 rounded bg-white/5 text-muted-foreground">{it}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Activity / Languages */}
      <Section id="activity" badge="04. git log --graph" title="Live from GitHub">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 glass rounded-2xl p-7">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-display text-xl font-semibold">Contribution Pulse</h4>
              <span className="font-mono text-[11px] text-muted-foreground">
                {contribTotal != null ? <><span className="ember-text font-semibold"><CountUp value={contribTotal} /></span> contributions · last year</> : "last 26 weeks"}
              </span>
            </div>
            <Heatmap repos={repos} contribDays={contribDays} />
            <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
              <span>less</span>
              {[0.1, 0.25, 0.5, 0.75, 1].map((v) => (
                <span key={v} className="size-3 rounded-sm" style={{ background: `oklch(0.78 0.18 55 / ${v})` }} />
              ))}
              <span>more</span>
            </div>
          </div>
          <div className="lg:col-span-2 glass rounded-2xl p-7">
            <h4 className="font-display text-xl font-semibold mb-5">Language Mix</h4>
            <LanguageDonut languages={languages} />
          </div>
        </div>
      </Section>

      {/* Contact */}
      <Section id="contact" badge={`05. ping ${FIRST_NAME.toLowerCase()}`} title="Let's Build Something Amazing">
        <div className="max-w-3xl">
          <p className="text-xl text-muted-foreground leading-relaxed mb-10">
            {CONTACT.lede}
          </p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="group inline-flex items-center gap-4 font-display text-3xl sm:text-5xl font-semibold ember-text hover:gap-6 transition-all break-all"
          >
            {CONTACT.email}
            <ArrowDown className="rotate-[-90deg] shrink-0" size={32} />
          </a>
          <div className="mt-16 flex gap-5">
            {[
              { icon: Github, href: SOCIALS.github, label: "GitHub" },
              { icon: Mail, href: `mailto:${CONTACT.email}`, label: "Email" },
              { icon: Linkedin, href: SOCIALS.linkedin, label: "LinkedIn" },
            ].map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="size-12 rounded-full glass flex items-center justify-center hover:text-ember hover:border-ember/50 transition-all">
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </Section>

      <footer className="relative px-6 lg:px-16 py-10 font-mono text-xs text-muted-foreground flex flex-wrap justify-between gap-4 border-t border-border">
        <span>© {new Date().getFullYear()} {NAME}</span>
        <span>crafted with care · scroll to top ↑</span>
      </footer>
    </div>
  );
}

function Section({ id, badge, title, children }: { id: string; badge: string; title: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={ref} id={id} className="relative px-6 lg:px-16 py-32 lg:py-44">
      <motion.div style={{ y }} className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs text-ember mb-4"
        >
          {badge}
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter mb-14"
        >
          {title}
        </motion.h2>
        {children}
      </motion.div>
    </section>
  );
}

function Heatmap({ repos, contribDays }: { repos: Repo[]; contribDays: Contrib[] }) {
  const cells = useMemo(() => {
    const weeks = 26, days = 7, total = weeks * days;
    if (contribDays && contribDays.length) {
      const recent = contribDays.slice(-total);
      const max = Math.max(1, ...recent.map((d) => d.count));
      // pad if fewer
      const padded = recent.length < total ? [...new Array(total - recent.length).fill(0).map(() => 0), ...recent.map((d) => d.count / max)] : recent.map((d) => d.count / max);
      return padded;
    }
    const buckets = new Array(total).fill(0);
    repos.forEach((r, idx) => {
      const t = r.updated_at ? new Date(r.updated_at).getTime() : Date.now() - idx * 86400000;
      const daysAgo = Math.floor((Date.now() - t) / 86400000);
      if (daysAgo < total) buckets[total - 1 - daysAgo] += 2;
    });
    for (let i = 0; i < buckets.length; i++) {
      const noise = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
      if (noise > 0.55) buckets[i] += noise * 3;
    }
    const max = Math.max(1, ...buckets);
    return buckets.map((v) => v / max);
  }, [repos, contribDays]);

  return (
    <div
      className="grid grid-flow-col grid-rows-7 gap-[3px] sm:gap-1"
      style={{ gridTemplateColumns: "repeat(26, minmax(0, 1fr))" }}
    >
      {cells.map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: (i % 26) * 0.012, duration: 0.4 }}
          className="aspect-square rounded-sm"
          style={{ background: v < 0.05 ? "oklch(0.97 0.01 60 / 0.06)" : `oklch(0.78 0.18 55 / ${0.15 + v * 0.85})` }}
        />
      ))}
    </div>
  );
}

function CountUp({ value, duration = 1400 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);
  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;
    let raf = 0;
    const step = (t: number) => {
      if (startRef.current == null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(fromRef.current + (value - fromRef.current) * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <>{display.toLocaleString()}</>;
}


function LanguageDonut({ languages }: { languages: { name: string; pct: number; color: string }[] }) {
  const data = languages.length ? languages : [
    { name: "TypeScript", pct: 35, color: LANG_COLORS.TypeScript },
    { name: "JavaScript", pct: 25, color: LANG_COLORS.JavaScript },
    { name: "Python", pct: 18, color: LANG_COLORS.Python },
    { name: "C++", pct: 12, color: LANG_COLORS["C++"] },
    { name: "Java", pct: 10, color: LANG_COLORS.Java },
  ];
  const r = 60, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="size-40 -rotate-90 shrink-0">
        <circle cx="80" cy="80" r={r} fill="none" stroke="oklch(0.97 0.01 60 / 0.08)" strokeWidth="16" />
        {data.map((d) => {
          const len = (d.pct / 100) * c;
          const el = (
            <circle key={d.name} cx="80" cy="80" r={r} fill="none" stroke={d.color} strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />
          );
          offset += len;
          return el;
        })}
      </svg>
      <ul className="space-y-2 font-mono text-xs flex-1">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="text-muted-foreground">{d.pct.toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Portfolio;
