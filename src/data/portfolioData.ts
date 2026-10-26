export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  period: string;
  location: string;
  category: "Digital Operations" | "Website Development" | "UI / UX Design";
  isInternational: boolean;
  country: string;
  flag: string;
  summary: string;
  responsibilities: string[];
  deliverables: string[];
  badgeAsset?: string;
  previewAsset?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  client: string;
  role: string;
  period: string;
  category: string;
  tagline: string;
  description: string;
  technicalHighlights: string[];
  architectureNotes: string;
  tags: string[];
  demoType?: "interactive-localization" | "operations-showcase" | "design-system" | "platform-architecture";
  assets: {
    hero?: string;
    logo?: string;
    screenshots?: string[];
  };
}

export interface SkillCategory {
  title: string;
  badge: string;
  description: string;
  skills: {
    name: string;
    note?: string;
    isCore?: boolean;
  }[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  status: string;
  highlights: string[];
}

export const PERSONAL_INFO = {
  name: "Soham Roychoudhury",
  headline: "Software & Web Development | Digital Operations",
  roleObjective: "Seeking Software Development & Web Development Internship Opportunities",
  educationBrief: "B.Tech in Computer Science and Engineering (AI & ML), Netaji Subhash Engineering College (2024–2028)",
  location: "Kolkata, West Bengal, India",
  timezone: "Asia/Kolkata (UTC+5:30)",
  email: "roychoudhurysoham006@gmail.com",
  phone: "+91 8240708402",
  phoneFormatted: "+91 82407 08402",
  coreMessage:
    "I build thoughtful digital experiences, solve practical technical problems, and bring together engineering, design, and digital operations.",
  heroSubtitle:
    "Software and web development, interactive interfaces, and digital operations — built around real-world requirements.",
};

export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "lcf",
    organization: "Latvian Cricket Federation",
    role: "Digital Operations Manager",
    period: "October 2025 – Present",
    location: "Riga, Latvia (Remote Coordination)",
    category: "Digital Operations",
    isInternational: true,
    country: "Latvia",
    flag: "🇱🇻",
    summary:
      "Overseeing digital operations, platform updates, match workflow assets, and administrative coordination for the national cricket governing body in Latvia.",
    responsibilities: [
      "Manage website updates and maintain digital federation platforms.",
      "Coordinate digital workflows, project deliverables, and technical coordination across tournament schedules.",
      "Support digital asset management and match publication pipelines for the Riga Premier League (RPL) and Baltic Cup.",
      "Maintain cross-border communication and digital scheduling consistency.",
    ],
    deliverables: [
      "Riga Premier League digital asset coordination",
      "Federation website content and digital scheduling",
      "Baltic Cup platform maintenance",
    ],
    badgeAsset: "/assets/lcf_logo.png",
    previewAsset: "/assets/lcf_emblem.png",
  },
  {
    id: "indiacenter",
    organization: "India Center",
    role: "Website Development & Digital Operations",
    period: "March 2026 – Present",
    location: "Cultural Exchange & Bilateral Initiatives",
    category: "Website Development",
    isInternational: true,
    country: "Cross-Border / India & Latvia",
    flag: "🇮🇳 / 🇱🇻",
    summary:
      "Managing end-to-end website development, content deployments, domain/DNS operations, and hosting troubleshooting for bilateral cultural initiatives.",
    responsibilities: [
      "Update and customize website pages and implement rapid content and event changes.",
      "Troubleshoot hosting, domain name records, and DNS configuration issues.",
      "Support ongoing website maintenance, responsiveness testing, and digital hygiene.",
      "Implement event landing pages and cultural showcase materials (e.g. India Day celebrations).",
    ],
    deliverables: [
      "Hosting & DNS record resolution & maintenance",
      "Interactive cultural event publication pages",
      "Responsive layout updates and continuous maintenance",
    ],
    badgeAsset: "/assets/indiacenter_culture.png",
    previewAsset: "/assets/indiacenter_journey.png",
  },
  {
    id: "izieat",
    organization: "IZIEAT Client Project",
    role: "Website Developer",
    period: "August 2026 – Present",
    location: "Agricultural Export Enterprise",
    category: "Website Development",
    isInternational: true,
    country: "Global B2B Trade",
    flag: "🌍",
    summary:
      "Engineered the official business website and a high-performance client-side multilingual localization system with 200+ structured translation keys for a global agricultural exporter.",
    responsibilities: [
      "Developed responsive website pages and interactive front-end features for international buyers.",
      "Architected a custom client-side localization system with 200+ structured translation keys.",
      "Organized industry-specific B2B agricultural terminology in a centralized translation dictionary.",
      "Enabled instant zero-latency language switching without relying on external third-party translation APIs.",
    ],
    deliverables: [
      "Production-ready B2B sweet corn export website",
      "270+ key client-side English / Russian dictionary matrix",
      "Zero-API-latency DOM translation engine",
    ],
    badgeAsset: "/assets/izieat_main_logo.png",
    previewAsset: "/assets/izieat_factory_about.png",
  },
  {
    id: "varti",
    organization: "Varti International",
    role: "Website Designer",
    period: "April 2026 – August 2026",
    location: "Global Trade & Export",
    category: "UI / UX Design",
    isInternational: true,
    country: "International Trade",
    flag: "🌐",
    summary:
      "Designed structured website page layouts, information architecture, visual consistency, and intuitive responsive navigation aligned with international trade requirements.",
    responsibilities: [
      "Designed website pages aligned with brand identity and strict business trade requirements.",
      "Created page layouts and organized content for a clear, consistent international user experience.",
      "Engineered global trade map highlights, intuitive navigation hierarchies, and responsive grid layouts.",
      "Maintained visual consistency across typography, color palettes, and presentation decks.",
    ],
    deliverables: [
      "Comprehensive website page designs & layout hierarchies",
      "Global export trade route map visualization",
      "Responsive mobile and desktop UI specifications",
    ],
    badgeAsset: "/assets/varti_logo.png",
    previewAsset: "/assets/varti_map.png",
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "izieat-localization",
    title: "IZIEAT — Business Website & Custom Localization System",
    client: "IZIEAT Private Limited (Agricultural Export)",
    role: "Website Developer",
    period: "August 2026 – Present",
    category: "Frontend Engineering & Client-Side i18n",
    tagline:
      "A custom-coded frontend web experience engineered with a zero-API client-side multilingual localization architecture supporting 200+ structured translation keys.",
    description:
      "Engineered a production-ready business website for an agricultural export company specializing in frozen sweet corn cobs and kernels. The flagship technical highlight is a proprietary client-side translation system designed to switch languages instantly across 200+ structured translation keys without incurring external API latency, recurring costs, or translation hallucination.",
    technicalHighlights: [
      "278 structured translation keys organized in a centralized JavaScript dictionary.",
      "Zero external API dependencies: 100% client-side deterministic execution with 0ms translation lag.",
      "Domain-specific B2B agricultural terminology (vacuum-cut cobs, brix sweetness, cold-chain blast freezing, shelf-life specifications).",
      "Reactive DOM attribute observers that update placeholder texts, labels, headings, and alt attributes dynamically.",
      "Frontend-only architectural constraint: Clean separation of concerns with no server-side translation overhead.",
      "Fully responsive layouts optimized for global trade clients across mobile and desktop viewports.",
    ],
    architectureNotes:
      "Architectural Decision: To preserve data privacy, eliminate per-character translation API costs, and guarantee instantaneous language toggling on low-bandwidth trade networks, translation keys were pre-compiled into a structured nested dictionary. When a language toggle event fires, the DOM parser queries data-i18n attributes and maps matching node text nodes deterministically.",
    tags: ["HTML5", "CSS3", "JavaScript", "Client-Side i18n", "DOM Manipulation", "B2B UI"],
    demoType: "interactive-localization",
    assets: {
      hero: "/assets/izieat_factory_about.png",
      logo: "/assets/izieat_main_logo.png",
      screenshots: [
        "/assets/izieat_frozen_cobs_pouch.png",
        "/assets/izieat_frozen_kernels_ref.png",
        "/assets/izieat_vacuum_cut_cobs.jpg",
      ],
    },
  },
  {
    id: "india-center-platform",
    title: "India Center — Digital Operations & Web Maintenance",
    client: "India Center Bilateral Cultural Platform",
    role: "Website Development & Digital Operations",
    period: "March 2026 – Present",
    category: "Web Infrastructure & Digital Operations",
    tagline:
      "Continuous web infrastructure management, hosting & DNS troubleshooting, and dynamic cultural showcase deployments.",
    description:
      "Responsible for the continuous technical health, domain records, hosting performance, and content lifecycle of the India Center website. The role requires bridging technical troubleshooting (DNS propagation, server uptime, SSL renewal) with rapid content deployment for international cultural events.",
    technicalHighlights: [
      "Troubleshooting hosting, domain configurations, CNAME, and DNS records.",
      "Rapid turnaround for high-visibility event microsites (e.g., India Day celebrations).",
      "Cross-device responsiveness audits and layout debugging.",
      "Content structure optimization for international cultural audiences.",
    ],
    architectureNotes:
      "Maintained zero-downtime DNS routing and organized reusable content sections to allow fast updates when event schedules change.",
    tags: ["DNS Operations", "Web Maintenance", "HTML/CSS", "Digital Workflows", "Domain Management"],
    demoType: "operations-showcase",
    assets: {
      hero: "/assets/indiacenter_journey.png",
      logo: "/assets/indiacenter_culture.png",
    },
  },
  {
    id: "lcf-digital-platform",
    title: "Latvian Cricket Federation — Digital Platforms & Operations",
    client: "Latvian Cricket Federation (LCF)",
    role: "Digital Operations Manager",
    period: "October 2025 – Present",
    category: "Sports Administration & Digital Operations",
    tagline:
      "Digital operations coordination, tournament asset workflows, and web management for Latvia's national governing sports body.",
    description:
      "Managing digital workflows and online platform integrity for the Latvian Cricket Federation. Coordinates digital publication pipelines for the Riga Premier League (RPL) and Baltic Cup tournaments, maintaining official branding standards and scheduling platforms.",
    technicalHighlights: [
      "Platform updates and digital schedule coordination for national tournaments.",
      "Digital workflow automation across tournament reporting and official announcements.",
      "Strict brand consistency using verified sports federation identity guidelines.",
      "Cross-border communication and time-zone aligned release management.",
    ],
    architectureNotes:
      "Standardized asset specifications and streamlined digital match publishing pipelines to ensure immediate post-match dissemination.",
    tags: ["Digital Operations", "Brand Identity", "Workflow Automation", "Sports Platforms"],
    demoType: "platform-architecture",
    assets: {
      hero: "/assets/lcf_emblem.png",
      logo: "/assets/lcf_logo.png",
      screenshots: ["/assets/lcf_monogram.png"],
    },
  },
  {
    id: "varti-international-design",
    title: "Varti International — Website Architecture & Interface Design",
    client: "Varti International Trade",
    role: "Website Designer",
    period: "April 2026 – August 2026",
    category: "UI Design & Information Architecture",
    tagline:
      "Structured website page layouts, global trade route visualization, and intuitive UX engineered for cross-border commerce.",
    description:
      "Designed the layout, visual hierarchy, and navigation systems for Varti International. Focused on communicating global trade logistics clearly to multinational partners through clean typography, clear callouts, and interactive global map visualizations.",
    technicalHighlights: [
      "Comprehensive page layouts designed for clarity in B2B international commerce.",
      "Engineered global trade highlight maps showing international transit corridors.",
      "Responsive design systems tested across diverse viewport resolutions.",
      "Clear visual hierarchy optimizing buyer inquiries and catalog navigation.",
    ],
    architectureNotes:
      "Created a modular visual grid system that allowed easy reordering of product lines without breaking visual balance.",
    tags: ["UI Design", "Information Architecture", "Wireframing", "Responsive Systems", "Brand Alignment"],
    demoType: "design-system",
    assets: {
      hero: "/assets/varti_map.png",
      logo: "/assets/varti_logo.png",
      screenshots: ["/assets/varti_map_edited.png"],
    },
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Programming",
    badge: "Core Languages",
    description: "Languages used for algorithmic problem solving, scripting, and application logic.",
    skills: [
      { name: "Python", note: "Scripting, Automation, AI/ML coursework", isCore: true },
      { name: "JavaScript", note: "ES6+, DOM Manipulation, Client-Side Architecture", isCore: true },
      { name: "C++", note: "Object-Oriented Programming, Fundamentals & DSA", isCore: true },
    ],
  },
  {
    title: "Frontend Development",
    badge: "Web Interfaces",
    description: "Building responsive, modern, and accessible user interfaces with clean markup.",
    skills: [
      { name: "HTML5", note: "Semantic structure & accessibility", isCore: true },
      { name: "CSS3", note: "Flexbox, CSS Grid, animations, variables", isCore: true },
      { name: "React.js", note: "Component architecture & state", isCore: true },
      { name: "Responsive Web Design", note: "Mobile-first layouts", isCore: true },
      { name: "DOM Manipulation", note: "Dynamic DOM events & mutations", isCore: true },
      { name: "UI Development", note: "Component-driven design systems", isCore: true },
    ],
  },
  {
    title: "Backend Technologies",
    badge: "Knowledge & Exposure",
    description: "Technical exposure and foundational backend knowledge for full-stack comprehension.",
    skills: [
      { name: "Node.js", note: "Runtime environment & package management" },
      { name: "Express.js", note: "RESTful route handlers & middleware" },
      { name: "REST APIs", note: "Endpoints, HTTP methods, JSON payloads" },
      { name: "SQL", note: "Relational queries, joins, schema design" },
      { name: "MySQL", note: "Database tables & relational modeling" },
    ],
  },
  {
    title: "Computer Science Fundamentals",
    badge: "Academic Rigor",
    description: "Theoretical and algorithmic principles from B.Tech Computer Science curriculum.",
    skills: [
      { name: "Data Structures & Algorithms", note: "Arrays, lists, trees, search & sort", isCore: true },
      { name: "Object-Oriented Programming (OOP)", note: "Encapsulation, inheritance, polymorphism", isCore: true },
      { name: "Database Management Systems (DBMS)", note: "ACID properties, normalization, relational algebra", isCore: true },
    ],
  },
  {
    title: "Tools & Engineering Workflows",
    badge: "Developer Productivity",
    description: "Tools, version control, and automation practices used to deliver real projects.",
    skills: [
      { name: "Git", note: "Branching, committing, staging, history", isCore: true },
      { name: "GitHub", note: "Remote repos, pull requests, collaboration", isCore: true },
      { name: "VS Code", note: "IDE configuration, debugging, extensions", isCore: true },
      { name: "API Integration", note: "Fetching, error handling, JSON parsing" },
      { name: "Workflow Automation", note: "Task scripting & operations pipelines", isCore: true },
      { name: "Debugging", note: "Browser DevTools, console debugging, network inspection", isCore: true },
    ],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: "B.Tech in Computer Science and Engineering (AI & ML)",
    institution: "Netaji Subhash Engineering College",
    period: "2024 – Present",
    location: "Kolkata, West Bengal, India",
    status: "Currently Enrolled (Expected Graduation: 2028)",
    highlights: [
      "Specialization: Artificial Intelligence & Machine Learning",
      "Rigorous coursework in Data Structures, Algorithms, Object-Oriented Programming, and DBMS",
      "Balancing undergraduate computer science engineering with practical international digital operations and web development",
    ],
  },
  {
    degree: "Higher Secondary (Class XII, ISC)",
    institution: "St. Mary's Convent School",
    period: "2024",
    location: "India",
    status: "Completed",
    highlights: [
      "Council for the Indian School Certificate Examinations (ISC)",
      "Strong foundation in Science, Mathematics, and Computer Science",
    ],
  },
  {
    degree: "Secondary Education (Class X, ICSE)",
    institution: "St. Mary's Convent School",
    period: "2022",
    location: "India",
    status: "Completed",
    highlights: [
      "Indian Certificate of Secondary Education (ICSE)",
      "Academic excellence and introduction to algorithmic problem solving",
    ],
  },
];
