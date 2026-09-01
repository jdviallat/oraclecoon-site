/* Traductions des pages Guide, Achat et Confidentialité (fusionnées dans window.OC_T).
   Chargé APRÈS translations.js et AVANT i18n.js. Le français vient du HTML (moteur i18n). */
(function () {
  var X = {
    // Rempli par traduction — clés guide (g*), achat (buy_*), politique (pol_*).
  };
  window.OC_T = window.OC_T || {};
  Object.keys(X).forEach(function (l) {
    window.OC_T[l] = Object.assign(window.OC_T[l] || {}, X[l]);
  });
})();
