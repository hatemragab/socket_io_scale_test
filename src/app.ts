import {Server} from "socket.io";
import http from 'http';
import ChatServer from "./socket_io/chat_server";
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
declare global {
    namespace NodeJS {
        interface Global {
            io: Server;
        }
    }
}
const server = http.createServer(app);
server.on('listening', () => {
    console.log("Server run on port 3000")
});
server.listen(3000);
new ChatServer(server)