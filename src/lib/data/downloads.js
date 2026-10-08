// Add/edit entries here. Each entry drives a DownloadCard automatically —
// no component changes needed when you add a new document.
export const downloads = [
  {
    id: "portfolio",
    title: "Professional Portfolio",
    description:
      "An overview of my work — roles, responsibilities, and project outcomes across technical operations, facilities, and administration.",
    fileName: "Rasel_Rana_Portfolio.pdf",
    // Place the actual PDF at: public/documents/Rasel_Rana_Portfolio.pdf
    filePath: "/documents/Rasel_Rana_Portfolio.pdf",
    fileType: "PDF",
    fileSize: "79.7 KB", // TODO: update to match the real file
    lastUpdated: "2026-09-01", // TODO: update whenever you replace the PDF
  },
  {
    id: "vcard",
    title: "Contact Card",
    description:
      "Save my contact details directly to your phone or address book.",
    fileName: "Rasel_Rana.vcf",
    // Place the actual file at: public/documents/Rasel_Rana.vcf
    filePath: "/documents/Rasel_Rana.vcf",
    fileType: "VCF",
    fileSize: "1 KB",
    lastUpdated: "2026-09-26",
  },
];
