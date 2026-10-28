import type { HomeProgramsContent } from "../types";

export const programDestinations = [
  { title: "Education", value: "/programs/education" },
  { title: "Orphanage outreach", value: "/programs/orphanage" },
  { title: "Widow empowerment", value: "/programs/widow" },
  { title: "Christmas party", value: "/programs/party" },
];

// Preserve the current section until its CMS content is published.
export const defaultHomePrograms: HomeProgramsContent = {
  label: "Programs",
  headingStart: "What we",
  headingHighlight: "do.",
  description:
    "We support vulnerable individuals and communities through practical care, education, empowerment and programs that restore dignity and create lasting change.",
  cards: [
    {
      id: "education",
      category: "Education",
      title: "Education & Youth Development",
      image: "/images/programs/education.jpg",
      imageAlt: "Beloved Kindness Maxcare education and youth development programme",
      href: "/programs/education",
      description:
        "Seminars, workshops and educational support that equip young people with knowledge, values and opportunities to thrive.",
      buttonLabel: "Learn more",
    },
    {
      id: "orphanage",
      category: "Care",
      title: "Orphanage & Child Support",
      image: "/images/programs/orphanage.jpg",
      imageAlt: "Beloved Kindness Maxcare orphanage and child support programme",
      href: "/programs/orphanage",
      description:
        "We visit orphanage homes and provide essential needs, care and support for vulnerable children.",
      buttonLabel: "Learn more",
    },
    {
      id: "widow",
      category: "Empowerment",
      title: "Widow Feeding & Empowerment",
      image: "/images/gallery/2023empowerment-5.png",
      imageAlt: "Beloved Kindness Maxcare widow empowerment programme",
      href: "/programs/widow",
      description:
        "Food provisions, practical care and small business support that help widows meet everyday needs and build livelihoods.",
      buttonLabel: "Learn more",
    },
  ],
};
