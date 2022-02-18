import {Server} from "socket.io";
import {createClient} from "redis";
import {createAdapter} from "@socket.io/redis-adapter";
import {instrument} from "@socket.io/admin-ui";

export default class ChatServer {
    constructor(httpServer) {
        this.listen(httpServer);
    }

    private async listen(httpServer) {
        global.io = new Server(httpServer, {
            //    maxHttpBufferSize: 100000000,
            connectTimeout: 5000,
            transports: ['websocket'],
            pingInterval: 20 * 1000,
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
        const pubClient = createClient();
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]).then(async () => {
            global.io.adapter(createAdapter(pubClient, subClient));
            instrument(global.io, {
                auth: false
            });
        })
        global.io.on('connection', async socket => {
            console.log(socket.id + " is connected")
            socket.join("r")
            socket.on('disconnect', () => {
                console.log(socket.id + " is Dis connected")
            })
            socket.on('send:all', (data) => {
                global.io.in("r").emit("room:event", data)
            })
        })

    }

}
setInterval(args => {
    global.io.in("r").emit("room:count", global.io.of("/").adapter.sids.size)
}, 2 * 1000)