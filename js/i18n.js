const I18N = {
  en: {
    onboardingTitle: "Let’s set up your study plan",
    dashboard: "Dashboard"
  },
  hi: {
    onboardingTitle: "अपनी पढ़ाई की योजना सेट करें",
    dashboard: "डैशबोर्ड"
  }
};

function applyI18n(lang) {
  const selectedLanguage = I18N[lang] ? lang : "en";

  document.documentElement.lang = selectedLanguage;

  document.querySelectorAll("[data-i18n]").forEach(function (element) {
    const key = element.dataset.i18n;
    const translation = I18N[selectedLanguage][key];

    if (translation) {
      element.textContent = translation;
    }
  });

  document.getElementById("appTitle").textContent =
    selectedLanguage === "hi" ? "स्टडीबड्डी" : "StudyBuddy";
}
