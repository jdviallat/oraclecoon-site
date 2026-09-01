/* Moteur i18n du site Oraclecoon.
   - Textes marqués par data-i18n="clé" (innerHTML) ou data-i18n-attr="attr:clé;..."
   - Le FRANÇAIS est le contenu présent dans le HTML : capturé automatiquement au chargement.
     → pas besoin de le dupliquer dans le dictionnaire ; toute clé non traduite retombe sur le FR.
   - Traductions dans window.OC_T (translations.js), chargé AVANT ce script.
   - Langue : ?lang= > mémorisée (localStorage) > langue du navigateur > fr.
   - Sélecteur : <select id="oc-lang"> rempli et câblé automatiquement. */
(function () {
  var LANGS = { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', pt: 'Português', es: 'Español', sv: 'Svenska', no: 'Norsk', fi: 'Suomi' };
  var FR = {};        // snapshot du contenu français (clé -> HTML)
  var FR_ATTR = {};   // snapshot des attributs français (élément+attr -> valeur)
  function T() { return window.OC_T || {}; }
  function pick() {
    try { var s = localStorage.getItem('oc_lang'); if (s && LANGS[s]) return s; } catch (e) {}
    try { var u = new URLSearchParams(location.search).get('lang'); if (u && LANGS[u]) return u; } catch (e) {}
    var n = ((navigator.language || 'fr').slice(0, 2)).toLowerCase();
    return LANGS[n] ? n : 'fr';
  }
  function snapshot() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      FR[el.getAttribute('data-i18n')] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length === 2) FR_ATTR[p[1]] = el.getAttribute(p[0]);
      });
    });
  }
  function apply(lang) {
    var dict = T()[lang] || {};
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      var v = (dict[k] != null) ? dict[k] : FR[k];   // traduction, sinon repli FR
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split(':'); if (p.length !== 2) return;
        var v = (dict[p[1]] != null) ? dict[p[1]] : FR_ATTR[p[1]];
        if (v != null) el.setAttribute(p[0], v);
      });
    });
    try { localStorage.setItem('oc_lang', lang); } catch (e) {}
    var sel = document.getElementById('oc-lang'); if (sel) sel.value = lang;
  }
  function initSelector() {
    var sel = document.getElementById('oc-lang'); if (!sel) return;
    sel.innerHTML = Object.keys(LANGS).map(function (c) { return '<option value="' + c + '">' + LANGS[c] + '</option>'; }).join('');
    sel.addEventListener('change', function () { apply(sel.value); });
  }
  window.OCI18N = { apply: apply, pick: pick, LANGS: LANGS };
  document.addEventListener('DOMContentLoaded', function () { snapshot(); initSelector(); apply(pick()); });
})();
