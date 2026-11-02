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
  museum: {
    id: "museum",
    label: "Museum of the Future",
    short: "Museum of the Future",
    category: "DESIGN · TOMORROW",
    number: "01",
    description:
      "An oval window into what comes next. Layered ivory cardstock reimagines the museum’s sweeping ring, open centre, and calligraphic surface as a folding paper sculpture.",
    fact: "Opened in 2022 · Sheikh Zayed Road",
    color: "#e9ddc2",
  },
  "burj-khalifa": {
    id: "burj-khalifa",
    label: "Burj Khalifa",
    short: "Burj Khalifa",
    category: "ARCHITECTURE · SKYLINE",
    number: "02",
    description:
      "A slender stepped silhouette anchors Dubai’s skyline. Its setbacks and needle-like spire are cut into blue paper blades that fold flat at the binding.",
    fact: "828 metres · Downtown Dubai",
    color: "#a5bbc8",
  },
  "emirates-towers": {
    id: "emirates-towers",
    label: "Emirates Towers",
    short: "Emirates Towers",
    category: "ARCHITECTURE · CITY",
    number: "03",
    description:
      "Two sharply angled crowns frame the city from the left of the page. Their blue-grey façades, cut-out windows, and scored sides share the same paper language as Abu Dhabi.",
    fact: "Twin towers · Sheikh Zayed Road",
    color: "#b0c2cc",
  },
  metro: {
    id: "metro",
    label: "Dubai Metro",
    short: "Dubai Metro",
    category: "MOBILITY · CONNECTION",
    number: "04",
    description:
      "A cream paper viaduct curves through the right-hand skyline. Equal-length hinged piers support its elevated track, while a small folding carriage rests above the rail.",
    fact: "Opened in 2009 · Connected across the city",
    color: "#c6cbbd",
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
  },
  {
    id: "dubai",
    title: "Dubai",
    index: "02",
    arabic: "دبي",
    subtitle: "A city looking ahead",
    landmarks: ["museum", "burj-khalifa", "emirates-towers", "metro"],
    available: true,
  },
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
