// https://www.npmjs.com/package/joi
const BaseJOI = require("joi");

// https://www.npmjs.com/package/sanitize-html
const sanitizeHtml = require("sanitize-html");

// defining our own validation
// this filters html tags & attributes from given input
const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        'string.escapeHTML' : "{{#label}} must not include HTML!"
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {}
                });
                // if sanitized value is different than the original return string.escapeHTML => '...' must not include HTML!
                if(clean !== value) return helpers.error("string.escapeHTML", { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJOI.extend(extension);

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        //images: Joi.string().required(),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
});