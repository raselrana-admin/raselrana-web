// Server-side rules that only one module needs, run by
// lib/services/content-service.js after a save or delete.
// (Kept out of modules.js because that file is shared with the browser.)

import { today } from "@/lib/file-links";

// Hooks:
//   beforeSave(data, previous)  may change `data` before it is written
//   afterSave(collection, { type, objectId, data, previous })
//   afterDelete(collection, doc)
export const HOOKS = {
  downloads: {
    // Stamp "Last updated" with today's date when a document is new or its
    // file address changed — unless the date was edited by hand in the same
    // save. (Replacing a file behind the same link can't be detected, so
    // that case is set by hand.)
    beforeSave(data, previous) {
      const addressChanged = !previous || previous.fileUrl !== data.fileUrl;
      const dateLeftAlone = !data.lastUpdated || data.lastUpdated === (previous?.lastUpdated ?? "");
      if (addressChanged && dateLeftAlone) data.lastUpdated = today();
    },
  },

  achievements: {
    async afterSave(collection, { type, objectId, data, previous }) {
      // Keep press clippings pointing at a competition whose slug was renamed.
      if (type === "competition" && previous && previous.slug !== data.slug) {
        await collection.updateMany(
          { type: "press", competition: previous.slug },
          { $set: { competition: data.slug } },
        );
      }
      // Only one press clipping can be featured at a time.
      if (type === "press" && data.featured) {
        await collection.updateMany(
          { type: "press", _id: { $ne: objectId } },
          { $set: { featured: false } },
        );
      }
    },

    async afterDelete(collection, doc) {
      if (doc.type === "competition") {
        await collection.updateMany(
          { type: "press", competition: doc.slug },
          { $set: { competition: "" } },
        );
      }
    },
  },
};
