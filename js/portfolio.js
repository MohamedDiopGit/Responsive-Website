import React, { useEffect, useState, useCallback } from 'https://cdn.skypack.dev/react';
import { createRoot } from 'https://cdn.skypack.dev/react-dom/client';
import { Sun, Moon, Menu, Github, Star } from 'https://cdn.skypack.dev/lucide-react';
import { motion } from 'https://cdn.skypack.dev/framer-motion';

/** -----------------------------------------------------
 * CONFIG: tailor without touching presentation logic
 * ----------------------------------------------------*/
const GITHUB_USERNAME = "MohamedDiopGit"; // change if you rename the account
const MAX_PROJECTS = 9; // keep UI snappy

/** Utility: fetch repos once, sort by stars then recent push */
async function loadRepos() {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
      { next: { revalidate: 60 * 60 } } // 1‑hour cache (for Next.js / RSC)
    );
    const all = await res.json();
    if (!Array.isArray(all)) return [];
    return all
      .sort((a, b) => {
        if (b.stargazers_count === a.stargazers_count)
          return new Date(b.pushed_at) - new Date(a.pushed_at);
        return b.stargazers_count - a.stargazers_count;
      })
      .slice(0, MAX_PROJECTS)
      .map((r) => ({
        id: r.id,
        title: r.name.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: r.description,
        category: r.language || "Misc",
        stars: r.stargazers_count,
        link: r.html_url,
      }));
  } catch {
    return [];
  }
}

