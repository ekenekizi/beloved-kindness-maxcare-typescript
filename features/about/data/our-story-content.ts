export type StoryCard = {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type OurStoryContent = {
  hero: {
    label: string;
    heading: string;
    headingHighlight: string;
    description: string;
    location: string;
    serviceArea: string;
    discoverButtonLabel: string;
    volunteerButtonLabel: string;
    image: string;
    imageAlt: string;
  };
  work: {
    label: string;
    heading: string;
    headingHighlight: string;
    description: string;
    footnote: string;
    cards: StoryCard[];
  };
};

export const defaultOurStoryContent: OurStoryContent = {
  hero: {
    label: "About Us",
    heading: "Restoring dignity.",
    headingHighlight: "Reaching the Unreached.",
    description:
      "Beloved Kindness Maxcare is aimed at reaching the Children, Adolescents and women through counselling, teaching and touching their lives. The charity aspect is geared towards a sustainable livelihood for the orphans, widows, less privileged and the low lives.",
    location: "Based in Lugbe FHA, Abuja",
    serviceArea: "Serving Abuja and surrounding communities",
    discoverButtonLabel: "Discover Our Work",
    volunteerButtonLabel: "Volunteer",
    image: "/images/about/bkm-about.png",
    imageAlt: "Beloved Kindness Maxcare community outreach",
  },
  work: {
    label: "Compassion in action",
    heading: "Small acts lasting",
    headingHighlight: "impact",
    description:
      "Consistent, reliable humanitarian rhythms structured around real human needs.",
    footnote: "Made possible by our members and partners.",
    cards: [
      {
        id: "monthly-outreach",
        label: "Monthly outreach",
        title: "Monthly orphanage outreach",
        description:
          "Every third Saturday, we visit orphanage homes with food, care and practical support.",
        image: "/images/about/orphanage-outreach.png",
        imageAlt:
          "Providing food and practical support during an orphanage outreach",
      },
      {
        id: "women-support",
        label: "Quarterly assistance",
        title: "Quarterly support for women",
        description:
          "Supporting widows and abandoned women through practical assistance and empowerment.",
        image: "/images/about/support-for-women.png",
        imageAlt: "Women receiving practical support and empowerment",
      },
      {
        id: "weekly-fellowship",
        label: "Weekly fellowship",
        title: "Weekly prayer and encouragement",
        description:
          "A welcoming space for prayer, spiritual encouragement and shared support.",
        image: "/images/about/weekly-prayers.png",
        imageAlt: "Women gathering for prayer and encouragement",
      },
    ],
  },
};
