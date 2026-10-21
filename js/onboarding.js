function initOnboarding() {
  const form = document.getElementById("onboardingForm");
  const errorBox = document.getElementById("formError");

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    errorBox.setAttribute("role", "alert");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    errorBox.hidden = true;

    const data = new FormData(form);
    const name = String(data.get("displayName") || "").trim();
    const studyClass = String(data.get("studyClass") || "");
    const board = String(data.get("board") || "").trim();
    const session = String(data.get("session") || "").trim();
    const goals = data.getAll("goals").map(String);
    const language = data.get("language") === "hi" ? "hi" : "en";

    if (!name || name.length > 60) {
      showError("Naam 1 se 60 characters ke beech likho.");
      return;
    }

    if (!["9", "10", "11", "12"].includes(studyClass) || !board) {
      showError("Class aur board select karo.");
      return;
    }

    if (goals.length === 0) {
      showError("Kam se kam ek exam goal select karo.");
      return;
    }

    if (!/^[0-9]{4}-[0-9]{2}$/.test(session)) {
      showError("Session is tarah likho: 2026-27");
      return;
    }

    const year = Number(session.slice(0, 4));
    const nextYear = Number(session.slice(5));

    if (nextYear !== (year + 1) % 100) {
      showError("Session ke saal consecutive hon: 2026-27");
      return;
    }

    try {
      const oldProfile = loadProfile();
      const now = new Date().toISOString();

      saveProfile({
        schemaVersion: 1,
        displayName: name,
        language: language,
        studyClass: studyClass,
        board: board,
        academicSession: session,
        examGoals: goals,
        createdAt: oldProfile && oldProfile.createdAt
          ? oldProfile.createdAt
          : now,
        updatedAt: now
      });
    } catch (error) {
      showError("Profile save nahi hui. Browser storage check karo.");
      return;
    }

    location.reload();
  });

  document.getElementById("resetProfile").addEventListener("click", function () {
    if (!confirm("Is browser ki saved profile delete karni hai?")) {
      return;
    }

    try {
      deleteProfile();
      location.reload();
    } catch (error) {
      alert("Profile delete nahi hui. Browser storage check karo.");
    }
  });
}
