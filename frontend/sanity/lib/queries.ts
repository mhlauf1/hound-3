import {defineQuery} from 'next-sanity'

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const settingsQuery = defineQuery(`*[_type == "settings"][0]{
  ...,
  navItems[]{
    ...,
    ${linkFields},
    children[]{
      ...,
      ${linkFields}
    }
  },
  ctaButton {
    ...,
    ${linkFields}
  },
  footerColumns[]{
    ...,
    links[]{
      ...,
      ${linkFields}
    }
  },
  contactInfo,
  footerTagline,
  footerText,
  logo
}`)

const buttonFields = /* groq */ `
  {
    ...,
    ${linkFields}
  }
`

const pageBuilderExpansion = /* groq */ `
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "callToAction" => {
      ...,
      button ${buttonFields}
    },
    _type == "infoSection" => {
      content[]{
        ...,
        markDefs[]{
          ...,
          ${linkReference}
        }
      }
    },
    _type == "hero" => {
      ...,
      primaryCta ${buttonFields},
      secondaryCta ${buttonFields}
    },
    _type == "featureCards" => {
      ...,
      cta ${buttonFields}
    },
    _type == "serviceTabs" => {
      ...,
      tabs[]->{
        _id,
        title,
        slug,
        shortDescription,
        tabImage,
        tabCta ${buttonFields}
      }
    },
    _type == "testimonials" => {
      ...,
      reviews[]->{
        _id,
        quote,
        authorName,
        authorLabel,
        rating
      }
    },
    _type == "ctaBanner" => {
      ...,
      cta ${buttonFields}
    },
    _type == "splitContent" => {
      ...,
      link {
        ...,
        link {
          ...,
          ${linkReference}
        }
      }
    },
  }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    ${pageBuilderExpansion},
  }
`)

export const homepageQuery = defineQuery(`
  *[_type == 'page' && slug.current == 'homepage'][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    ${pageBuilderExpansion},
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)
