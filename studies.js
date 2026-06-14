/* ============================================================
   Liste des études bibliques.
   POUR AJOUTER UNE ÉTUDE : copiez un bloc { ... } ci-dessous,
   collez-le en haut de la liste, et remplissez les champs.
   Le champ "fichier" doit pointer vers la page HTML de l'étude
   (dans le dossier "etudes/").
   ============================================================ */

const ETUDES = [
  {
    titre: "La repentance",
    date: "14 juin 2026",
    categorie: "Étude de mot — Nouveau Testament",
    extrait: "Pourquoi le grec emploie deux mots — metamelomai (le regret des conséquences) et metanoeō (le changement de cœur) — là où le français n'en a qu'un. Une étude sur ce que l'Évangile entend vraiment par « se repentir ».",
    fichier: "etudes/la-repentance.html"
  },
  {
    titre: "La conscience",
    date: "14 juin 2026",
    categorie: "Étude de mot — Nouveau Testament",
    extrait: "Une trentaine de passages où paraît le mot « conscience », rassemblés et regroupés par thème : le témoin intérieur qui accuse ou approuve, la bonne conscience, la conscience faible ou souillée, et sa purification par Christ.",
    fichier: "etudes/la-conscience.html"
  }
  // ,{
  //   titre: "Titre de la prochaine étude",
  //   date: "1 juillet 2026",
  //   categorie: "Psaumes",
  //   extrait: "Court résumé de l'étude…",
  //   fichier: "etudes/mon-fichier.html"
  // }
];

/* Génère les cartes d'étude dans n'importe quelle page contenant
   un élément avec l'attribut data-studies (limite optionnelle). */
function afficherEtudes() {
  document.querySelectorAll("[data-studies]").forEach(function (zone) {
    const limite = parseInt(zone.getAttribute("data-studies"), 10);
    const liste = isNaN(limite) ? ETUDES : ETUDES.slice(0, limite);
    zone.innerHTML = liste.map(function (e) {
      return (
        '<a class="card" href="' + e.fichier + '">' +
          '<div class="thumb"><div class="glow"></div></div>' +
          '<div class="body">' +
            '<span class="meta">' + e.categorie + ' · ' + e.date + '</span>' +
            '<h3>' + e.titre + '</h3>' +
            '<p>' + e.extrait + '</p>' +
            '<span class="more">Lire l\'étude</span>' +
          '</div>' +
        '</a>'
      );
    }).join("");
  });
}

document.addEventListener("DOMContentLoaded", afficherEtudes);
