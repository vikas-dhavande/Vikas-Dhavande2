import { InlineCode } from "@/once-ui/components";

const person = {
  firstName: "Vikas",
  lastName: "Dhavande",
  get name() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: "Senior Full Stack & AI Systems Engineer",
  avatar: "/images/avatar.jpg",
  location: "Asia/Kolkata", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English", "Hindi", "Marathi"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter = {
  display: true,
  title: <>Subscribe to {person.firstName}&apos;s Tech Dispatch</>,
  description: (
    <>
      Insights on modern full-stack engineering, cloud architecture, AI workflows, and building
      high-impact software products.
    </>
  ),
};

const social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/vikas-dhavande",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/vikas-dhavande/",
  },
  {
    name: "X",
    icon: "x",
    link: "https://x.com/vikasdhavande",
  },
  {
    name: "Email",
    icon: "email",
    link: "mailto:vikasndhavande@gmail.com",
  },
];

const home = {
  label: "Home",
  title: `${person.name} | Full Stack Engineer & Architect`,
  description: `Portfolio website showcasing the engineering work and projects of ${person.name}`,
  headline: <>Engineering Scalable Web Systems & Intelligent Experiences</>,
  subline: (
    <>
      I&apos;m Vikas, a Software Engineer specializing in <InlineCode>Next.js</InlineCode>, cloud
      architectures, and AI-enabled product ecosystems. Dedicated to clean code, resilient systems,
      and seamless user experiences.
    </>
  ),
};

const about = {
  label: "About",
  title: "About me",
  description: `Meet ${person.name}, ${person.role} from ${person.location}`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: true,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Vikas Dhavande is a passionate software engineer and systems builder dedicated to crafting
        scalable web applications, robust backend architectures, and intelligent software
        solutions. His work spans modern frontend ecosystems, distributed services, and
        developer-focused engineering practices.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Tech Systems & Engineering",
        timeframe: "2022 - Present",
        role: "Senior Full Stack Engineer",
        achievements: [
          <>
            Architected and deployed high-performance web applications using Next.js and TypeScript,
            improving Core Web Vitals and lowering end-user latency by 35%.
          </>,
          <>
            Integrated AI-assisted developer workflows and automated testing pipelines, enhancing
            team velocity and release stability.
          </>,
        ],
        images: [
          // optional: leave the array empty if you don't want to display images
          {
            src: "/images/projects/project-01/cover-01.jpg",
            alt: "System Architecture & Engineering Project",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        company: "Software Innovations Lab",
        timeframe: "2020 - 2022",
        role: "Software Engineer",
        achievements: [
          <>
            Built resilient microservices, REST APIs, and database migrations serving high-traffic
            production demands with 99.9% uptime.
          </>,
          <>
            Collaborated closely with UX and product teams to establish accessible, reusable design
            system component libraries.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Studies",
    institutions: [
      {
        name: "Computer Science & Engineering",
        description: <>Bachelor&apos;s degree with focus on software engineering and systems design.</>,
      },
      {
        name: "Advanced Distributed Systems & AI Engineering",
        description: <>Specialized coursework in cloud architecture, modern web stacks, and LLM orchestration.</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Full Stack & Next.js Ecosystem",
        description: <>End-to-end web engineering with Next.js App Router, React, TypeScript, and Once UI.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-02.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
          {
            src: "/images/projects/project-01/cover-03.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
      {
        title: "Backend, Cloud & AI Systems",
        description: <>Microservices, REST/GraphQL APIs, PostgreSQL, Docker, CI/CD, and AI agent integration.</>,
        // optional: leave the array empty if you don't want to display images
        images: [
          {
            src: "/images/projects/project-01/cover-04.jpg",
            alt: "Project image",
            width: 16,
            height: 9,
          },
        ],
      },
    ],
  },
};

const blog = {
  label: "Blog",
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work = {
  label: "Work",
  title: "My projects",
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery = {
  label: "Gallery",
  title: "My photo gallery",
  description: `A photo collection by ${person.name}`,
  // Images from https://pexels.com
  images: [
    {
      src: "/images/gallery/img-01.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-02.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-03.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-04.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-05.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-06.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-07.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-08.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-09.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-10.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-11.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/img-12.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-13.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/img-14.jpg",
      alt: "image",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
