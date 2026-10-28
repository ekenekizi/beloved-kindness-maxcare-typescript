export type InvolvementHero = {
  label: string;
  heading: string;
  highlightLines: string[];
  description: string;
  primaryButtonLabel: string;
  secondaryButtonLabel: string;
  image: string;
  imageAlt: string;
  captionTitle: string;
  captionDescription: string;
};
export type PartnershipContent = {
  areasHeadingLines: string[];
  areasDescription: string;
  orphanageDescription: string;
  orphanageFootnote: string;
  widowDescription: string;
  widowFootnote: string;
  formLabel: string;
  formHeadingLines: string[];
  formDescription: string;
  steps: { id: string; title: string; description: string }[];
  formFootnote: string;
};
export type PartnerContent = {
  hero: InvolvementHero;
  partnership: PartnershipContent;
};
export type VolunteerContent = {
  hero: InvolvementHero;
  waysToHelp: { id: string; title: string; description: string }[];
};
export const defaultPartnerContent: PartnerContent = {
  hero: {
    label: "Together, we can do more",
    heading: "Your kindness.",
    highlightLines: ["Their next", "chapter."],
    description:
      "Partner with Beloved Kindness Maxcare to support children in orphanage homes and help widows build a more secure future.",
    primaryButtonLabel: "Become a partner",
    secondaryButtonLabel: "Explore ways to help",
    image: "/images/gallery/orphanageVisit3.jpg",
    imageAlt:
      "Children and visitors together during a Beloved Kindness Maxcare orphanage outreach",
    captionTitle: "Small acts. Meaningful care.",
    captionDescription: "Orphanage visits & community support",
  },
  partnership: {
    areasHeadingLines: ["Where would you", "like to make a difference?"],
    areasDescription:
      "Choose one or both areas. Your support can take many forms.",
    orphanageDescription:
      "Support learning, essential supplies, healthcare needs and monthly visits.",
    orphanageFootnote: "School fees · Stationery · Food & essentials",
    widowDescription:
      "Help with career and business opportunities, accommodation and food supplies.",
    widowFootnote: "Livelihoods · Accommodation · Food support",
    formLabel: "Start a partnership",
    formHeadingLines: ["Good things begin", "with a conversation."],
    formDescription:
      "Tell us a little about yourself and the support you would like to offer. Your details help our team understand your partnership interests.",
    steps: [
      {
        title: "Choose your area",
        description: "Orphanage homes, widows, or both.",
        id: "step-0",
      },
      {
        title: "Tell us how you can help",
        description: "Select supplies or describe your contribution.",
        id: "step-1",
      },
      {
        title: "Review your details",
        description: "Check your partnership enquiry before sending.",
        id: "step-2",
      },
    ],
    formFootnote:
      "Whether it is a bag of rice, educational support or an empowerment opportunity, there is a place for your kindness.",
  },
};
export const defaultVolunteerContent: VolunteerContent = {
  hero: {
    label: "Volunteer with purpose",
    heading: "Your time.",
    highlightLines: ["Their", "tomorrow."],
    description:
      "Bring your time, skills and compassion to a community committed to restoring hope and dignity. Together, we can make everyday acts of kindness count.",
    primaryButtonLabel: "Become a volunteer",
    secondaryButtonLabel: "Find your way to help",
    image: "/images/gallery/orphanageVisit4.jpg",
    imageAlt:
      "Children and caregivers gathered with donated supplies during a Beloved Kindness Maxcare outreach",
    captionTitle: "Time. Skills. Compassion.",
    captionDescription: "There is a place for what you can give.",
  },
  waysToHelp: [
    {
      id: "way-0",
      title: "Give your time",
      description:
        "Take part in outreach and support the people at the heart of our work.",
    },
    {
      id: "way-1",
      title: "Share your skills",
      description:
        "Bring your knowledge, practical abilities and ideas to the community.",
    },
    {
      id: "way-2",
      title: "Lead with compassion",
      description:
        "Help create a welcoming space where people feel supported and valued.",
    },
  ],
};
