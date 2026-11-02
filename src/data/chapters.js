export const landmarks = {
  mosque: {
    id: "mosque",
    label: "Sheikh Zayed Grand Mosque",
    short: "The Grand Mosque",
    category: "ARCHITECTURE · CULTURE",
    number: "01",
    description:
      "A place of quiet grandeur. White domes, slender minarets, and rhythmic arcades become a small study in light, shadow, and folded paper.",
    fact: "Opened in 2007 · Abu Dhabi",
    color: "#e9dfcb",
  },
  towers: {
    id: "towers",
    label: "Etihad Towers",
    short: "Etihad Towers",
    category: "ARCHITECTURE · CITY",
    number: "02",
    description:
      "Five sculptural towers rise above the Corniche. Here, their sweeping silhouettes are reimagined as sharply creased, blue-grey cardstock.",
    fact: "Five towers · The Corniche",
    color: "#9aadb0",
  },
  mangroves: {
    id: "mangroves",
    label: "Abu Dhabi’s coastal gardens",
    short: "Coast & gardens",
    category: "LANDSCAPE · COAST",
    number: "03",
    description:
      "Palm-lined gardens meet the Arabian Gulf. Sage-green paper islands and overlapping pale blue coastline form the foreground of this handcrafted Abu Dhabi scene.",
    fact: "Palm-lined gardens · The Arabian Gulf",
    color: "#aab99b",
  },
};
export const chapters = [
  {
    id: "abu-dhabi",
    title: "Abu Dhabi",
    arabic: "أبوظبي",
    subtitle: "Where the story begins",
    index: "01",
    landmarks: ["mosque", "towers", "mangroves"],
    available: true,
    scene: [],
  },
  { id: "dubai", title: "Dubai", index: "02", available: false },
  { id: "sharjah", title: "Sharjah", index: "03", available: false },
  { id: "ajman", title: "Ajman", index: "04", available: false },
  {
    id: "umm-al-quwain",
    title: "Umm Al Quwain",
    index: "05",
    available: false,
  },
  {
    id: "ras-al-khaimah",
    title: "Ras Al Khaimah",
    index: "06",
    available: false,
  },
  { id: "fujairah", title: "Fujairah", index: "07", available: false },
];
