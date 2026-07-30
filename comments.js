/* ============================================================
   Formulaire de commentaires "maison", entièrement en français.
   On n'utilise plus le widget Cusdis (son interface reste en
   anglais et son iframe ne se redimensionne pas correctement) :
   on appelle directement l'API publique de Cusdis, qui sert
   uniquement de "coffre-fort" pour stocker et modérer les
   commentaires (tableau de bord sur cusdis.com). Toute
   l'interface visible ci-dessous est la nôtre.
     - GET  .../api/open/comments  → commentaires déjà approuvés
     - POST .../api/open/comments  → nouveau commentaire
       (mis en attente de modération, comme avant)
   ============================================================ */
(function () {
  var API = "https://cusdis.com/api/open/comments";

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function renderComments(container, comments) {
    if (!comments || !comments.length) {
      container.innerHTML = '<p class="comments-empty">Aucun commentaire pour le moment. Soyez le premier à réagir !</p>';
      return;
    }
    container.innerHTML = comments
      .map(function (c) {
        return (
          '<div class="comment-card">' +
            '<div class="comment-head">' +
              '<span class="comment-name">' + escapeHtml(c.by_nickname || "Anonyme") + "</span>" +
              '<span class="comment-date">' + formatDate(c.createdAt) + "</span>" +
            "</div>" +
            '<p class="comment-body">' + escapeHtml(c.content) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  function loadComments(root) {
    var list = root.querySelector("#comments-list");
    if (!list) return;
    var appId = root.dataset.appId;
    var pageId = root.dataset.pageId;
    var url = API + "?appId=" + encodeURIComponent(appId) + "&pageId=" + encodeURIComponent(pageId) + "&page=1";
    fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("network");
        return r.json();
      })
      .then(function (json) {
        var comments = (json && json.data && json.data.data) || [];
        renderComments(list, comments);
      })
      .catch(function () {
        list.innerHTML = '<p class="comments-empty">Impossible de charger les commentaires pour le moment. Réessayez plus tard.</p>';
      });
  }

  function handleSubmit(root, form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = form.querySelector(".comments-status");
      var button = form.querySelector(".comments-submit");
      var nickname = form.nickname.value.trim();
      var email = form.email.value.trim();
      var content = form.content.value.trim();

      if (!nickname || !content) {
        status.textContent = "Merci d'indiquer votre nom et votre message.";
        status.className = "comments-status comments-status-error";
        return;
      }

      button.disabled = true;
      status.textContent = "Envoi en cours…";
      status.className = "comments-status";

      fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: root.dataset.appId,
          pageId: root.dataset.pageId,
          pageUrl: root.dataset.pageUrl,
          pageTitle: root.dataset.pageTitle,
          content: content,
          nickname: nickname,
          email: email,
          parentId: null,
          acceptNotify: !!email
        })
      })
        .then(function (r) {
          if (!r.ok) throw new Error("network");
          return r.json();
        })
        .then(function () {
          status.textContent = "Merci ! Votre message a été envoyé et sera visible après validation.";
          status.className = "comments-status comments-status-ok";
          form.reset();
        })
        .catch(function () {
          status.textContent = "Une erreur est survenue. Merci de réessayer dans un instant.";
          status.className = "comments-status comments-status-error";
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector(".comments[data-app-id]");
    if (!root) return;
    loadComments(root);
    var form = root.querySelector("#comments-form");
    if (form) handleSubmit(root, form);
  });
})();
