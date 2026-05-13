(function () {
  var languageStorageKey = "homevault-doc-lang";
  var documentStorageKey = "homevault-doc-type";
  var languageButtons = document.querySelectorAll("[data-lang-button]");
  var documentButtons = document.querySelectorAll("[data-doc-button]");
  var languageBlocks = document.querySelectorAll(".lang-block");
  var documentPanels = document.querySelectorAll(".doc-panel");
  var translatableText = document.querySelectorAll("[data-text-zh][data-text-en]");
  var languageLinks = document.querySelectorAll("[data-lang-link]");
  var printButtons = document.querySelectorAll("[data-print-action]");
  var copyButtons = document.querySelectorAll("[data-copy-link]");
  var copyStatus = document.querySelector("[data-copy-status]");
  var currentLanguage = "zh";
  var currentDocument = "privacy";

  function normalizeLanguage(lang) {
    return lang === "en" ? "en" : "zh";
  }

  function normalizeDocument(doc) {
    return doc === "agreement" ? "agreement" : "privacy";
  }

  function getStoredValue(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return "";
    }
  }

  function setStoredValue(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
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

    return getStoredValue(languageStorageKey) || "zh";
  }

  function getRequestedDocument() {
    var params = new URLSearchParams(window.location.search);
    var queryDocument = params.get("doc");
    if (queryDocument === "privacy" || queryDocument === "agreement") {
      return queryDocument;
    }

    var hashDocument = window.location.hash.replace("#", "");
    if (hashDocument === "privacy" || hashDocument === "agreement") {
      return hashDocument;
    }

    return getStoredValue(documentStorageKey) || "privacy";
  }

  function updateCurrentUrl() {
    if (!window.history || !window.URL) {
      return;
    }

    var currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("doc", currentDocument);
    currentUrl.searchParams.set("lang", currentLanguage);
    window.history.replaceState(null, "", currentUrl.href);
  }

  function updateLanguageLinks() {
    languageLinks.forEach(function (link) {
      var baseHref = link.getAttribute("data-base-href");
      if (!baseHref) {
        baseHref = link.getAttribute("href").replace(/[?#].*$/, "");
        link.setAttribute("data-base-href", baseHref);
      }
      link.setAttribute("href", baseHref + "?doc=" + currentDocument + "&lang=" + currentLanguage);
    });
  }

  function resetCopyStatus() {
    if (!copyStatus) {
      return;
    }
    copyStatus.hidden = true;
    copyStatus.textContent = "";
  }

  function applyState(options) {
    document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-CN";

    languageBlocks.forEach(function (section) {
      section.hidden = section.getAttribute("data-lang") !== currentLanguage;
    });

    documentPanels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-lang") !== currentLanguage || panel.getAttribute("data-doc") !== currentDocument;
    });

    languageButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-lang-button") === currentLanguage));
    });

    documentButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.getAttribute("data-doc-button") === currentDocument));
    });

    translatableText.forEach(function (element) {
      element.textContent = element.getAttribute(currentLanguage === "en" ? "data-text-en" : "data-text-zh");
    });

    updateLanguageLinks();
    resetCopyStatus();
    setStoredValue(languageStorageKey, currentLanguage);
    setStoredValue(documentStorageKey, currentDocument);

    if (!options || options.updateUrl !== false) {
      updateCurrentUrl();
    }
  }

  function setLanguage(lang, options) {
    currentLanguage = normalizeLanguage(lang);
    applyState(options);
  }

  function setDocument(doc, options) {
    currentDocument = normalizeDocument(doc);
    applyState(options);
  }

  languageButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setLanguage(button.getAttribute("data-lang-button"));
    });
  });

  documentButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      setDocument(button.getAttribute("data-doc-button"));
    });
  });

  printButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      window.print();
    });
  });

  function getShareUrl() {
    var url = new URL(window.location.href);
    url.searchParams.set("doc", currentDocument);
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

  currentLanguage = normalizeLanguage(getRequestedLanguage());
  currentDocument = normalizeDocument(getRequestedDocument());
  applyState({ updateUrl: false });
}());
