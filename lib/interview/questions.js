// The practice interview's fixed content, in English and Spanish (tú). Shared by the browser (to show the questions) and the
// server (to build them again from the category or listing and to write the AI's instructions), so there is one source of truth.
// Plain JavaScript, no imports.
export const QUESTIONS_PER_INTERVIEW = 3;
export const MAX_ANSWER_CHARS = 800; // the server enforces it; about 200 tokens, which keeps the cost predictable
export const MIN_ANSWER_CHARS = 10;

export const CATEGORIES = [
  {
    id: "entry-level",
    label: { en: "Entry-level job", es: "Primer empleo" },
    description: { en: "Your first role. Show your potential and attitude.", es: "Tu primer puesto. Muestra tu potencial y tu actitud." },
    questions: {
      en: [
        "Tell me about yourself and why you are interested in this role.",
        "Describe a time you learned something new quickly. How did you do it?",
        "What is your biggest strength, and how would it help our team?",
      ],
      es: [
        "Cuéntame sobre ti y por qué te interesa este puesto.",
        "Describe una vez que aprendiste algo nuevo rápidamente. ¿Cómo lo hiciste?",
        "¿Cuál es tu mayor fortaleza y cómo ayudaría a nuestro equipo?",
      ],
    },
  },
  {
    id: "internship",
    label: { en: "Internship", es: "Pasantía" },
    description: { en: "Show you are curious, reliable, and ready to learn.", es: "Muestra que eres curioso/a, confiable y que quieres aprender." },
    questions: {
      en: [
        "Why do you want this internship, and what do you hope to learn?",
        "Tell me about a project or class assignment you are proud of.",
        "How do you handle feedback or a task you find difficult?",
      ],
      es: [
        "¿Por qué quieres esta pasantía y qué esperas aprender?",
        "Cuéntame de un proyecto o una tarea de clase de la que te sientas orgulloso/a.",
        "¿Cómo manejas los comentarios o una tarea que se te hace difícil?",
      ],
    },
  },
  {
    id: "leadership",
    label: { en: "Leadership / fellowship", es: "Liderazgo / beca" },
    description: { en: "Share your vision and how you lift others up.", es: "Comparte tu visión y cómo apoyas a los demás." },
    questions: {
      en: [
        "Tell me about a time you led others toward a shared goal.",
        "Describe a challenge you faced as a leader and how you handled it.",
        "Why should we choose you for this fellowship, and what impact will you make?",
      ],
      es: [
        "Cuéntame de una vez que lideraste a otras personas hacia una meta común.",
        "Describe un reto que enfrentaste como líder y cómo lo manejaste.",
        "¿Por qué deberíamos elegirte para esta beca y qué impacto tendrás?",
      ],
    },
  },
];

// The three questions for "practice for this role": the same three for every listing, with its title and organization put in.
export const ROLE_QUESTIONS = {
  en: [
    "Tell me about yourself and why you are interested in {title} with {organization}.",
    "What experience or skills do you have that connect to this opportunity?",
    "What would you want to learn or achieve if you took part in this?",
  ],
  es: [
    "Cuéntame sobre ti y por qué te interesa {title} con {organization}.",
    "¿Qué experiencia o habilidades tienes que se conecten con esta oportunidad?",
    "¿Qué te gustaría aprender o lograr si participaras en esto?",
  ],
};

export function getCategory(id) {
  return CATEGORIES.find((category) => category.id === id) ?? null;
}

// Text from a listing goes into a question, so keep it short, on one line and free of angle brackets.
const tidy = (text, max) => String(text ?? "").replace(/[<>\n\r]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

// The three questions for a category, or for a listing ({ title, organization }), in a language.
export function buildQuestions({ lang, categoryId, listing }) {
  const language = lang === "es" ? "es" : "en";
  if (categoryId) {
    const category = getCategory(categoryId);
    return category ? [...category.questions[language]] : null;
  }
  if (listing) {
    const title = tidy(listing.title, 120);
    const organization = tidy(listing.organization, 120);
    return ROLE_QUESTIONS[language].map((q) => q.replaceAll("{title}", title).replaceAll("{organization}", organization));
  }
  return null;
}
