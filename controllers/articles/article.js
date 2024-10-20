const { date } = require("joi");
const Article = require("../../models/articles/article");
const moment = require("moment");
const { cloudinary } = require("../../cloudinary/index");

module.exports.showArticles = async (req, res) => {
  const articles = await Article.find({}).sort({ date: -1 });
  // db.foo.find().sort({_id:1}).limit(50);
  // send it to the client
  res.render("article/index", { articles, moment });
};
module.exports.addArticle = async (req, res) => {
  // get the materiel id from the materiels table
  const { date, title, resume, body } = req.body.article;

  const article = new Article({
    date,
    title,
    resume,
    body,
  });
  article.picture = {
    url: req.file.path,
    filename: req.file.filename,
  };
  await article.save();
  req.flash("success", "Article a été ajouté avec succès");
  res.redirect("/articles");
};
module.exports.updateArticle = async (req, res) => {
  const { idarticle } = req.params;
  const { deleteImage } = req.body;
  const { title, date, resume, body } = req.body.article;

  let myArticle;

  let picture = {};
  let hasChanged = false;
  if (req.file) {
    hasChanged = true;
    picture = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }
  console.log(deleteImage);
  if (deleteImage) {
    try {
      await cloudinary.uploader.destroy(deleteImage);
    } catch (error) {
      console.error(`Failed to delete image ${deleteImage}:`, error);
    }
  }
  if (hasChanged) {
    myArticle = await Article.findByIdAndUpdate(idarticle, {
      date: moment(date),
      title,
      resume,
      body,
      picture,
    });
  } else {
    myArticle = await Article.findByIdAndUpdate(idarticle, {
      date: moment(date),
      title,
      resume,
      body,
      picture,
    });
  }

  req.flash("success", "Successfully updated event!");
  res.redirect(`/articles`);
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
