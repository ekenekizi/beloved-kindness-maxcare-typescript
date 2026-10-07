import { ChevronDown, type LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  path: string;
  icon?: LucideIcon;
  submenu?: { label: string; path: string }[];
};

export const navigationLinks: NavigationItem[] = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "About",
    path: "about/story",
    icon: ChevronDown,
    submenu: [
      {
        label: "Our Story",
        path: "about/story",
      },
      {
        label: "Mission & Vision",
        path: "about/mission",
      },
      {
        label: "Our Team",
        path: "about/team",
      },
    ],
  },
  {
    label: "Programs",
    path: "programs",
    icon: ChevronDown,
    submenu: [
      {
        label: "Education",
        path: "programs/education",
      },
      {
        label: "Orphanage Support",
        path: "programs/orphanage",
      },
      {
        label: "Widow Empowerment",
        path: "programs/widow",
      },
      {
        label: "Youth & Counselling",
        path: "programs/youth",
      },
      {
        label: "Community Outreach",
        path: "programs/community",
      },
    ],
  },

  {
    label: "Our Impact",
    path: "impact",
  },
  {
    label: "Get Involved",
    path: "get-involved",
    icon: ChevronDown,
    submenu: [
      {
        label: "Donate",
        path: "get-involved/donate",
      },
      {
        label: "Partner With Us",
        path: "get-involved/partner",
      },
      {
        label: "Volunteer",
        path: "get-involved/volunteer",
      },
    ],
  },
  {
    label: "Gallery",
    path: "gallery",
  },
];

