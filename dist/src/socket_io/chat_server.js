"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
class ChatServer {
    constructor(httpServer) {
        this.listen(httpServer);
    }
    async listen(httpServer) {
        global.io = new socket_io_1.Server(httpServer, {
            maxHttpBufferSize: 100000000,
            connectTimeout: 5000,
            transports: ['websocket'],
            pingInterval: 15 * 1000,
            pingTimeout: 5000,
            allowEIO3: true,
            allowRequest: (req, callback) => {
                callback(null, true);
            },
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            }
        });
        const pubClient = (0, redis_1.createClient)();
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]).then(async () => {
            global.io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        });
        global.io.on('connection', async (socket) => {
            console.log(socket.id + " is connected");
            socket.join("r");
            socket.on('disconnect', () => {
                console.log(socket.id + " is Dis connected");
            });
            socket.on('send:all', (data) => {
                global.io.in("r").emit("room:event", "HELLO FROM ROOM EV" + data);
            });
        });
    }
}
exports.default = ChatServer;
// setInterval(args => {
//     global.io.in("r").emit("room:event", "HELLO FROM ROOM EV")
// }, 30 * 1000)
