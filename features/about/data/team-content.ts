export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  contribution: string;
  bio: string;
};

export type TeamContent = {
  label: string;
  heading: string;
  headingHighlight: string;
  description: string;
  members: TeamMember[];
};

export const defaultTeamContent: TeamContent = {
  label: "The people behind the purpose",
  heading: "Compassion at heart.",
  headingHighlight: "Purpose in action.",
  description:
    "Meet the people bringing care, guidance and hope to the communities we serve.",
  members: [
    {
      id: "susan",
      name: "Susan Levi Debem",
      role: "Facilitator",
      image: "/images/team/susan-levi.jpeg",
      bio: "A Chartered Administrator and founder of BKM, Susan brings experience in aviation, business and youth counselling to her humanitarian work. She leads initiatives that empower children, young people and widows, restoring hope and dignity.",
      imageAlt: "Portrait of Susan Levi Debem",
      contribution: "Leads outreach and community care initiatives.",
    },
    {
      id: "henry",
      name: "Dr. Henry Chukwunonso Debem",
      role: "Advisor",
      image: "/images/team/Dr-henry.png",
      bio: "A public health practitioner and educator with over 20 years of combined experience, Dr. Debem has worked with the US CDC and international universities. As founder of G-ROLE Africa, he champions responsible leadership, equity and human dignity.",
      imageAlt: "Portrait of Dr. Henry Chukwunonso Debem",
      contribution: "Provides public health and youth development guidance.",
    },
    {
      id: "chinazam",
      name: "Barr. Chinazam Stella Epundu",
      role: "Administrator",
      image: "/images/team/barr-chinazam.png",
      bio: "A legal practitioner with experience in litigation, human rights and corporate law, Chinazam advocates for dignity and equal opportunity. Through BKM, she supports vulnerable communities and helps young people build confidence through legal guidance.",
      imageAlt: "Portrait of Barr. Chinazam Stella Epundu",
      contribution: "Supports legal guidance and community administration.",
    },
  ],
};
