(function () {
  var storageKey = "homevault-doc-lang";
  var buttons = document.querySelectorAll("[data-lang-button]");
  var sections = document.querySelectorAll(".lang-block");
  var translatableText = document.querySelectorAll("[data-text-zh][data-text-en]");
  var languageLinks = document.querySelectorAll("[data-lang-link]");

  function normalizeLanguage(lang) {
    return lang === "en" ? "en" : "zh";
  }

  function getStoredLanguage() {
    try {
      return window.localStorage.getItem(storageKey);
    } catch (error) {
      return "";
    }
  }

  function getRequestedLanguage() {
    var params = new URLSearchParams(window.location.search);
    var queryLanguage = params.get("lang");
    if (queryLanguage === "en" || queryLanguage === "zh") {
      return queryLanguage;
    }

    var hashLanguage = window.location.hash.replace("#", "");
    if (hashLanguage === "en" || hashLanguage === "zh") {
      return hashLanguage;
    }

    return getStoredLanguage() || "zh";
  }

  function updateCurrentUrl(activeLang) {
    if (!window.history || !window.URL) {
      return;
    }

    var currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("lang", activeLang);
    window.history.replaceState(null, "", currentUrl.href);
  }

  function updateLanguageLinks(activeLang) {
    languageLinks.forEach(function (link) {
      var baseHref = link.getAttribute("data-base-href");
      if (!baseHref) {
        baseHref = link.getAttribute("href").replace(/[?#].*$/, "");
        link.setAttribute("data-base-href", baseHref);
      }
      link.setAttribute("href", baseHref + "?lang=" + activeLang);
    });
  }

  function setLanguage(lang, options) {
    var activeLang = normalizeLanguage(lang);
    document.documentElement.lang = activeLang === "en" ? "en" : "zh-CN";

    sections.forEach(function (section) {
      section.hidden = section.getAttribute("data-lang") !== activeLang;
    });

    buttons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang-button") === activeLang));
    });

    translatableText.forEach(function (element) {
      element.textContent = element.getAttribute(activeLang === "en" ? "data-text-en" : "data-text-zh");
    });

    updateLanguageLinks(activeLang);

    try {
      window.localStorage.setItem(storageKey, activeLang);
    } catch (error) {
      return;
    }

    if (!options || options.updateUrl !== false) {
      updateCurrentUrl(activeLang);
    }
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.getAttribute("data-lang-button"));
    });
  });

  setLanguage(getRequestedLanguage(), { updateUrl: false });
}());
