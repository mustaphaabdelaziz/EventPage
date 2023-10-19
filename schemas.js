const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.eventSchema = Joi.object({
  event: Joi.object({
    title: Joi.string().required().escapeHTML(),
    category: Joi.string().required(),
    start: Joi.date().required().greater("now"),
    end: Joi.date().required().greater(Joi.ref("start")),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.comentSchema = Joi.object({
  coment: Joi.object({
    body: Joi.string().required().escapeHTML(),
  }).required(),
});
