// lib/data/experience.js
// Placeholder content — replace every field marked EXAMPLE with real copy.
// Scope: professional / employment history only, grouped by organization.
// Campus leadership, workshops, seminars, and robot-building belong on the
// Journey page instead — kept out of this file on purpose.

export const experienceIntro = {
  eyebrow: "Career",
  heading: "Experience",
  summary:
    "EXAMPLE: A track record across power generation and telecommunications — from shift engineering at engine-based power plants to managing technical operations at Bangladesh Telecommunications Company Limited (BTCL).",
};

// Each entry is one organization. `positions` holds every role held there,
// so multiple roles at the same org (e.g. BTCL, or SPL across two plants)
// group under one header instead of repeating the org name, and a
// different org is visually distinct.
export const experienceOrganizations = [
  {
    id: "btcl",
    organization: "Bangladesh Telecommunications Company Limited (BTCL)",
    sector: "EXAMPLE: Government / Telecommunications",
    positions: [
      {
        id: "manager-technical-btcl",
        role: "Manager (Technical)",
        location: "Dhaka, Bangladesh",
        period: { start: "EXAMPLE 2022", end: null }, // end: null = current
        employmentType: "Full-time",
        summary:
          "EXAMPLE: Leads technical operations for [division/unit], overseeing network infrastructure, maintenance planning, and cross-team coordination.",
        responsibilities: [
          "EXAMPLE: Oversee day-to-day technical operations and service continuity",
          "EXAMPLE: Coordinate maintenance schedules across field and technical teams",
          "EXAMPLE: Prepare technical and administrative documentation for leadership review",
        ],
        tools: [
          "EXAMPLE: Network monitoring tools",
          "EXAMPLE: MS Office / documentation suite",
        ],
      },
      {
        id: "manager-phones-central-cantonment",
        role: "Manager (Phones), Central Cantonment",
        location: "Central Cantonment, Dhaka, Bangladesh",
        period: { start: "EXAMPLE 2023", end: null },
        employmentType: "Additional Charge",
        summary:
          "EXAMPLE: Holds concurrent charge of phone services and estate-related matters for the Central Cantonment posting, alongside the primary technical role.",
        responsibilities: [
          "EXAMPLE: Manage phone service operations for the cantonment area",
          "EXAMPLE: Liaise with cantonment authorities on facilities and service matters",
          "EXAMPLE: Handle administrative correspondence for the posting",
        ],
        tools: ["EXAMPLE: Internal service-tracking systems"],
      },
    ],
  },
  {
    id: "summit-power-limited",
    organization: "Summit Power Limited (SPL)",
    sector: "Private / Power Generation",
    positions: [
      {
        id: "spl-gazipur",
        role: "Assistant Deputy Manager-Tech (Shift Engineer, Operation Department)",
        location: "Gazipur, Bangladesh",
        period: { start: "June 2021", end: "October 2021" },
        employmentType: "Full-time",
        summary:
          "Shift engineer in the operation department of a 300 MW engine-based power plant.",
        responsibilities: [
          "EXAMPLE: Monitored and operated engine-based power generation units during assigned shifts",
          "EXAMPLE: Logged operational parameters and reported plant performance",
          "EXAMPLE: Responded to operational faults and coordinated with maintenance teams",
        ],
        tools: [
          "EXAMPLE: Plant SCADA / control room systems",
          "EXAMPLE: Engine monitoring instrumentation",
        ],
      },
      {
        id: "spl-narayanganj",
        role: "Assistant Deputy Manager-Tech (Shift Engineer, Operation Department)",
        location: "Narayanganj, Bangladesh",
        period: { start: "22 April 2018", end: "June 2021" },
        employmentType: "Full-time",
        summary:
          "Shift engineer in the operation department of a 157 MW engine-based power plant.",
        responsibilities: [
          "EXAMPLE: Monitored and operated engine-based power generation units during assigned shifts",
          "EXAMPLE: Logged operational parameters and reported plant performance",
          "EXAMPLE: Responded to operational faults and coordinated with maintenance teams",
        ],
        tools: [
          "EXAMPLE: Plant SCADA / control room systems",
          "EXAMPLE: Engine monitoring instrumentation",
        ],
      },
    ],
  },
];

// Aggregated, de-duplicated tools/skills across every organization and position.
export const experienceSkills = Array.from(
  new Set(
    experienceOrganizations.flatMap((org) =>
      org.positions.flatMap((position) => position.tools),
    ),
  ),
);
