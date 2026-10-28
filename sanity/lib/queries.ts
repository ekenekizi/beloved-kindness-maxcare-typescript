import { defineQuery } from "next-sanity";

export const partnerPageQuery = defineQuery(`
  *[_type == "partnerPage" && _id == "partner-page" && defined(hero.image.asset->url)][0] {
    hero { label, heading, highlightLines, description, primaryButtonLabel, secondaryButtonLabel,
      captionTitle, captionDescription, image, "imageAlt": coalesce(image.alt, "") },
    partnership { areasHeadingLines, areasDescription, orphanageDescription, orphanageFootnote,
      widowDescription, widowFootnote, formLabel, formHeadingLines, formDescription, formFootnote,
      "steps": coalesce(steps[] { "id": _key, title, description }, []) }
  }
`);
export const volunteerPageQuery = defineQuery(`
  *[_type == "volunteerPage" && _id == "volunteer-page" && defined(hero.image.asset->url)][0] {
    hero { label, heading, highlightLines, description, primaryButtonLabel, secondaryButtonLabel,
      captionTitle, captionDescription, image, "imageAlt": coalesce(image.alt, "") },
    "waysToHelp": coalesce(waysToHelp[] { "id": _key, title, description }, [])
  }
`);

export const donatePageQuery = defineQuery(`
  *[_type == "donatePage" && _id == "donate-page" && defined(hero.image.asset->url)][0] {
    hero { label, heading, highlightLines, description, captionTitle, captionDescription,
      image, "imageAlt": coalesce(image.alt, "") },
    formIntro { heading, description },
    care { label, headingLines, description, "cards": coalesce(cards[] { "id": _key, title, description }, []) },
    closing { heading, description }
  }
`);

export const impactPageQuery = defineQuery(`
  *[_type == "impactPage" && _id == "impact-page" && defined(hero.image.asset->url)][0] {
    hero { label, heading, headingHighlight, description, donateButtonLabel, volunteerButtonLabel,
      image, "imageAlt": coalesce(image.alt, "") },
    storiesIntro { label, heading, headingHighlight, description, footnote }
  }
`);

export const programmePageQuery = defineQuery(`
  *[_type == $documentType && _id == $documentId && defined(hero.image.asset->url)][0] {
    hero { label, headingLines, highlightLines, description, donateButtonLabel, galleryLinkLabel,
      captionTitle, captionDescription, image, "imageAlt": coalesce(image.alt, ""),
      "video": video.asset->url, videoLabel, videoDescription },
    schedule { heading, description },
    "supportAreas": coalesce(supportAreas[] { "id": _key, title, description }, []),
    purpose { label, headingLines, quote, "paragraphs": coalesce(paragraphs[].text, []) },
    donation { heading, description, buttonLabel },
    gallery { label, headingLines, "description": coalesce(description, "") },
    invitation { heading, description, buttonLabel, "secondaryButtonLabel": coalesce(secondaryButtonLabel, "") }
  }
`);

export const educationPageQuery = defineQuery(`
  *[_type == "educationPage" && _id == "education-page" && defined(hero.image.asset->url)][0] {
    hero { label, heading, highlightFirstLine, highlightSecondLine, description, donateButtonLabel,
      galleryLinkLabel, captionTitle, captionDescription, image, "imageAlt": coalesce(image.alt, "") },
    "supportAreas": coalesce(supportAreas[] { "id": _key, title, description }, []),
    purpose { label, heading, headingSecondLine, quote, "paragraphs": coalesce(paragraphs[].text, []) },
    donation { heading, description, buttonLabel },
    gallery { label, heading, headingSecondLine, description },
    partners { heading, description, buttonLabel }
  }
`);

export const teamPageQuery = defineQuery(`
  *[_type == "teamPage" && _id == "team-page"][0] {
    label, heading, headingHighlight, description,
    "members": coalesce(members[defined(image.asset->url)] {
      "id": _key, name, role, contribution, bio, image, "imageAlt": coalesce(image.alt, name)
    }, [])
  }
`);

