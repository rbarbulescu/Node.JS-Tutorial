
const fs = require('fs'); // fs - file system
const http = require('http');
const path = require('path');
const url = require('url');

const slugify = require('slugify');

const replateTemplate = require('./starter/modules/replaceTemplate.js');

//================File changes================
//Blocking, synchronous way
// const textIn = fs.readFileSync('./starter/txt/input.txt', 'utf-8');
// console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync('./starter/txt/output.txt', textOut);
// console.log('File written to output.text');

//Non-Blocking, synchronous way
// fs.readFile('./starter/txt/start.txt', 'utf-8', (err, data1) => {

//     if(err){
//         return console.log('Error!!!');
//     }

//     fs.readFile(`./starter/txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile(`./starter/txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./starter/txt/final.txt', `${data1}\n ${data2}\n ${data3}`, 'utf-8', err => {
//                 console.log("writen some text inside final.txt");
//             });
//         });
//     });
// });

// console.log("Log before read!");    



//+++++++++++++++++++++Server+++++++++++++++++++++

const templateOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true}));
console.log(slugs);

const server = http.createServer((req, res) => {

    const { query, pathname } = url.parse(req.url, true);

    //Overview Page
    if(pathname === '/overview' || pathname === '/') {

        res.writeHead(200, { 'Content-type' : 'text/html' });

        const cardsHtml = dataObj.map(el => replateTemplate(templateCard, el)).join('');
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
        res.end(output);
        
        //API Page
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type' : 'application/json' });
        res.end(data);

        //Product Page
    } else if (pathname === "/product") {

        res.writeHead(200, { 'Content-type' : 'text/html' });

        const product = dataObj[query.id];
        const output = replateTemplate(templateProduct, product);
        res.end(output);

        //Not Found!
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header' : 'hello-world'
        });
        res.end('<h1>This page could not be found!!!</h1>');
    }
});

const localHost = '127.0.0.1';
server.listen(8000, localHost, () => {
    console.log('Listening to requests on port 8000');
});