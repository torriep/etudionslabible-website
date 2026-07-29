/* ============================================================
   Bouton "Afficher tous les commentaires" pour le widget Cusdis.
   Le widget Cusdis ne redimensionne pas son iframe tout seul
   (bug connu, pas réparable de notre côté), donc l'iframe démarre
   à une hauteur compacte (voir styles.css) et ce script l'agrandit
   au clic, pour être sûr que rien ne reste jamais caché.
   ============================================================ */
document.addEventListener("DOMContentLoaded", function () {
  var btn = document.getElementById("comments-expand-btn");
  var thread = document.getElementById("cusdis_thread");
  if (!btn || !thread) return;

  var expanded = false;
  var LABEL_MORE = "Afficher tous les commentaires ↓";
  var LABEL_LESS = "Réduire ↑";

  btn.addEventListener("click", function () {
    var iframe = thread.querySelector("iframe");
    if (!iframe) return; // le widget n'a pas encore fini de charger
    expanded = !expanded;
    if (expanded) {
      iframe.style.setProperty("height", "2200px", "important");
      btn.textContent = LABEL_LESS;
    } else {
      iframe.style.setProperty("height", "480px", "important");
      btn.textContent = LABEL_MORE;
      thread.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
