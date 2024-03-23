import http from 'http';
import { Server, Socket } from 'socket.io';
import * as FingerprintController from "../fingerprint/controller";
import { ProducerState, type ClientToServerEvents, type InterServerEvents, type ServerToClientEvents, type SocketData } from './socket.types';

export var socketServer: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export enum RoomsInSocket{
    Producers = 'producers',
    Consumers = 'consumers'
}

export function createServerSocket(httpServer: http.Server){
    
    socketServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {path: '/ws'});
    
    

    console.log(`Socket server listening`)

    socketServer.on('connection', (socket: Socket) => {
        console.log(`New connection: ${socket.id}`);

        const apikey = socket.request.headers['x-api-key'];
        if(apikey === process.env.API_KEY){
            socket.data.apiKey = apikey;
            socket.join(RoomsInSocket.Producers);
    
            socket.on('notifyFingerprint', (dni: string, nombre: string, template: string, fingerIndex: number) => {
                FingerprintController.onNewFingerprintVerfiy(dni, nombre, fingerIndex, template);
            });
            notifyProducerState(socket);
        }else{
            socket.join(RoomsInSocket.Consumers);
    
            // Notify the consumer about the producer state
            notifyProducerState(socket);
        }

    
        socket.on('disconnect', () => {
            console.log(`Disconnected: ${socket.id}`);
            
    
            // Check if the producer has disconnected
            notifyProducerState(socket);
        });
    });
}


function notifyProducerState(socket: Socket) {
    socketServer.to(RoomsInSocket.Producers).fetchSockets().then((sockets) => {
        const producerState = sockets.length > 0 ? ProducerState.Active : ProducerState.NotFound;
        socket.to(RoomsInSocket.Consumers).emit('producerState', producerState);
    });
}

