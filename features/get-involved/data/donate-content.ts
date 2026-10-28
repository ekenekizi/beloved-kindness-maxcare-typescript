export type DonationFormIntro = { heading: string; description: string };
export type DonateContent = {
  hero: {
    label: string;
    heading: string;
    highlightLines: string[];
    description: string;
    image: string;
    imageAlt: string;
    captionTitle: string;
    captionDescription: string;
  };
  formIntro: DonationFormIntro;
  care: {
    label: string;
    headingLines: string[];
    description: string;
    cards: { id: string; title: string; description: string }[];
  };
  closing: { heading: string; description: string };
};
export const defaultDonateContent: DonateContent = {
  hero: {
    label: "Kindness starts with you",
    heading: "A little love.",
    highlightLines: ["A brighter", "tomorrow."],
    description:
      "Your generosity helps us stand alongside children, widows and communities. Give what you can, and be part of a story of hope.",
    image: "/images/partners/JoinUs.png",
    imageAlt: "A Beloved Kindness Maxcare volunteer with children",
    captionTitle: "Behind every gift, a human story.",
    captionDescription: "Care, dignity and a sense of belonging.",
  },
  formIntro: {
    heading: "Make a difference.",
    description: "Choose a gift that feels right for you.",
  },
  care: {
    label: "The heart of our work",
    headingLines: ["More care.", "More possibilities."],
    description:
      "Our work brings practical support and compassion to people who need a helping hand.",
    cards: [
      {
        id: "children",
        title: "Care for children",
        description:
          "Support the work of caring for children in orphanage homes, from everyday essentials to opportunities to learn.",
      },
      {
        id: "widows",
        title: "Hope for widows",
        description:
          "Stand alongside widows as they navigate hardship and work towards a more secure future.",
      },
      {
        id: "communities",
        title: "Stronger communities",
        description:
          "Help make outreach, education and practical community support possible.",
      },
    ],
  },
  closing: {
    heading: "Every act of kindness matters.",
    description:
      "Thank you for considering a gift to Beloved Kindness Maxcare.",
  },
};
