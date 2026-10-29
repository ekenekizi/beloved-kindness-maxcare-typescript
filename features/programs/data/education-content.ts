export type EducationContent = {
  hero: {
    label: string;
    heading: string;
    highlightFirstLine: string;
    highlightSecondLine: string;
    description: string;
    donateButtonLabel: string;
    galleryLinkLabel: string;
    image: string;
    imageAlt: string;
    captionTitle: string;
    captionDescription: string;
  };
  supportAreas: { id: string; title: string; description: string }[];
  purpose: {
    label: string;
    heading: string;
    headingSecondLine: string;
    quote: string;
    paragraphs: string[];
  };
  donation: { heading: string; description: string; buttonLabel: string };
  gallery: {
    label: string;
    heading: string;
    headingSecondLine: string;
    description: string;
  };
  partners: { heading: string; description: string; buttonLabel: string };
};

export const educationDonationHref =
  "/get-involved/donate?amount=25000&cause=education";

export const defaultEducationContent: EducationContent = {
  hero: {
    label: "Education & Child Counselling",
    heading: "Back to school.",
    highlightFirstLine: "Forward",
    highlightSecondLine: "to possibility.",
    description:
      "Support for learning. Space to be heard. We help children access education and offer counselling with qualified counsellors to support their wellbeing, confidence and personal growth.",
    donateButtonLabel: "Support this vision",
    galleryLinkLabel: "See their journey",
    image: "/images/gallery/educationImg2.webp",
    imageAlt:
      "Children dressed in graduation gowns celebrating an academic milestone",
    captionTitle: "Every child deserves a chance to learn.",
    captionDescription: "School fees, essentials and encouragement.",
  },
  supportAreas: [
    {
      id: "fees",
      title: "School fees",
      description: "Help families meet the cost of tuition.",
    },
    {
      id: "enrolment",
      title: "Enrolment",
      description: "Support children returning to school.",
    },
    {
      id: "uniforms",
      title: "Uniforms & shoes",
      description: "Give children essentials for the school day.",
    },
    {
      id: "supplies",
      title: "School supplies",
      description: "Provide bags and materials for learning.",
    },
  ],
  purpose: {
    label: "Why this matters",
    heading: "A classroom today.",
    headingSecondLine: "A world of possibilities tomorrow.",
    quote:
      "A family's financial hardship should not close the door to a child's education.",
    paragraphs: [
      "For some families, school fees and everyday essentials can put education out of reach. Children may leave school or struggle to enrol when their parents or guardians cannot afford the costs.",
      "Beloved Kindness Maxcare supports these families through fee payments, enrolment and school essentials. Our work includes children in Abuja and orphanage homes, with a vision to reach more children across Nigeria.",
      "We work with schools, orphanage homes, charity ministries and community partners to identify children and families in need of support.",
    ],
  },
  donation: {
    heading: "Help keep the next chapter open.",
    description:
      "Contribute towards school fees and education support. School costs vary by child and school.",
    buttonLabel: "Support this vision",
  },
  gallery: {
    label: "Their journey in pictures",
    heading: "Learning. Growing.",
    headingSecondLine: "Celebrating.",
    description:
      "Moments from our education programme and the children at the heart of it.",
  },
  partners: {
    heading: "Reaching children, together.",
    description:
      "Our beneficiary partners include charity ministries, orphanage homes and schools serving disadvantaged communities.",
    buttonLabel: "Give towards education",
  },
};
