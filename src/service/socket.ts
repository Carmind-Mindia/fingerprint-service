import { Server, Socket } from 'socket.io';
import * as FingerprintController from "../fingerprint/controller";
import { ProducerState, type ClientToServerEvents, type InterServerEvents, type ServerToClientEvents, type SocketData } from './socket.types';

// Create a new Socket.IO server instance
export const socketServer = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
    >();

export enum RoomsInSocket{
    Producers = 'producers',
    Consumers = 'consumers'
}

socketServer.on('connection', (socket: Socket) => {
    const apikey = socket.handshake.auth.apiKey;
    if(apikey === process.env.API_KEY){
        socket.data.apiKey = apikey;
        socket.join(RoomsInSocket.Producers);

        socket.on('notifyFingerprint', (dni: string, nombre: string, template: string, fingerIndex: number) => {
            FingerprintController.onNewFingerprintVerfiy(dni, nombre, fingerIndex, template);
        });
    }else{
        socket.join(RoomsInSocket.Consumers);

        // Notify the consumer about the producer state
        socketServer.to(RoomsInSocket.Producers).fetchSockets().then((sockets) => {
            const producerState = sockets.length > 0 ? ProducerState.Active : ProducerState.NotFound;
            socket.emit('producerState', producerState);
        });
    }


    socket.on('disconnect', () => {

        // Check if the producer has disconnected
        socketServer.in(RoomsInSocket.Producers).fetchSockets().then((sockets) => {
            const producerState = sockets.length > 0 ? ProducerState.Active : ProducerState.NotFound;
            socket.in(RoomsInSocket.Consumers).emit('producerState', producerState);
        });
    });
});

const port = Number(process.env.SOCKER_PORT) || 3000;

// Start the Socket.IO server
socketServer.listen(port);