export type MembershipContent = {
  label: string;
  headingFirstLine: string;
  headingSecondLine: string;
  headingHighlight: string;
  description: string;
  benefits: { id: string; title: string; description: string }[];
  quote: string;
  formLabel: string;
  formHeading: string;
  image: string;
  imageAlt: string;
};

export const defaultMembershipContent: MembershipContent = {
  label: "Get involved",
  headingFirstLine: "Join Beloved",
  headingSecondLine: "Kindness",
  headingHighlight: "Maxcare",
  description: "Become part of a community of compassionate people committed to restoring hope, dignity and better opportunities for vulnerable individuals across Nigeria.",
  benefits: [
    { id: "serve", title: "Serve with compassion", description: "Support initiatives created to restore hope and dignity." },
    { id: "connect", title: "Connect with community", description: "Work with like-minded individuals and organizations." },
    { id: "impact", title: "Create real impact", description: "Use your skills and resources to transform lives." },
  ],
  quote: "When you give your time and heart, you help build stronger, healthier communities.",
  formLabel: "Membership application",
  formHeading: "Tell us a little about yourself",
  image: "/images/partners/JoinUs.png",
  imageAlt: "A Beloved Kindness Maxcare volunteer with children",
};
