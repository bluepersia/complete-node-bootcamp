const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////
// SERVER
//////////////////////////

const productsData = fs.readFileSync(
  `${__dirname}/dev-data/data.json`,
  'utf-8'
);
const productsJSON = JSON.parse(productsData);

const slugs = productsJSON.map((product) =>
  slugify(product.productName, { lower: true })
);
console.log(slugs);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const server = http.createServer((req, res) => {
  const { query, pathname: pathName } = url.parse(req.url, true);

  console.log(url.parse(req.url, true));

  let statusCode = 200;
  let headers = { 'Content-type': 'text/html', 'my-own-header': 'Found!' };

  let response;

  switch (pathName) {
    //Overview page
    case '/overview':
    case '/':
      const cardsHtml = productsJSON
        .map((el) => replaceTemplate(tempCard, el))
        .join('');

      response = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

      break;

    // API
    case '/api':
      headers['Content-type'] = 'application/json';
      response = productsData;

      break;

    // Not found
    default:
      statusCode = 404;
      headers['my-own-header'] = 'Not found :(';
      response = '<h1>Page not found!</h1>';
  }

  if (pathName.startsWith('/product/')) {
    const productSlug = pathName.slice(pathName.lastIndexOf('/') + 1);

    if (query) {
      const product = productsJSON.find(
        ({ productName }) =>
          slugify(productName, { lower: true }) == productSlug
      );

      response = replaceTemplate(tempProduct, product);
    } else {
      response = 'Product not found.';
      statusCode = 404;
    }
  }

  const respond = () => {
    res.writeHead(statusCode, headers);
    res.end(response);
  };

  if (response) respond();
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server started.');
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