function Portfolio() {
  /* ——— THEME ——— */
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ? "dark" : "light"
  );
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  /* ——— DATA ——— */
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const repos = await loadRepos();
    setProjects(repos);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const categories = [
    "All",
    ...Array.from(new Set(projects.map((p) => p.category))).filter(Boolean),
  ];
  const visibleProjects =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  /* ——— ANIMATIONS ——— */
  const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.45 },
    }),
  };

  return (
    React.createElement('div', { className: 'min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300' },
      React.createElement('header', { className: 'p-6 shadow-md flex justify-between items-center sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 z-50' },
        React.createElement('h1', { className: 'text-xl sm:text-2xl font-bold select-none flex items-center gap-2' },
          'Mohamed Diop ',
          React.createElement('span', { 'aria-label': 'sprout', role: 'img' }, '🌱')
        ),
        React.createElement('nav', { className: 'hidden md:flex space-x-6 font-medium' },
          [{ href: '#about', label: 'About' }, { href: '#projects', label: 'Projects' }, { href: '#contact', label: 'Contact' }].map(({ href, label }) =>
            React.createElement('a', { key: href, href, className: 'hover:underline underline-offset-4' }, label)
          )
        ),
        React.createElement('div', { className: 'flex items-center gap-4' },
          React.createElement('a', { href: `https://github.com/${GITHUB_USERNAME}`, 'aria-label': 'GitHub profile', className: 'p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800', target: '_blank', rel: 'noopener noreferrer' },
            React.createElement(Github, { size: 20 })
          ),
          React.createElement('button', { onClick: toggleTheme, 'aria-label': 'Toggle theme', className: 'p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-800 transition' },
            theme === 'light' ? React.createElement(Moon, { size: 20 }) : React.createElement(Sun, { size: 20 })
          ),
          React.createElement('label', { htmlFor: 'drawer', className: 'md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer' },
            React.createElement(Menu, { size: 20 })
          )
        )
      ),
      React.createElement('main', { className: 'px-4 sm:px-8 space-y-32' },
        React.createElement(motion.section, { id: 'about', variants: fadeUp, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 }, className: 'max-w-3xl mx-auto text-center' },
          React.createElement('h2', { className: 'text-3xl sm:text-4xl font-semibold mb-6' }, 'About Me'),
          React.createElement('p', { className: 'text-lg leading-relaxed' },
            'Polyvalent SWE blending ', React.createElement('span', { className: 'font-medium' }, 'system‑level efficiency'), ' and',
            React.createElement('span', { className: 'font-medium' }, ' product intuition'), '. From bare‑metal C to cloud‑native TS, I craft robust architectures and ship impact at scale. Open source believer, lifelong learner, optimized for clarity.'
          )
        ),
        React.createElement('section', { id: 'projects', className: 'max-w-5xl mx-auto' },
          React.createElement(motion.h2, { variants: fadeUp, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 }, className: 'text-3xl sm:text-4xl font-semibold text-center mb-10' }, 'Projects'),
          React.createElement('div', { className: 'flex flex-wrap justify-center gap-3 mb-12' },
            categories.map((c) =>
              React.createElement('button', {
                key: c,
                onClick: () => setFilter(c),
                className: `px-4 py-1.5 rounded-full border transition text-sm ${
                  filter === c
                    ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 border-gray-900 dark:border-gray-100'
                    : 'border-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`,
              }, c)
            )
          ),
          loading
            ? React.createElement('p', { className: 'text-center opacity-70' }, 'Loading GitHub repos…')
            : React.createElement(motion.div, { layout: true, className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8' },
                visibleProjects.map((p, i) =>
                  React.createElement(motion.a, {
                    key: p.id,
                    href: p.link,
                    target: '_blank',
                    rel: 'noopener noreferrer',
                    variants: fadeUp,
                    custom: i,
                    initial: 'hidden',
                    whileInView: 'visible',
                    viewport: { once: true, amount: 0.2 },
                    className: 'group border rounded-2xl p-6 shadow hover:shadow-xl transition h-full flex flex-col justify-between',
                  },
                    React.createElement('header', null,
                      React.createElement('h3', { className: 'text-xl font-bold mb-2 group-hover:underline underline-offset-4 flex items-center gap-2' },
                        p.title,
                        React.createElement('span', { className: 'inline-flex items-center gap-0.5 text-xs font-mono opacity-60' },
                          React.createElement(Star, { size: 14 }), ' ', p.stars
                        )
                      ),
                      React.createElement('p', { className: 'text-sm opacity-80 leading-relaxed mb-4 line-clamp-4' }, p.description || 'No description provided.')
                    ),
                    React.createElement('span', { className: 'text-xs font-mono opacity-60' }, p.category)
                  )
                )
              )
        ),
        React.createElement(motion.section, { id: 'contact', variants: fadeUp, initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.3 }, className: 'max-w-2xl mx-auto text-center' },
          React.createElement('h2', { className: 'text-3xl sm:text-4xl font-semibold mb-6' }, 'Contact'),
          React.createElement('p', { className: 'mb-4 text-lg' }, 'Open to challenging problems & coffee‑fuelled chats.'),
          React.createElement('a', { href: 'mailto:mohamed@example.com', className: 'inline-block px-6 py-3 rounded-xl bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 font-medium hover:scale-105 active:scale-95 transition' }, 'Say Hi')
        )
      ),
      React.createElement('footer', { className: 'text-center py-8 text-sm opacity-70' },
        `© ${new Date().getFullYear()} Mohamed Diop. Built with React, Tailwind & Framer Motion.`
      ),
      React.createElement('input', { type: 'checkbox', id: 'drawer', className: 'peer hidden' }),
      React.createElement('aside', { className: 'fixed inset-0 bg-black/40 backdrop-blur z-40 peer-checked:opacity-100 peer-checked:pointer-events-auto opacity-0 pointer-events-none transition' },
        React.createElement('div', { className: 'w-64 bg-white dark:bg-gray-950 h-full p-6 flex flex-col gap-6 shadow-xl' },
          [{ href: '#about', label: 'About' }, { href: '#projects', label: 'Projects' }, { href: '#contact', label: 'Contact' }].map(({ href, label }) =>
            React.createElement('a', {
              key: href,
              href,
              className: 'font-medium hover:underline',
              onClick: () => (document.getElementById('drawer').checked = false),
            }, label)
          )
        )
      )
    )
  );
}

createRoot(document.getElementById('root')).render(React.createElement(Portfolio));

