/**
 * Editable site copy.
 *
 * One source of truth for both the admin CMS editor and the public pages that
 * render the copy, so the two can't drift apart. Adding a field here and listing
 * it in CMS_SCHEMA is all that's needed for it to appear in the editor.
 *
 * Storage is the browser's localStorage (see SiteContentContext) — there is no
 * backend for this, so edits live on the machine that made them.
 */

export type SiteContentValue = string | string[];
export type SiteContent = Record<string, SiteContentValue>;

export const SITE_CONTENT_KEY = "exalto-admin-cms";

export const SITE_CONTENT_DEFAULTS: SiteContent = {
  // Navbar
  navLinks: ["Home", "Shop", "About", "Wholesale", "Export", "Contact"],
  navCta: "Order Now",

  // Hero
  heroTitle: "EXALTO FRESH PRODUCE",
  heroSubtitle:
    "Premium natural beverages and fresh produce from Rwanda's finest farms. Supplying local businesses, wholesale buyers, and international export partners.",
  heroBtn1: "Shop Now",
  heroBtn2: "Wholesale Enquiry",
  // Stats 1 and 2 have no *Val: their numbers are counted from the live
  // catalogue in home.tsx. Only the labels are editable.
  heroStat1Label: "Products",
  heroStat2Label: "Categories",
  heroStat3Val: "100%",
  heroStat3Label: "Natural",
  heroStat4Val: "Rwanda",
  heroStat4Label: "Origin",

  // Announcement bar
  announcementText:
    "Free delivery on orders in Kigali · Export inquiries welcome",
  announcementLink: "Open a wholesale account →",

  // Categories
  categoriesSubheading: "Browse by Category",
  categoriesHeading: "Shop Our Range",

  // Features
  feature1Title: "100% Natural",
  feature1Desc:
    "No artificial additives. Pure ingredients from Rwanda's finest farms.",
  feature2Title: "Quality Certified",
  feature2Desc:
    "Every batch tested and certified to meet international standards.",
  feature3Title: "Fast Delivery",
  feature3Desc:
    "Same-day delivery in Kigali. Nationwide and export shipping available.",
  feature4Title: "Premium Grade",
  feature4Desc:
    "Only Grade A produce selected for our beverages and export catalog.",

  // Featured products
  productsSubheading: "Fresh & Natural",
  productsHeading: "Featured Products",

  // Wholesale banner
  wholesaleBannerTag: "For Business Buyers",
  wholesaleBannerTitle: "Wholesale & Export Solutions",
  wholesaleBannerDesc:
    "We supply restaurants, hotels, supermarkets, and international distributors with premium Rwandan beverages.",
  wholesaleBannerBtn1: "Open Wholesale Account",
  wholesaleBannerBtn2: "Export Enquiry",

  // Testimonials
  testimonialsSubheading: "What Our Clients Say",
  testimonialsHeading: "Trusted by Businesses",
  testimonial1Name: "Jean-Pierre M.",
  testimonial1Role: "Restaurant Owner, Kigali",
  testimonial1Text:
    "Exalto's passion juice is the best we've served. Our customers always ask for more.",
  testimonial2Name: "Sarah K.",
  testimonial2Role: "Wholesale Buyer",
  testimonial2Text:
    "Reliable supply, great pricing, and the team is always responsive.",
  testimonial3Name: "David N.",
  testimonial3Role: "Export Partner, Nairobi",
  testimonial3Text:
    "The sugarcane wine has been a hit in our market. Packaging is excellent.",

  // Call to action
  ctaTitle: "Ready to Order?",
  ctaDescription:
    "Create your account today and start ordering Rwanda's finest natural beverages.",
  ctaBtn1: "Create Account",
  ctaBtn2: "Browse Products",

  // Other pages
  aboutIntro:
    "We transform Rwanda's finest ingredients into premium natural beverages.",
  aboutMission:
    "To deliver the purest, most natural beverages from Rwanda to the world.",
  contactSubheading: "We're here to help",
  contactHeading: "Get in Touch",
  contactIntro:
    "Have a question, want to place a bulk order, or just want to say hello?",
  wholesaleHeading: "Wholesale Partnership",
  wholesaleIntro:
    "Join our growing network of wholesale partners across Rwanda and beyond.",
  exportHeading: "Export Solutions",
  exportIntro:
    "We export premium Rwandan beverages to markets across Africa and beyond.",

  // Footer (shown on every public page)
  footerDescription:
    "Rwanda's premier natural beverage company. Crafting premium juices and wines from locally sourced ingredients.",
  footerAddress: "Kamonyi, Rwanda",
  footerPhone: "+250 788 537 463",
  footerEmail: "exaltoltd@gmail.com",
  footerFacebook: "#",
  footerTwitter: "#",
  footerLinkedin: "#",
  footerCopyright: "Exalto Engineering & Supply Solutions Ltd. All rights reserved.",
};

