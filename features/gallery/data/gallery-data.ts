import type { GalleryCategory } from "../types";

import educationImg2 from "@/public/images/gallery/educationImg2.webp";
import educationImg3 from "@/public/images/gallery/educationImg3.jpeg";
import educationImg4 from "@/public/images/gallery/educationImg4.jpeg";
import educationImg5 from "@/public/images/gallery/educationImg5.jpeg";

import orphanageImg from "@/public/images/gallery/orphanage-outreach.png";
import orphanageVisitImg from "@/public/images/gallery/heroGallery-5.png";
import orphanageVisit2 from "@/public/images/gallery/orphanageVisit2.jpg";
import orphanageVisit3 from "@/public/images/gallery/orphanageVisit3.jpg";
import orphanageVisit4 from "@/public/images/gallery/orphanageVisit4.jpg";

import support1Img from "@/public/images/gallery/2024-support-1.jpeg";
import support2Img from "@/public/images/gallery/2024-support-2.jpeg";
import support3Img from "@/public/images/gallery/2024-support-3.jpeg";
import support4Img from "@/public/images/gallery/2024-support-4.jpeg";
import support5Img from "@/public/images/gallery/2024-support-5.jpeg";
import support6Img from "@/public/images/gallery/2024-support-6.jpeg";
import support7Img from "@/public/images/gallery/2024-support-7.jpeg";

import widowSupport1Img from "@/public/images/gallery/2023empowerment-1.jpg";
import widowSupport2Img from "@/public/images/gallery/2023empowerment-2.jpg";
import widowSupport3Img from "@/public/images/gallery/2023empowerment-3.jpg";
import widowSupport4Img from "@/public/images/gallery/2023empowerment-4.jpg";
import widowSupport5Img from "@/public/images/gallery/2023empowerment-5.png";
import widowSupport6Img from "@/public/images/gallery/2023empowerment-6.jpeg";
import widowSupport7Img from "@/public/images/gallery/2023empowerment-7.jpeg";

