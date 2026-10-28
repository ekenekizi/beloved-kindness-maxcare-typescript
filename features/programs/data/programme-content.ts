export type ProgrammeKey = "orphanage" | "widow" | "party";
export type ProgrammeContent = {
  hero: {
    label: string;
    headingLines: string[];
    highlightLines: string[];
    description: string;
    donateButtonLabel: string;
    galleryLinkLabel: string;
    image: string;
    imageAlt: string;
    captionTitle: string;
    captionDescription: string;
    video?: string;
    videoLabel?: string;
    videoDescription?: string;
  };
  supportAreas: { id: string; title: string; description: string }[];
  schedule?: { heading: string; description: string };
  purpose: {
    label: string;
    headingLines: string[];
    quote: string;
    paragraphs: string[];
  };
  donation: { heading: string; description: string; buttonLabel: string };
  gallery: { label: string; headingLines: string[]; description: string };
  invitation: {
    heading: string;
    description: string;
    buttonLabel: string;
    secondaryButtonLabel: string;
  };
};
export const defaultProgrammeContent: Record<ProgrammeKey, ProgrammeContent> = {
  orphanage: {
    hero: {
      label: "Monthly orphanage outreach",
      headingLines: ["Showing up."],
      highlightLines: ["Sharing care.", "Every month."],
      description:
        "A visit can bring more than supplies. Through our monthly outreach, we share food, everyday essentials and time with children in orphanage homes.",
      donateButtonLabel: "Support a visit",
      galleryLinkLabel: "See the moments",
      image: "/images/gallery/orphanage-outreach.png",
      imageAlt:
        "Children and adults gathered at Gifted and Talented Orphanage with food supplies",
      captionTitle: "Small visits. Lasting connections.",
      captionDescription: "Care, company and everyday essentials.",
    },
    supportAreas: [
      {
        id: "area-0",
        title: "Food & provisions",
        description:
          "Rice, noodles, cooking oil and other everyday food items.",
      },
      {
        id: "area-1",
        title: "Daily essentials",
        description: "Toiletries and household supplies for everyday care.",
      },
      {
        id: "area-2",
        title: "Clothing & care",
        description: "Practical items that help meet children’s needs.",
      },
      {
        id: "area-3",
        title: "Time & connection",
        description: "Be present, share encouragement and build friendships.",
      },
    ],
    purpose: {
      label: "The heart of each visit",
      headingLines: ["Care is something", "we keep showing up for."],
      quote: "Every child deserves to feel remembered, supported and valued.",
      paragraphs: [
        "Beloved Kindness Maxcare visits orphanage homes every month, bringing food, essential supplies and a spirit of friendship. These visits are part of our commitment to supporting children and the people who care for them.",
        "We spend time with the children, share encouragement and learn about the home's practical needs. Alongside providing supplies, we want each visit to be a moment of connection and kindness.",
        "Your support helps provide the everyday items that make these visits possible. You can contribute financially, partner with us to provide supplies, or volunteer your time.",
      ],
    },
    donation: {
      heading: "Help make the next visit possible.",
      description:
        "Your kindness can help provide food, essentials and care for children in orphanage homes.",
      buttonLabel: "Support this outreach",
    },
    gallery: {
      label: "Moments from our visits",
      headingLines: ["The people.", "The care. The connection."],
      description:
        "A glimpse of the children, shared moments and practical support at the heart of our orphanage outreach.",
    },
    invitation: {
      heading: "Bring your kindness along.",
      description:
        "Give supplies, share your time, or contribute towards the next visit. There is a place for what you can give.",
      buttonLabel: "Make a difference",
      secondaryButtonLabel: "",
    },
    schedule: {
      heading: "Every third Saturday of the month",
      description: "Our monthly visit to orphanage homes.",
    },
  },
  widow: {
    hero: {
      label: "Widows feeding & empowerment",
      headingLines: ["Care for today."],
      highlightLines: ["Strength for", "tomorrow."],
      description:
        "Stand alongside widows with food, practical care and support for small businesses. Together, we can help meet today's needs and open possibilities for tomorrow.",
      donateButtonLabel: "Support a widow",
      galleryLinkLabel: "See the moments",
      image: "/images/gallery/2023empowerment-5.png",
      imageAlt:
        "Women and BKM representatives gathered together during the widow empowerment programme",
      captionTitle: "Every woman deserves support.",
      captionDescription: "Food, dignity and opportunities to grow.",
    },
    supportAreas: [
      {
        id: "area-0",
        title: "Food for the home",
        description:
          "Rice, cooking oil and other provisions to help meet everyday needs.",
      },
      {
        id: "area-1",
        title: "Practical essentials",
        description:
          "Household supplies that help ease the pressure of daily living.",
      },
      {
        id: "area-2",
        title: "A step towards income",
        description:
          "Support to help women start small businesses and build livelihoods.",
      },
    ],
    purpose: {
      label: "From practical care to possibility",
      headingLines: ["Meeting today's needs.", "Supporting her next step."],
      quote:
        "Every woman deserves care, dignity and the opportunity to move forward.",
      paragraphs: [
        "Losing a partner can bring emotional and financial challenges. Beloved Kindness Maxcare supports widows through food provisions, practical essentials and gatherings that offer connection and encouragement.",
        "Our Easter and Christmas celebrations bring women together to receive provisions such as rice, cooking oil and household items. These gatherings are a chance to share kindness and remind women they are part of a caring community.",
        "Alongside meeting immediate needs, our empowerment work includes support to help women start small businesses. Your contribution can help provide essential supplies and opportunities to build an income.",
      ],
    },
    donation: {
      heading: "Help her take the next step.",
      description:
        "Contribute towards food, household essentials and small business support for widows.",
      buttonLabel: "Support this vision",
    },
    gallery: {
      label: "Widow empowerment",
      headingLines: ["The women.", "The care. The community."],
      description:
        "Moments of practical support and connection from our widow empowerment outreach.",
    },
    invitation: {
      heading: "Stand with her. Share a little hope.",
      description:
        "Support a household today and help create opportunities for tomorrow. Your kindness can make a difference.",
      buttonLabel: "Make a difference",
      secondaryButtonLabel: "",
    },
    schedule: {
      heading: "Sharing care at Easter & Christmas",
      description:
        "Seasonal gatherings, with a wider commitment to empowerment.",
    },
  },
  party: {
    hero: {
      label: "Our Christmas celebration",
      headingLines: ["A season", "of joy."],
      highlightLines: ["A place", "to belong."],
      description:
        "Celebrate the season with children, widows and our community. Through food, gifts and time together, we share the warmth of Christmas and remind people they are valued.",
      donateButtonLabel: "Support this vision",
      galleryLinkLabel: "Explore the memories",
      image: "/images/xmas/xmas-5.webp",
      imageAlt: "Children and guests at the Christmas celebration",
      captionTitle: "Joy is even better when we share it.",
      captionDescription: "Watch a moment from the celebration.",
      video: "/images/xmas/xmas-vid.mp4",
      videoDescription: "Beloved Kindness Maxcare Christmas celebration",
      videoLabel: "Moments from our Christmas party",
    },
    supportAreas: [
      {
        id: "area-0",
        title: "A shared meal",
        description: "Food and refreshments to enjoy together.",
      },
      {
        id: "area-1",
        title: "Thoughtful gifts",
        description: "Small presents that make the day special.",
      },
      {
        id: "area-2",
        title: "Play & celebration",
        description: "Music, activities and moments of laughter.",
      },
      {
        id: "area-3",
        title: "A warm welcome",
        description: "A gathering built around care and belonging.",
      },
    ],
    purpose: {
      label: "The heart of the celebration",
      headingLines: ["A day to feel seen.", "A memory to keep."],
      quote: "Let the season's kindness reach the people who need it.",
      paragraphs: [
        "Our Christmas party brings children, families, widows and supporters together for a day of celebration. It is an opportunity to share a meal, enjoy activities and build connections.",
        "Beloved Kindness Maxcare invites individuals and organisations to contribute towards food, gifts and the practical needs of the event. Your generosity helps us create a welcoming celebration for people facing hardship.",
        "We work alongside charity ministries, orphanage homes, schools and community partners to reach the people at the heart of our work.",
      ],
    },
    donation: {
      heading: "Help us share the joy.",
      description:
        "Contribute towards the celebration, or partner with us to provide food, gifts and practical support.",
      buttonLabel: "Support this vision",
    },
    gallery: {
      label: "Christmas in pictures",
      headingLines: ["The faces.", "The moments. The joy."],
      description: "",
    },
    invitation: {
      heading: "Bring your kindness to the celebration.",
      description:
        "Partner with us to contribute supplies, or volunteer your time to help make the day possible.",
      buttonLabel: "Become a partner",
      secondaryButtonLabel: "Volunteer",
    },
  },
};
