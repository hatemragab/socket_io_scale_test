import {express} from "express-useragent";
import {Server} from "socket.io";
import http from 'http';
import ChatServer from "./socket_io/chat_server";


const app = express();

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