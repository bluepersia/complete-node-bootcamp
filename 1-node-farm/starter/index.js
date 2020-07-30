const fs = require ('fs');
const http = require ('http');
const url = require ('url');



//////////////////////////
// SERVER
//////////////////////////

const replaceTemplate = (template, {id, productName, from, nutrients, image, organic, quantity, price, description}) => {

    template = template.replace (/{%ID%}/g, id);
    template = template.replace (/{%PRODUCT_NAME%}/g, productName);
    template = template.replace (/{%FROM%}/, from)
    template = template.replace (/{%IMAGE%}/g, image);
    template = template.replace (/{%PRODUCT_NUTRIENTS%}/g, nutrients);
    template = template.replace (/{%DESCRIPTION%}/g, description);
    template = template.replace (/{%NOT_ORGANIC%}/g, organic ? '' : 'not-organic');
    template = template.replace (/{%QUANTITY%}/g, quantity);
    template = template.replace (/{%PRICE%}/g, price);

    return template;

}

const productsData = fs.readFileSync (`${__dirname}/dev-data/data.json`, 'utf-8');
const productsJSON = JSON.parse (productsData);

const tempOverview = fs.readFileSync (`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync (`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync (`${__dirname}/templates/template-product.html`, 'utf-8');



const server = http.createServer ((req, res) => {
    const {query, pathname : pathName} = url.parse (req.url, true);


    let statusCode = 200;
    let headers = {"Content-type": "text/html", "my-own-header": "Found!"};

    let response;

    switch (pathName)
    {
        //Overview page
        case "/overview":
        case "/":

            const cardsHtml = productsJSON.map (el => replaceTemplate (tempCard, el)).join ('');

            response = tempOverview.replace ('{%PRODUCT_CARDS%}', cardsHtml);

            break;

        //Product page
        case "/product":

            if (query)
            {
                const product = productsJSON.find (({id}) => id == query.id);

                response = replaceTemplate (tempProduct, product);
            }
            else 
            {
                response = 'Product not found.';
                statusCode = 404;
            }
            break;


        // API
        case "/api":
            
            headers["Content-type"] = 'application/json';
            response = productsData;

            break;

        // Not found
        default:
            statusCode = 404;
            headers["my-own-header"] = "Not found :(";
            response = '<h1>Page not found!</h1>';

    }

    const respond = () => 
    {
        res.writeHead (statusCode, headers);
        res.end (response);
    }

    if (response)
        respond ();

})

server.listen (8000, '127.0.0.1', () => {
    console.log ('Server started.');
});


//////////////////////////
// FILES
//////////////////////////


// Blocking, synchronous way
/*
const textIn = fs.readFileSync ('./txt/input.txt', 'utf-8');
console.log (textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync ('./txt/output.txt', textOut);
console.log (fs.readFileSync ('./txt/output.txt', 'utf-8'));
*/


// Non-blocking, asynchronous way

/*
fs.readFile ('./txt/start.txt', 'utf-8', (err, data1) => {
    fs.readFile (`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
        fs.readFile ('./txt/append.txt', 'utf-8', (err, data3) => {
            
            fs.writeFile ('./txt/final.txt', `${data2}${data3}`, err => {

                console.log ('Your file has been written');

                fs.readFile ('./txt/final.txt', 'utf-8', (err, final) => console.log (final));

            });
        });
    });
});
console.log ('Reading file...');
*/