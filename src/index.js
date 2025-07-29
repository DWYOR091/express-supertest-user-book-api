const app = require("./app");
const http = require("http");

const server = http.createServer(app);

server.listen(3200, () => console.log("server is running"));
