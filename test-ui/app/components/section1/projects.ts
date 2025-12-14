export interface Project {
  id: number;
  image: string;
  topTextLeft: string;
  topTextRight: string;
  middleText: string;
  bottomText: string;
  subtitle: string;
  date: string;
  company: string;
  performingGroup: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    image: "https://picsum.photos/id/101/800/1200", 
    topTextLeft: "PRESENTING",
    topTextRight: "JAPANESE",
    middleText: "THEATER",
    bottomText: "WORLDWIDE",
    subtitle: "(ABOUT SOIL)",
    date: "2025.6.25",
    company: "About",
    performingGroup: "Soil Collective"
  },
  {
    id: 2,
    image: "https://picsum.photos/id/203/800/1200", 
    topTextLeft: "ZEROKO",
    topTextRight: "MONONOME",
    middleText: "RE-CREATION",
    bottomText: "VERSION",
    subtitle: "(THIS YEAR'S SELECTED WORKS)",
    date: "2025.7.12",
    company: "cube inc.",
    performingGroup: "Zeroko"
  },
  {
    id: 3,
    image: "https://picsum.photos/id/435/800/1200", 
    topTextLeft: "FUTURE",
    topTextRight: "BOY",
    middleText: "CONAN",
    bottomText: "STAGE ADAPTATION",
    subtitle: "(THIS YEAR'S SELECTED WORKS)",
    date: "2025.8.01",
    company: "HoriPro Inc",
    performingGroup: "HoriPro Stage"
  },
  {
    id: 4,
    image: "https://picsum.photos/id/338/800/1200", 
    topTextLeft: "MUSICAL",
    topTextRight: "IN THIS",
    middleText: "CORNER OF THE",
    bottomText: "WORLD",
    subtitle: "(THIS YEAR'S SELECTED WORKS)",
    date: "2025.9.15",
    company: "TOHO CO., LTD.",
    performingGroup: "Toho Theatrical"
  }
];