const http = require("http");
const url = require("url");
const fs = require("fs");
const replaceTemplate = require("./modules/TempReplace");

// Read and parse the data file
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataJson = JSON.parse(data);

// Read HTML templates
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/product-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product-page.html`,
  "utf-8"
);

// Create the server
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // Overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataJson
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace(/{%PRODUCTCARD%}/g, cardsHtml);
    res.end(output);

    // Product page
  } else if (pathname === "/product") {
    const product = dataJson[query.id];
    if (product) {
      res.writeHead(200, { "Content-type": "text/html" });
      const output = replaceTemplate(tempProduct, product);
      res.end(output);
    } else {
      res.writeHead(404, { "Content-type": "text/html" });
      res.end("<h1>Product not found!</h1>");
    }

    // API endpoint
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // 404 Not Found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-custom-header": "custom header",
    });
    res.end("<h1>Page Not Found!</h1>");
  }
});

// Start the server
server.listen(3000, () => {
  console.log("Listening on port 3000");
});
