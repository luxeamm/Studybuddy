const STORAGE_KEY = "studybuddy.profile.v1";

function loadProfile() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return null;
  }

  let profile;

  try {
    profile = JSON.parse(saved);
  } catch {
    throw new Error("Saved profile could not be read.");
  }

  if (
    !profile ||
    typeof profile !== "object" ||
    typeof profile.displayName !== "string" ||
    !Array.isArray(profile.examGoals)
  ) {
    throw new Error("Saved profile has an invalid format.");
  }

  return profile;
}

function saveProfile(profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

function deleteProfile() {
  localStorage.removeItem(STORAGE_KEY);
}
