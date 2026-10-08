// Server-side rules that only one module needs, run by
// lib/services/content-service.js after a save or delete.
// (Kept out of modules.js because that file is shared with the browser.)

export const HOOKS = {
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
