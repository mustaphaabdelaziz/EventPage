
const Article = require("../../models/articles/article");
const moment = require("moment");


module.exports.showArticles = async (req, res) => {

  const articles = await Article.find({});
  // send it to the client
  res.render("article/index", { articles,moment });
};
module.exports.addArticle = async (req, res) => {
  // get the materiel id from the materiels table
  const { date,title, resume, body, photo } =
    req.body.article;
    
  const video = new Article({
    date,
    title,
    resume,
    body,
    photo,
  });
  await video.save();
  req.flash("success", "Article a été ajouté avec succès");
  res.redirect("/articles");
};
module.exports.showArticle = async (req, res) => {
    const { idarticle } = req.params;
    const article = await Article.findById(idarticle);
    // send it to the client
    res.render("article/show", { article, moment });
  };
module.exports.removeArticle = async (req, res) => {
    const { idarticle } = req.params;

    const article = await Article.findByIdAndDelete(idarticle);
    // send it to the client
    
    res.redirect(`/articles`);
  };

