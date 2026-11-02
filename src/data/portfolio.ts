export interface SkillGroup {
  title: string
  skills: string[]
}

export interface Project {
  title: string
  description: string
  highlights: string[]
  tech: string[]
  repo: string
  featured?: boolean
}

export interface EducationEntry {
  institution: string
  location: string
  qualification: string
  years: string
  result: string
  detail?: string
}

export interface CompetitiveProfile {
  platform: string
  count: string
  label: string
  href: string
}

export interface StatusRow {
  key: string
  value: string
}

export interface Portfolio {
  identity: {
    name: string
    titleLine: string
    summary: string
    heroSubline: string
    heroLabel: string
    heroTopLeft: string
    heroTopRight: string
  }
  links: {
    email: string
    github: string
    linkedin: string
  }
  about: {
    paragraph: string
    status: StatusRow[]
  }
  skills: SkillGroup[]
  projects: Project[]
  education: EducationEntry[]
  competitiveProgramming: CompetitiveProfile[]
  contact: {
    heading: string
    body: string
  }
  navbar: {
    wordmark: string
    links: { label: string; href: string }[]
    resumeLabel: string
  }
  footer: {
    note: string
  }
}

export const portfolio: Portfolio = {
  identity: {
    name: 'Armaan Amoli',
    titleLine: 'CS undergraduate · building products and AI agents',
    summary:
      'CS undergraduate who loves building things, from a terminal-based AI coding agent to full-stack trading platforms. Looking to build products and agents at a product company.',
    heroSubline: 'CS undergraduate building products and AI agents.',
    heroLabel: '✦ transmission received',
    heroTopLeft: 'sector 07 / portfolio',
    heroTopRight: 'building agents · shipping products',
  },

  links: {
    email: 'armaanmohanamoli@gmail.com',
    github: 'https://github.com/ArmaanAmoli',
    linkedin: 'https://www.linkedin.com/in/armaan-amoli-97132b300/',
  },

  about: {
    paragraph:
      "I'm a Computer Science undergraduate who loves building things — from a terminal-based AI coding agent to full-stack trading platforms. I work across the stack: TypeScript and Python on the back end, React and React Ink on the front, with real-time systems, streaming APIs and AI tooling along the way. I'm looking to build products and agents at a product company.",
    status: [
      { key: 'focus', value: 'AI agents & full-stack products' },
      { key: 'based in', value: 'Bhopal, India' },
      { key: 'studying', value: 'B.Tech CS (AI & DS), 5th sem' },
      { key: 'looking for', value: 'product-company roles' },
    ],
  },

  skills: [
    {
      title: 'Languages',
      skills: ['TypeScript', 'Python', 'C++'],
    },
    {
      title: 'Frontend',
      skills: ['React', 'React Ink', 'Vite', 'Next.js'],
    },
    {
      title: 'Backend',
      skills: [
        'Node.js',
        'Hono',
        'Express',
        'FastAPI',
        'REST APIs',
        'WebSockets',
        'Server-Sent Events',
      ],
    },
    {
      title: 'Databases / ORM',
      skills: ['SQLite', 'Drizzle ORM', 'MongoDB'],
    },
    {
      title: 'Agent / AI Tooling',
      skills: ['Model Context Protocol (MCP)', 'LLM streaming', 'tool-calling agent design'],
    },
    {
      title: 'Tools',
      skills: ['Git', 'Bun', 'npm', 'Zod'],
    },
  ],

  projects: [
    {
      title: 'BabyPanda: Autonomous AI Coding Agent',
      description:
        'TypeScript/Bun monorepo for an autonomous terminal-based coding assistant that uses streaming LLM responses to inspect repositories, modify files, execute shell commands, search the web, and maintain project-specific memory.',
      highlights: [
        'Event-driven agent orchestration loop that parses streamed model output into thoughts, answers, and MCP tool calls.',
        'MCP over stdio providing filesystem, shell, web search, webpage retrieval, notes, and memory-management tools.',
        'Hono HTTP + WebSocket server with streaming endpoints for sessions, messages, provider registration, and conversation history.',
        'Interactive React Ink CLI with incremental terminal rendering, scrollable history, live streamed responses, tool output, and reasoning display.',
        'SQLite persistence via Drizzle ORM for sessions, messages, API providers, tool-result classification, token usage, and compaction summaries.',
        'Context-window management that summarises older conversation and reloads recent messages for long-running sessions.',
        'Project-scoped memory under ~/.babypanda, structured logging, Zod validation, and retry handling for transient LLM/API failures.',
      ],
      tech: [
        'TypeScript',
        'Bun',
        'React',
        'Ink',
        'Hono',
        'SQLite',
        'Drizzle ORM',
        'MCP',
        'Axios',
        'Zod',
        'SSE',
        'Node.js streams',
      ],
      repo: 'https://github.com/ArmaanAmoli/BabyPanda',
      featured: true,
    },
    {
      title: 'Paper Trading App: Full-Stack Market Simulator',
      description:
        'Full-stack paper-trading platform simulating stock-market investing with live market data, technical analysis, trade execution, watchlists, and portfolio tracking.',
      highlights: [
        'Docker-containerised architecture: React + Vite frontend, Express API for auth and trade persistence, Python FastAPI service for real-time market data.',
        'JWT authentication and MongoDB persistence for accounts, trades, and portfolios.',
        'Yahoo Finance data pipeline in FastAPI delivering live quotes and indicators (SMA, EMA, RSI, Bollinger Bands).',
        'Buy/sell execution, stop-loss orders, and watchlists, with WebSocket streaming of live quotes and indicators to the frontend.',
      ],
      tech: [
        'React',
        'Vite',
        'Node.js',
        'Express',
        'Python',
        'FastAPI',
        'MongoDB',
        'WebSockets',
        'JWT',
        'Docker',
      ],
      repo: 'https://github.com/ArmaanAmoli/Paper-Trading-App',
    },
  ],

  education: [
    {
      institution: 'Lakshmi Narain College of Technology (RGPV)',
      location: 'Bhopal, Madhya Pradesh',
      qualification: 'B.Tech, Computer Science (Artificial Intelligence and Data Science)',
      years: '2024 – 2028',
      result: 'CGPA 8.55',
      detail: '5th semester (current)',
    },
    {
      institution: 'St. Joseph Co-Ed School (CBSE)',
      location: 'Kolar Road, Bhopal',
      qualification: 'Class XII · Class X',
      years: '2023 – 2024 · 2021 – 2022',
      result: 'Class XII: 91.2% · Class X: 91.1%',
    },
  ],

  competitiveProgramming: [
    {
      platform: 'LeetCode',
      count: '400+',
      label: 'problems solved',
      // TODO: verify username
      href: 'https://leetcode.com/u/Tiku_Badmash',
    },
    {
      platform: 'Codeforces',
      count: '40+',
      label: 'problems solved',
      href: 'https://codeforces.com/profile/ArmaanAmoli',
    },
  ],

  contact: {
    heading: "Let's build something.",
    body: 'Open to product-company roles where agents, streaming systems and real-time interfaces meet. If you are building something interesting, my inbox is open.',
  },

  navbar: {
    wordmark: 'AA / portfolio',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Skills', href: '#skills' },
      { label: 'Projects', href: '#projects' },
      { label: 'Education', href: '#education' },
      { label: 'Contact', href: '#contact' },
    ],
    resumeLabel: 'Resume',
  },

  footer: {
    note: 'built with React + WebGL',
  },
}
