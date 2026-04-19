function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function ensureUniqueSlug(ServiceModel, name, preferredSlug, excludeId) {
  const baseRaw = preferredSlug && String(preferredSlug).trim() ? preferredSlug : name;
  let base = slugify(baseRaw) || "service";
  let candidate = base;
  let n = 0;
  // eslint-disable-next-line no-await-in-loop
  while (await ServiceModel.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })) {
    n += 1;
    candidate = `${base}-${n}`;
  }
  return candidate;
}

module.exports = { slugify, ensureUniqueSlug };
