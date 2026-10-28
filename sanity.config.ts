"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error("Sanity project ID and dataset must be configured.");
}

const singletonTypes = [
  "homePage",
  "ourStoryPage",
  "missionPage",
  "teamPage",
  "educationPage",
  "orphanagePage",
  "widowPage",
  "partyPage",
  "impactPage",
  "donatePage",
  "partnerPage",
  "volunteerPage",
];

export default defineConfig({
  name: "default",
  title: "Beloved Kindness Maxcare",
  basePath: "/admin",
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Website content")
          .items([
            S.listItem()
              .id("homepage-settings")
              .title("Homepage")
              .child(
                S.document().schemaType("homePage").documentId("home-page"),
              ),

            S.listItem()
              .id("about-pages")
              .title("About pages")
              .child(
                S.list()
                  .title("About pages")
                  .items([
                    S.listItem()
                      .id("our-story-settings")
                      .title("Our Story")
                      .child(
                        S.document()
                          .schemaType("ourStoryPage")
                          .documentId("our-story-page"),
                      ),
                    S.listItem()
                      .id("mission-settings")
                      .title("Mission & Vision")
                      .child(
                        S.document()
                          .schemaType("missionPage")
                          .documentId("mission-page"),
                      ),
                    S.listItem()
                      .id("team-settings")
                      .title("Our Team")
                      .child(
                        S.document()
                          .schemaType("teamPage")
                          .documentId("team-page"),
                      ),
                  ]),
              ),
            S.listItem()
              .id("programme-pages")
              .title("Programme pages")
              .child(
                S.list()
                  .title("Programme pages")
                  .items([
                    S.listItem()
                      .id("education-settings")
                      .title("Education")
                      .child(
                        S.document()
                          .schemaType("educationPage")
                          .documentId("education-page"),
                      ),
                    S.listItem()
                      .id("orphanage-settings")
                      .title("Orphanage Support")
                      .child(
                        S.document()
                          .schemaType("orphanagePage")
                          .documentId("orphanage-page"),
                      ),
                    S.listItem()
                      .id("widow-settings")
                      .title("Widow Empowerment")
                      .child(
                        S.document()
                          .schemaType("widowPage")
                          .documentId("widow-page"),
                      ),
                    S.listItem()
                      .id("party-settings")
                      .title("Christmas Party")
                      .child(
                        S.document()
                          .schemaType("partyPage")
                          .documentId("party-page"),
                      ),
                  ]),
              ),
            S.listItem()
              .id("impact-settings")
              .title("Our Impact")
              .child(
                S.document().schemaType("impactPage").documentId("impact-page"),
              ),
            S.listItem()
              .id("get-involved-pages")
              .title("Get Involved pages")
              .child(
                S.list()
                  .title("Get Involved pages")
                  .items([
                    S.listItem()
                      .id("donate-settings")
                      .title("Donate")
                      .child(
                        S.document()
                          .schemaType("donatePage")
                          .documentId("donate-page"),
                      ),
                    S.listItem()
                      .id("partner-settings")
                      .title("Partner With Us")
                      .child(
                        S.document()
                          .schemaType("partnerPage")
                          .documentId("partner-page"),
                      ),
                    S.listItem()
                      .id("volunteer-settings")
                      .title("Volunteer")
                      .child(
                        S.document()
                          .schemaType("volunteerPage")
                          .documentId("volunteer-page"),
                      ),
                  ]),
              ),
            S.divider(),

            ...S.documentTypeListItems().filter(
              (item) => !singletonTypes.includes(item.getId() ?? ""),
            ),
          ]),
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => !singletonTypes.includes(option.templateId)),

    actions: (actions, context) =>
      singletonTypes.includes(context.schemaType)
        ? actions.filter(
            (action) =>
              action.action !== "duplicate" && action.action !== "delete",
          )
        : actions,
  },
});
