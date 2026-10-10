// lib/data/home.js
//
// The home page's own wording. The section components only care about the
// shape of each object, not the values.

// Starting values for the public profile. Once the profile is saved from the
// dashboard (/admin/profile), the saved values are used instead.
export const profile = {
  name: "Rasel Rana",
  role: "Manager (Technical)",
  org: "Bangladesh Telecommunications Company Limited (BTCL)",
  location: "Dhaka, Bangladesh",
  tagline:
    "Manager (Technical) at BTCL, building telecommunications networks and in-house solutions with a foundation in electronics, programming and robotics.",
  meta: "Telecommunications · Power systems · Programming & Robotics · Technical Management",
};

export const aboutPreview = {
  body: "I work at the intersection of telecommunications infrastructure, electrical engineering and software development. As Manager (Technical) at BTCL, I combine technical management with hands-on work on GPON access networks and in-house development projects. Since 2021, I have also built full-stack web applications, from front-end design to database architecture. My foundation in electronics and hardware programming since 2011, and in robotics since 2014, shapes how I approach every system I build or manage.",
  href: "/about",
};

export const focusAreas = [
  {
    label: "01",
    title: "Telecommunications",
    description:
      "Managing and developing GPON access networks at BTCL and working with MikroTik-based solutions to deliver reliable broadband and telecommunications services to customers across Bangladesh, from planning to day-to-day operations.",
  },
  {
    label: "02",
    title: "Power Systems",
    description:
      "Hands-on operations experience at 157 MW and 300 MW power plants, covering generation control, grid coordination with the National Load Dispatch Centre, and daily, monthly and annual performance reporting.",
  },
  {
    label: "03",
    title: "Programming & Robotics",
    description:
      "Building competition robots since 2014, winning national titles at ROBOLUTION 2016 and Cybernauts 2016. I have worked in electronics, hardware programming and embedded systems since 2011, alongside full-stack web development.",
  },
  {
    label: "04",
    title: "Technical Management",
    description:
      "Managing the field operations team that delivers BTCL services to customers, overseeing work from planning and coordination through to service quality. I also contribute to BTCL’s in-house technology development projects.",
  },
];

// The email shown here comes from the public profile (dashboard).
export const contactCta = {
  heading: "Let’s work together.",
  body: "I welcome enquiries about network engineering, web development, robotics and technical collaboration, as well as invitations to speak or mentor.",
};