export const missionPageQuery = defineQuery(`
  *[_type == "missionPage" && _id == "mission-page"][0] {
    label, heading, description,
    "objectives": coalesce(objectives[] { "id": _key, title, "points": coalesce(points, []) }, [])
  }
`);

export const ourStoryPageQuery = defineQuery(`
  *[_type == "ourStoryPage" && _id == "our-story-page" && defined(hero.image.asset->url)][0] {
    hero { label, heading, headingHighlight, description, location, serviceArea,
      discoverButtonLabel, volunteerButtonLabel, image, "imageAlt": coalesce(image.alt, "") },
    work { label, heading, headingHighlight, description, footnote,
      "cards": coalesce(cards[defined(image.asset->url)] {
        "id": _key, label, title, description, image, "imageAlt": coalesce(image.alt, "")
      }, []) }
  }
`);

export const membershipContentQuery = defineQuery(`
  *[_type == "homePage" && _id == "home-page" && defined(membership.image.asset->url)][0].membership {
    label, headingFirstLine, headingSecondLine, headingHighlight,
    description, quote, formLabel, formHeading, image,
    "imageAlt": coalesce(image.alt, ""),
    "benefits": coalesce(benefits[] { "id": _key, title, description }, [])
  }
`);

export const homeYouthQuery = defineQuery(`
  *[_type == "homePage" && _id == "home-page" && defined(youth.image.asset->url)][0].youth {
    label,
    headingStart,
    headingHighlight,
    description,
    buttonLabel,
    partnerUrl,
    image,
    "imageAlt": coalesce(image.alt, "")
  }
`);

export const homeProgramsQuery = defineQuery(`
  *[_type == "homePage" && _id == "home-page" && defined(programs)][0].programs {
    label,
    headingStart,
    headingHighlight,
    description,
    "cards": coalesce(
      cards[defined(image.asset->url)] {
        "id": _key,
        category,
        title,
        description,
        buttonLabel,
        href,
        image,
        "imageAlt": coalesce(image.alt, "")
      },
      []
    )
  }
`);

export const transformationStoriesQuery = defineQuery(`
  *[_type == "story" && defined(image.asset->url)]
  | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    name,
    category,
    location,
    image,
    "imageAlt": coalesce(image.alt, ""),
    before,
    after,
    quote
  }
`);

export const galleryAlbumsQuery = defineQuery(`
  *[_type == "galleryAlbum"]
  | order(sortOrder asc, _createdAt asc) {
    "id": _id,
    "legacySlug": coalesce(slug.current, ""),
    programme,
    year,
    "label": title,
    description,
    "photos": coalesce(
      photos[defined(asset->url)] {
        "id": _key,
        title,
        "alt": coalesce(alt, ""),
        "description": coalesce(description, ""),
        "image": @
      },
      []
    )
  }
`);

export const homeHeroQuery = defineQuery(`
  *[_type == "homePage" && _id == "home-page"][0] {
    eyebrow,
    headingFirstLine,
    headingHighlight,
    headingEnding,
    description,
    primaryButtonLabel,
    secondaryButtonLabel,
    footnote,
    "photos": coalesce(
      photos[defined(asset->url)] {
        "id": _key,
        title,
        "alt": coalesce(alt, ""),
        "image": @
      },
      []
    )
  }
`);

export const homeAboutQuery = defineQuery(`
  *[
    _type == "homePage" &&
    _id == "home-page" &&
    defined(about.image.asset->url)
  ][0].about {
    label,
    headingStart,
    headingHighlight,
    headingEnd,
    description,
    buttonLabel,
    image,
    "imageAlt": coalesce(image.alt, "")
  }
`);

export const homeImpactQuery = defineQuery(`
  *[
    _type == "homePage" &&
    _id == "home-page" &&
    defined(impact)
  ][0].impact {
    label,
    headingStart,
    headingHighlight,
    headingEnd,
    description,
    galleryButtonLabel,
    partnerButtonLabel,
    "stats": coalesce(
      stats[] {
        "id": _key,
        number,
        label
      },
      []
    )
  }
`);
