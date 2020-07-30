const fs = require ('fs');
const http = require ('http');


//////////////////////////
// SERVER
//////////////////////////

const server = http.createServer ((req, res) => {
    res.end ('Hello from the server!');
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