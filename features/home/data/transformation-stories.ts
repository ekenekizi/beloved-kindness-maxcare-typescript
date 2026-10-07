export type TransformationStory = {
  id: string;
  name: string;
  category: string;
  location: string;
  image: string;
  before: string;
  after: string;
  quote: string;
};

// Existing sample content and reference photographs.
// Replace with approved NGO stories and photographs before launch.
export const transformationStories: TransformationStory[] = [
  {
    id: "emeka",
    name: "Emeka Okonkwo",
    category: "Orphan Support",
    location: "Lagos, Nigeria",
    image: "/images/stories/story-emeka.jpg",
    before:
      "Orphaned at age 7, Emeka was living on the streets with no hope for the future.",
    after:
      "Today he holds a university scholarship and dreams of becoming an engineer.",
    quote:
      "BKM Maxcare gave me back my future. I now believe anything is possible.",
  },
  {
    id: "adaeze",
    name: "Adaeze Nwosu",
    category: "Widow Empowerment",
    location: "Enugu, Nigeria",
    image: "/images/stories/story-adaeze.jpg",
    before:
      "A widow of three years, Adaeze struggled to feed her four children after losing her husband.",
    after:
      "After completing vocational training, she now runs a successful tailoring business.",
    quote:
      "They did not just give me fish — they taught me how to fish. My children eat well now.",
  },
  {
    id: "twins",
    name: "Chukwudi & Tobechukwu",
    category: "Scholarship Program",
    location: "Abuja, Nigeria",
    image: "/images/stories/story-twins.jpg",
    before:
      "These twin brothers lost their parents and had no path to education.",
    after: "Both are now top students through the BKM scholarship programme.",
    quote:
      "We will use our education to give back to others, just as BKM gave to us.",
  },
];
