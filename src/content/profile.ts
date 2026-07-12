/**
 * Rafia's own words — homepage copy, the About note, the Contact note,
 * and the "currently thinking about" list. Edit copy here, never inside
 * components.
 */

export const homepage = {
  heading: "Hi, I’m Rafia ♡",
  statement:
    "I build things somewhere between technology, research, people, and slightly overambitious ideas.",
  supporting:
    "This is my portfolio, but it works more like my brain: everything is connected, several tabs are open, and something new is always being built.",
  actions: {
    explore: "Explore my brain",
    tour: "Take the guided tour",
    search: "Search my work",
  },
  currentlyThinkingAbout: [
    "AI for healthcare",
    "Student housing",
    "Climate and public health",
    "Knowledge graphs",
    "Marketing systems",
    "Human-centred technology",
    "Why every small project becomes a full system",
  ],
} as const;

export const about = {
  intro: [
    "I’m Rafia—a computer science student who keeps wandering into research, products, marketing, games, and slightly overambitious side projects.",
    "Most of my work sits somewhere between technology and people: making complicated systems easier to understand, using AI for problems that matter, designing products around real users, or figuring out why a good product still needs a good story.",
    "This portfolio is structured like my second brain because a normal list of projects could never explain how everything connects.",
  ],
  sections: [
    {
      id: "build",
      title: "What I build",
      body: "Products and pipelines: a student housing platform, a weather-data pipeline with event detection, civic-tech built under hackathon pressure, and marketing systems that treat content as engineering.",
    },
    {
      id: "research",
      title: "What I research",
      body: "How multimodal climate, health, disaster, and media data can support explainable district-level risk understanding in Pakistan — currently 48 organised papers deep.",
    },
    {
      id: "care",
      title: "What I care about",
      body: "Technology pointed at problems that matter: public health, climate, honest information for students, and systems that stay understandable to the people who use them.",
    },
    {
      id: "learning",
      title: "What I am learning",
      body: "Knowledge graphs, NLP for messy real-world text, and how to make AI-generated visuals believable enough to earn trust.",
    },
    {
      id: "building",
      title: "Currently building",
      body: "HostelWalla — a student-first hostel discovery platform — alongside ongoing climate & health research.",
    },
  ],
} as const;

export const contact = {
  heading: "Say hi",
  body: "The fastest ways to reach me are below. If a link is still marked as coming soon, it is a placeholder — the real one is being added.",
  microcopy: "Hi, you found me.",
} as const;

export const tinyExperiments = {
  heading: "Tiny Experiments",
  body: "Small things that didn’t need to become full projects (yet). This collection is being catalogued — experiments will appear here as they’re written up.",
  microcopy: "This thought wandered off.",
} as const;
