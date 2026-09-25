// Add/edit entries here. Each entry drives a DownloadCard automatically —
// no component changes needed when you add a new document.
export const downloads = [
  {
    id: "cv",
    title: "Curriculum Vitae",
    description:
      "Full CV — education, professional experience, achievements, and technical skills.",
    fileName: "Rasel_Rana_CV.pdf",
    // Place the actual PDF at: public/documents/Rasel_Rana_CV.pdf
    filePath: "/documents/Rasel_Rana_CV.pdf",
    fileType: "PDF",
    fileSize: "79.7 KB", // TODO: update to match the real file
    lastUpdated: "2026-09-01", // TODO: update whenever you replace the PDF
  },
  // Example second entry — remove if you only want the CV here:
  // {
  //   id: "portfolio",
  //   title: "Project Portfolio",
  //   description: "Selected robotics and engineering project writeups.",
  //   fileName: "Rasel_Rana_Portfolio.pdf",
  //   filePath: "/documents/Rasel_Rana_Portfolio.pdf",
  //   fileType: "PDF",
  //   fileSize: "1.1 MB",
  //   lastUpdated: "2026-09-01",
  // },
];

// Convenience export — used by the Navbar's single CV button
export const cvDownload = downloads.find((d) => d.id === "cv");
