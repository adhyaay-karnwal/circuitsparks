/**
 * Repeated site copy. Drafted from the founding brief; review tier names,
 * topics, and FAQ answers with the curriculum team before launch.
 */

export type Tier = {
  id: string;
  name: string;
  focus: string;
  summary: string;
  topics: string[];
  prerequisite: string;
};

export const tiers: Tier[] = [
  {
    id: "spark",
    name: "Spark",
    focus: "Foundations",
    summary: "Circuits, current, and the breadboard. Students build working circuits from scratch.",
    topics: ["Breadboard wiring", "Voltage, current, resistance", "LEDs, switches, buzzers", "Reading schematics"],
    prerequisite: "No experience needed",
  },
  {
    id: "current",
    name: "Current",
    focus: "Microcontrollers",
    summary: "First programs that make hardware respond: blinking, timing, and reacting to input.",
    topics: ["How microcontrollers work", "Digital and analog I/O", "Loops, logic, timing", "Debugging code and circuits"],
    prerequisite: "After Spark",
  },
  {
    id: "signal",
    name: "Signal",
    focus: "Sensors & systems",
    summary: "Sensors, code, and circuits combined into a system, ending in a capstone build.",
    topics: ["Light, heat, motion sensors", "Turning readings into data", "Designing a full system", "Capstone showcase"],
    prerequisite: "After Current",
  },
];

export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  { q: "Who can attend?", a: "Middle school students in grades 6–8. No experience needed." },
  { q: "What does it cost?", a: "Nothing. Workshops, hardware, and materials are free for students, families, and host sites." },
  { q: "Where are workshops held?", a: "At partner public libraries and middle schools. Dates and locations are shared when each series opens." },
  { q: "Who teaches?", a: "High school engineers who have completed our mentor training, leading small groups." },
  { q: "Is CircuitSparks a registered nonprofit?", a: "Yes, a 501(c)(3). Donations are tax-deductible to the extent allowed by law." },
];
