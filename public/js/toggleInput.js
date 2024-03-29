function selectActe(acte, id) {
  let technicien = document.getElementById("technicien-div-" + id);
  if (acte.value === "KT") {
    technicien.style.display = "";
  } else {
    technicien.style.display = "none";
  }
}
function selectActe2(id, acte) {
  let technicien2 = document.getElementById("tech-" + id);
  let select = document.getElementById(id).value;

  if (acte === "KT" || select === "KT") {
    technicien2.style.display = "";
  } else {
    technicien2.style.display = "none";
  }
}
function makeSubmenu(value, id) {
  let elementId;
  if (id.length != "") elementId = "#city";
  else elementId = "#city" + id;
  let communes = states
    .filter((state) => state.name === value)
    .map((state) => state.communes);

  if (value.length == 0) {
    $(elementId)
      .empty()
      .append(
        "<option class='option' selected disabled value=''>Ville</option>"
      );
  } else {
    for (const ville of communes[0]) {
      $(elementId).append(new Option(ville, ville));
    }
  }
}
function MaterielArticles(value, id) {
  let elementId;
  if (id.length != "") elementId = "#article";
  else elementId = "#article" + id;
  let articles = materials
    .filter((material) => material.designation === value)
    .map((material) => material.article);
  $(elementId)
    .empty()
    .append(
      "<option class='option' selected disabled value=''>Article</option>"
    );
  for (const article of articles[0])
    $(elementId).append(new Option(article.marque, article.marque));
}
function ArticleDetails(value, id) {
  // get the article designation
  const designation = document.getElementById("designation").value;
  let elementId;
  /* this statement is sude to set the selected id of the element 
  to fill the details of the article when id is not empty it means 
  that we're in the edit form if it's not it means we're on the new form
  */
  if (id.length != "") elementId = "#serialN";
  else elementId = "#serialN" + id;
  /*
  go throught the materials array and 
  filter the articles that match the designation
  and map the articles that match the name of article 
  after that get the details attribute only
   */
  let articles = materials
    .filter((material) => material.designation === designation)
    .map((material) => material.article)[0]
    .filter((article) => article.marque === value && article.etat === "Reçu")
    .map((article) => article.detail);
  /* 
    empty the list and append the serial numbers list
    */
  $(elementId)
    .empty()
    .append(
      "<option class='option' selected disabled value=''>Numéro série</option>"
    );
  for (const detail of articles[0])
    if (!detail.taken)
      $(elementId).append(new Option(detail.serie, detail.serie));
}
