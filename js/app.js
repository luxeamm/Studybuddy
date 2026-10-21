function showAppError(message) {
  let box = document.getElementById("appError");

  if (!box) {
    box = document.createElement("p");
    box.id = "appError";
    box.className = "error";
    box.setAttribute("role", "alert");
    document.querySelector("main").prepend(box);
  }

  box.textContent = message;
}

function route(pageName) {
  if (pageName !== "dashboard" && pageName !== "onboarding") {
    return;
  }

  if (pageName === "dashboard") {
    try {
      if (!loadProfile()) {
        pageName = "onboarding";
      }
    } catch (error) {
      pageName = "onboarding";
      showAppError("Saved profile read nahi hui. Data delete nahi kiya gaya.");
    }
  }

  document.querySelectorAll(".view").forEach(function (view) {
    view.hidden = true;
  });

  document.getElementById(pageName + "View").hidden = false;

  document.querySelectorAll(".nav-btn").forEach(function (button) {
    const active = button.dataset.route === pageName;
    button.classList.toggle("active", active);

    if (active) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });

  window.scrollTo(0, 0);
}

function renderProfile(profile) {
  const card = document.getElementById("profileCard");
  card.replaceChildren();

  const name = document.createElement("h3");
  name.textContent = profile.displayName;

  const details = document.createElement("p");
  details.textContent = [
    "Class " + profile.studyClass,
    profile.board,
    profile.academicSession
  ].join(" | ");

  const goals = document.createElement("p");
  goals.textContent = profile.examGoals.join(", ");

  const notice = document.createElement("p");
  notice.className = "muted";
  notice.textContent = "Local-only profile. Online account sync abhi available nahi hai.";

  card.append(name, details, goals, notice);
}

function fillSetupForm(profile) {
  const form = document.getElementById("onboardingForm");

  form.elements.namedItem("displayName").value = profile.displayName;
  form.elements.namedItem("studyClass").value = profile.studyClass;
  form.elements.namedItem("board").value = profile.board;
  form.elements.namedItem("session").value = profile.academicSession;

  form.querySelectorAll('input[name="language"]').forEach(function (input) {
    input.checked = input.value === profile.language;
  });

  form.querySelectorAll('input[name="goals"]').forEach(function (input) {
    input.checked = profile.examGoals.includes(input.value);
  });
}

function initApp() {
  let profile = null;

  try {
    profile = loadProfile();
  } catch (error) {
    showAppError("Saved profile read nahi hui. Purana data delete nahi kiya gaya.");
  }

  applyI18n(profile && profile.language === "hi" ? "hi" : "en");
  initOnboarding();

  try {
    const theme = localStorage.getItem("studybuddy.theme");

    if (theme === "dark" || theme === "light") {
      document.documentElement.dataset.theme = theme;
    }
  } catch (error) {
    showAppError("Theme preference read nahi hui.");
  }

  document.getElementById("langToggle").addEventListener("click", function () {
    const language = document.documentElement.lang === "hi" ? "en" : "hi";
    applyI18n(language);

    document.querySelectorAll('input[name="language"]').forEach(function (input) {
      input.checked = input.value === language;
    });

    if (profile) {
      profile.language = language;

      try {
        saveProfile(profile);
      } catch (error) {
        showAppError("Language badli, lekin preference save nahi hui.");
      }
    }
  });

  document.getElementById("themeToggle").addEventListener("click", function () {
    const theme = document.documentElement.dataset.theme === "dark"
      ? "light"
      : "dark";

    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("studybuddy.theme", theme);
    } catch (error) {
      showAppError("Theme badli, lekin preference save nahi hui.");
    }
  });

  document.querySelectorAll(".nav-btn").forEach(function (button) {
    button.addEventListener("click", function () {
      route(button.dataset.route);
    });
  });

  if (profile) {
    renderProfile(profile);
    fillSetupForm(profile);
    route("dashboard");
  } else {
    route("onboarding");
  }
}

document.addEventListener("DOMContentLoaded", initApp);
