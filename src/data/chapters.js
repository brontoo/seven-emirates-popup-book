export const landmarks = {
  mosque: { id: 'mosque', label: 'Sheikh Zayed Grand Mosque', short: 'The Grand Mosque', category: 'ARCHITECTURE · CULTURE', number: '01', description: 'A place of quiet grandeur. White domes, slender minarets, and rhythmic arcades become a small study in light, shadow, and folded paper.', fact: 'Opened in 2007 · Abu Dhabi', color: '#e9dfcb' },
  towers: { id: 'towers', label: 'Etihad Towers', short: 'Etihad Towers', category: 'ARCHITECTURE · CITY', number: '02', description: 'Five sculptural towers rise above the Corniche. Here, their sweeping silhouettes are reimagined as sharply creased, blue-grey cardstock.', fact: 'Five towers · The Corniche', color: '#9aadb0' },
  mangroves: { id: 'mangroves', label: 'Mangrove National Park', short: 'The Mangroves', category: 'NATURE · COAST', number: '03', description: 'Beyond the skyline, a quieter world unfolds. Layered tidal water and paper-cut canopies celebrate Abu Dhabi’s coastal mangrove ecosystem.', fact: 'A coastal habitat · Abu Dhabi', color: '#8a9b79' },
  burj: { id: 'burj', label: 'A study of Dubai', short: 'Dubai skyline study', category: 'CHAPTER PREVIEW', number: '01', description: 'A simple folded-paper skyline demonstrates how another chapter fits into the same book. This is a procedural study; the full Dubai chapter is still to come.', fact: 'Chapter 02 · Paper study', color: '#b9b5a9' },
};
export const chapters = [
  { id: 'abu-dhabi', title: 'Abu Dhabi', arabic: 'أبوظبي', subtitle: 'Where the story begins', index: '01', landmarks: ['mosque', 'towers', 'mangroves'], available: true, scene: [{model:'mosque',position:[-2.17,.1,-.3]},{model:'towers',position:[1.56,.1,-.68]},{model:'mangroves',position:[2.44,.1,1.54]}] },
  { id: 'dubai', title: 'Dubai', arabic: 'دبي', subtitle: 'A glimpse of the next chapter', index: '02', landmarks: ['burj'], available: true, study: true, scene:[{model:'burj',position:[-1.65,.1,-.2]}] },
  { id: 'sharjah', title: 'Sharjah', index: '03', available: false },
  { id: 'ajman', title: 'Ajman', index: '04', available: false },
  { id: 'umm-al-quwain', title: 'Umm Al Quwain', index: '05', available: false },
  { id: 'ras-al-khaimah', title: 'Ras Al Khaimah', index: '06', available: false },
  { id: 'fujairah', title: 'Fujairah', index: '07', available: false },
];