export const galleryCategories: GalleryCategory[] = [
  {
    id: "education",
    label: "Education & Child Counselling",
    description: "Opening doors through learning, one child at a time.",

    photos: [
      {
        id: "orphanage-support-graduation",
        src: educationImg2,
        alt: "Children dressed in graduation gowns celebrating an academic milestone",
        title: "Celebrating Their Achievement",
      },
      {
        id: "orphanage-support-learning-session",
        src: educationImg3,
        alt: "Children gathered with a facilitator during an educational support session",
        title: "Learning, Guidance and Support",
      },
      {
        id: "orphanage-support-youth-group",
        src: educationImg4,
        alt: "Children and facilitators gathered together during a youth development programme",
        title: "Growing Together",
      },
      {
        id: "orphanage-support-celebration",
        src: educationImg5,
        alt: "Children celebrating together during a joyful community event",
        title: "Moments of Joy",
      },
    ],
  },

  {
    id: "orphanage-support",
    label: "Orphanage Support",
    description: "Showing up with care, connection, and everyday essentials.",

    photos: [
      {
        id: "orphanage-outreach",
        src: orphanageImg,
        alt: "Children and adults gathered at Gifted and Talented Orphanage",
        title: "Care that feels like family",
        description:
          "Children and adults gather at Gifted and Talented Orphanage, with bags of food supplies in front of them.",
      },
      {
        id: "orphanage-visit",
        src: orphanageVisitImg,
        alt: "A visitor taking a group photograph with children beside supplies",
        title: "Together, with love",
        description:
          "A visitor takes a group photograph with children, beside boxes of noodles and household supplies.",
      },
      {
        id: "orphanage-support-supplies",
        src: orphanageVisit2,
        alt: "Children and adults standing behind food and household essentials",
        title: "Everyday needs, shared care",
        description:
          "Children and adults gather behind rice, cooking oil, cereal, noodles and other household essentials.",
      },
      {
        id: "orphanage-support-community-visit",
        src: orphanageVisit3,
        alt: "Children and visitors gathered with food, drinks and supplies",
        title: "A visit to remember",
        description:
          "Children and visitors stand together with food, bottled drinks and supplies during an orphanage visit.",
      },
      {
        id: "orphanage-support-donations",
        src: orphanageVisit4,
        alt: "Children clapping during a visit with supplies in the foreground",
        title: "More than a delivery",
        description:
          "Children clap together during a visit, with food and household supplies arranged in the foreground.",
      },
    ],
  },

  {
    id: "2023-support",
    label: "2023 Widow Empowerment",
    description:
      "Practical care and community connection from our 2023 widow empowerment outreach.",

    photos: [
      {
        id: "2023-empowerment-1",
        src: widowSupport1Img,
        alt: "A woman in a green head covering receiving rice and provisions",
        title: "Extending a Helping Hand",
        description:
          "A woman in a green head covering receives a bag of rice and other provisions during the outreach.",
      },
      {
        id: "2023-empowerment-2",
        src: widowSupport2Img,
        alt: "Two women holding bags of provisions beneath a decorated canopy",
        title: "Sharing Practical Support",
        description:
          "Two women hold bags of provisions together beneath a decorated canopy.",
      },
      {
        id: "2023-empowerment-3",
        src: widowSupport3Img,
        alt: "A woman holding rice and supplies beside the event banner",
        title: "Provision for the Home",
        description:
          "A woman holds rice and a bag of supplies beside the widow empowerment event banner.",
      },
      {
        id: "2023-empowerment-4",
        src: widowSupport4Img,
        alt: "A smiling woman in a yellow head covering holding rice",
        title: "A Moment of Warmth",
        description:
          "A smiling woman in a yellow head covering holds a bag of rice during the gathering.",
      },
      {
        id: "2023-empowerment-5",
        src: widowSupport5Img,
        alt: "Women and BKM representatives gathered beneath red and blue decorations",
        title: "Together in Community",
        description:
          "Women and BKM representatives gather for a group photograph beneath red and blue decorations.",
      },
      {
        id: "2023-empowerment-6",
        src: widowSupport6Img,
        alt: "Bags of rice arranged for distribution",
        title: "Prepared With Care",
        description:
          "Bags of rice are arranged together, ready for distribution.",
      },
      {
        id: "2023-empowerment-7",
        src: widowSupport7Img,
        alt: "Rice, cooking oil, drinks and provisions arranged at the venue",
        title: "Everyday Essentials",
        description:
          "Rice, cooking oil, bottled drinks and other provisions are arranged at the outreach venue.",
      },
    ],
  },
  {
    id: "2024-support",
    label: "2024 Outreach Celebration",
    description:
      "4th Edition of the Year Celebration of Orphans, Widows and the Less Privileged — 2024.",

    photos: [
      {
        id: "2024-support-1",
        src: support1Img,
        alt: "Guests and beneficiaries seated together during the 2024 support celebration",
        title: "A Community Gathered in Love",
      },
      {
        id: "2024-support-2",
        src: support2Img,
        alt: "Beloved Kindness Maxcare representative during the 2024 support celebration",
        title: "Celebrating Compassion",
      },
      {
        id: "2024-support-3",
        src: support3Img,
        alt: "A speaker addressing guests during the 2024 support celebration",
        title: "Sharing a Message of Hope",
      },
      {
        id: "2024-support-4",
        src: support4Img,
        alt: "Members of the community interacting during the 2024 outreach event",
        title: "Connecting With Our Community",
      },
      {
        id: "2024-support-5",
        src: support5Img,
        alt: "Support items being presented to beneficiaries during the 2024 outreach",
        title: "Extending a Helping Hand",
      },
      {
        id: "2024-support-6",
        src: support6Img,
        alt: "Participants celebrating together during the 2024 support programme",
        title: "Moments of Joy",
      },
      {
        id: "2024-support-7",
        src: support7Img,
        alt: "A woman addressing attendees during the 2024 support celebration",
        title: "Words of Encouragement",
      },
    ],
  },
];
