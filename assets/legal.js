(function () {
  var storageKey = "homevault-doc-lang";
  var buttons = document.querySelectorAll("[data-lang-button]");
  var sections = document.querySelectorAll(".lang-block");
  var translatableText = document.querySelectorAll("[data-text-zh][data-text-en]");
  var languageLinks = document.querySelectorAll("[data-lang-link]");
  var printButtons = document.querySelectorAll("[data-print-action]");
  var copyButtons = document.querySelectorAll("[data-copy-link]");
  var copyStatus = document.querySelector("[data-copy-status]");
  var currentLanguage = "zh";

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
    currentLanguage = activeLang;
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
    if (copyStatus) {
      copyStatus.hidden = true;
      copyStatus.textContent = "";
    }

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

  printButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });

  function getShareUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set("lang", currentLanguage);
    return url.href;
  }

  function copyWithFallback(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      var textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.top = "-1000px";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        resolve();
      } catch (error) {
        reject(error);
      } finally {
        document.body.removeChild(textarea);
      }
    });
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      copyWithFallback(getShareUrl()).then(function () {
        if (!copyStatus) {
          return;
        }
        copyStatus.hidden = false;
        copyStatus.textContent = copyStatus.getAttribute(currentLanguage === "en" ? "data-copied-en" : "data-copied-zh");
      });
    });
  });

  setLanguage(getRequestedLanguage(), { updateUrl: false });
}());
