export type MissionContent = {
  label: string;
  heading: string;
  description: string;
  objectives: { id: string; title: string; points: string[] }[];
};

export const defaultMissionContent: MissionContent = {
  label: "What Guides Our Work",
  heading: "Our objectives",
  description:
    "Practical care, guidance, and empowerment shape the way we serve individuals and communities.",
  objectives: [
    {
      id: "objective-1",
      title: "Care and Dignity",
      points: [
        "Support disadvantaged and underserved people with basic needs and opportunities for sustainable living.",
        "Restore dignity and bring hope to marginalized members of society.",
        "Help meet the needs of widows and people experiencing hardship.",
      ],
    },
    {
      id: "objective-2",
      title: "Youth Development & Guidance",
      points: [
        "Guide younger generations towards good citizenship, responsible leadership, and positive values.",
        "Educate and counsel young people about harmful behaviours, including substance abuse, violence, and sexual exploitation.",
        "Provide social and moral support through outreach, counselling, and education.",
      ],
    },
    {
      id: "objective-3",
      title: "Partnership & Humanitarian Service",
      points: [
        "Work with NGOs, like-minded organizations, and relevant stakeholders to achieve shared objectives.",
        "Carry out humanitarian activities in Nigeria.",
        "Encourage community participation and support for people in need.",
      ],
    },
    {
      id: "objective-4",
      title: "Skills and Empowerment",
      points: [
        "Support widows and disadvantaged people through vocational training, skills acquisition, and empowerment opportunities.",
        "Equip families with practical crafts and income-generating tools to build lasting economic self-reliance.",
      ],
    },
  ],
};
