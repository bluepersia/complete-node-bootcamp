
const slugify = require ('slugify');

module.exports = (template, {id, productName, from, nutrients, image, organic, quantity, price, description}) => {

    template = template.replace (/{%ID%}/g, id);
    template = template.replace (/{%PRODUCT_NAME%}/g, productName);
    template = template.replace (/{%FROM%}/, from)
    template = template.replace (/{%IMAGE%}/g, image);
    template = template.replace (/{%PRODUCT_NUTRIENTS%}/g, nutrients);
    template = template.replace (/{%DESCRIPTION%}/g, description);
    template = template.replace (/{%NOT_ORGANIC%}/g, organic ? '' : 'not-organic');
    template = template.replace (/{%QUANTITY%}/g, quantity);
    template = template.replace (/{%PRICE%}/g, price);
    template = template.replace (/{%PRODUCT_NAME_SLUG%}/g, slugify (productName, { lower: true }));

    return template;
}

