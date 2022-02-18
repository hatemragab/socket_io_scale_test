"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_useragent_1 = require("express-useragent");
const http_1 = __importDefault(require("http"));
const chat_server_1 = __importDefault(require("./socket_io/chat_server"));
const app = (0, express_useragent_1.express)();
const server = http_1.default.createServer(app);
server.on('listening', () => {
    console.log("Server run on port 3000");
});
server.listen(3000);
new chat_server_1.default(server);