export interface CmsField {
  key: string;
  label: string;
  /** Render a textarea instead of a single-line input. */
  long?: boolean;
  /** Stored as a string[]; edited as a comma-separated list. */
  isArray?: boolean;
  /** Shown under the input to explain where the copy appears. */
  hint?: string;
}

export interface CmsSection {
  id: string;
  title: string;
  fields: CmsField[];
}

export interface CmsPage {
  id: string;
  label: string;
  /** Route the "View page" button opens. */
  path: string;
  sections: CmsSection[];
}

export const CMS_SCHEMA: CmsPage[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    sections: [
      {
        id: "navbar",
        title: "Navbar",
        fields: [
          {
            key: "navLinks",
            label: "Nav Links",
            isArray: true,
            hint: "Comma-separated, in order.",
          },
          { key: "navCta", label: "CTA Button Text" },
        ],
      },
      {
        id: "hero",
        title: "Hero Section",
        fields: [
          { key: "heroTitle", label: "Main Title" },
          { key: "heroSubtitle", label: "Subtitle", long: true },
          { key: "heroBtn1", label: "Button 1 Text" },
          { key: "heroBtn2", label: "Button 2 Text" },
          {
            key: "heroStat1Label",
            label: "Stat 1 Label",
            hint: "Number is counted live from your catalogue.",
          },
          {
            key: "heroStat2Label",
            label: "Stat 2 Label",
            hint: "Number is counted live from your categories.",
          },
          { key: "heroStat3Val", label: "Stat 3 Value" },
          { key: "heroStat3Label", label: "Stat 3 Label" },
          { key: "heroStat4Val", label: "Stat 4 Value" },
          { key: "heroStat4Label", label: "Stat 4 Label" },
        ],
      },
      {
        id: "announcement",
        title: "Announcement Bar",
        fields: [
          { key: "announcementText", label: "Announcement Text", long: true },
          { key: "announcementLink", label: "Link Text" },
        ],
      },
      {
        id: "categories",
        title: "Categories Section",
        fields: [
          { key: "categoriesSubheading", label: "Subheading" },
          { key: "categoriesHeading", label: "Heading" },
        ],
      },
      {
        id: "features",
        title: "Features Strip",
        fields: [
          { key: "feature1Title", label: "Feature 1 Title" },
          { key: "feature1Desc", label: "Feature 1 Description", long: true },
          { key: "feature2Title", label: "Feature 2 Title" },
          { key: "feature2Desc", label: "Feature 2 Description", long: true },
          { key: "feature3Title", label: "Feature 3 Title" },
          { key: "feature3Desc", label: "Feature 3 Description", long: true },
          { key: "feature4Title", label: "Feature 4 Title" },
          { key: "feature4Desc", label: "Feature 4 Description", long: true },
        ],
      },
      {
        id: "products",
        title: "Featured Products Section",
        fields: [
          { key: "productsSubheading", label: "Subheading" },
          { key: "productsHeading", label: "Heading" },
        ],
      },
      {
        id: "wholesaleBanner",
        title: "Wholesale Banner",
        fields: [
          { key: "wholesaleBannerTag", label: "Tag Line" },
          { key: "wholesaleBannerTitle", label: "Title" },
          { key: "wholesaleBannerDesc", label: "Description", long: true },
          { key: "wholesaleBannerBtn1", label: "Button 1 Text" },
          { key: "wholesaleBannerBtn2", label: "Button 2 Text" },
        ],
      },
      {
        id: "testimonials",
        title: "Testimonials",
        fields: [
          { key: "testimonialsSubheading", label: "Subheading" },
          { key: "testimonialsHeading", label: "Heading" },
          { key: "testimonial1Name", label: "Testimonial 1 Name" },
          { key: "testimonial1Role", label: "Testimonial 1 Role" },
          { key: "testimonial1Text", label: "Testimonial 1 Text", long: true },
          { key: "testimonial2Name", label: "Testimonial 2 Name" },
          { key: "testimonial2Role", label: "Testimonial 2 Role" },
          { key: "testimonial2Text", label: "Testimonial 2 Text", long: true },
          { key: "testimonial3Name", label: "Testimonial 3 Name" },
          { key: "testimonial3Role", label: "Testimonial 3 Role" },
          { key: "testimonial3Text", label: "Testimonial 3 Text", long: true },
        ],
      },
      {
        id: "cta",
        title: "Call-to-Action Section",
        fields: [
          { key: "ctaTitle", label: "Title" },
          { key: "ctaDescription", label: "Description", long: true },
          { key: "ctaBtn1", label: "Button 1 Text" },
          { key: "ctaBtn2", label: "Button 2 Text" },
        ],
      },
    ],
  },
  {
    id: "about",
    label: "About",
    path: "/about",
    sections: [
      {
        id: "aboutMain",
        title: "About Page",
        fields: [
          { key: "aboutIntro", label: "Introduction", long: true },
          { key: "aboutMission", label: "Mission Statement", long: true },
        ],
      },
    ],
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    sections: [
      {
        id: "contactMain",
        title: "Contact Page",
        fields: [
          { key: "contactSubheading", label: "Subheading" },
          { key: "contactHeading", label: "Heading" },
          { key: "contactIntro", label: "Introduction", long: true },
        ],
      },
    ],
  },
  {
    id: "wholesale",
    label: "Wholesale",
    path: "/wholesale",
    sections: [
      {
        id: "wholesaleMain",
        title: "Wholesale Page",
        fields: [
          { key: "wholesaleHeading", label: "Heading" },
          { key: "wholesaleIntro", label: "Introduction", long: true },
        ],
      },
    ],
  },
  {
    id: "export",
    label: "Export",
    path: "/export",
    sections: [
      {
        id: "exportMain",
        title: "Export Page",
        fields: [
          { key: "exportHeading", label: "Heading" },
          { key: "exportIntro", label: "Introduction", long: true },
        ],
      },
    ],
  },
  {
    id: "footer",
    label: "Footer",
    // The footer is on every page; "View page" opens the home page to see it.
    path: "/",
    sections: [
      {
        id: "footerBrand",
        title: "Brand",
        fields: [
          {
            key: "footerDescription",
            label: "Description",
            long: true,
            hint: "Shown under the logo.",
          },
        ],
      },
      {
        id: "footerContact",
        title: "Contact Details",
        fields: [
          { key: "footerAddress", label: "Address" },
          {
            key: "footerPhone",
            label: "Phone",
            hint: "Include the country code, e.g. +250 ...",
          },
          { key: "footerEmail", label: "Email" },
        ],
      },
      {
        id: "footerSocial",
        title: "Social Links",
        fields: [
          {
            key: "footerFacebook",
            label: "Facebook URL",
            hint: "Full link, e.g. https://facebook.com/... Leave # to disable.",
          },
          { key: "footerTwitter", label: "X (Twitter) URL" },
          { key: "footerLinkedin", label: "LinkedIn URL" },
        ],
      },
      {
        id: "footerBottom",
        title: "Bottom Bar",
        fields: [
          {
            key: "footerCopyright",
            label: "Copyright Text",
            hint: "The © symbol and current year are added automatically.",
          },
        ],
      },
    ],
  },
];

/** Every field key the editor knows about, for counts and validation. */
export const ALL_CMS_FIELDS: CmsField[] = CMS_SCHEMA.flatMap((page) =>
  page.sections.flatMap((section) => section.fields),
);
