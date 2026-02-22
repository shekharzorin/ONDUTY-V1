import Setting from "../apimodels/Setting.js";

export async function getGoogleMapKey() {
  const setting = await Setting.findOne({
    key_name: "google_map_key",
    status: true,
  });

  return setting?.value || null;
}

export async function isMapEnabled() {
  const setting = await Setting.findOne({
    key_name: "map_enabled",
  });

  return setting?.value === "true";
}
