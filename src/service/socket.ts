import http from 'http';
import { Server, Socket } from 'socket.io';
import * as FingerprintController from "../fingerprint/controller";
import * as FPUserController from "../fpuser/controller";
import type { IFP_User } from '../fpuser/model';
import { ProducerState, type ClientToServerEvents, type FPNotify, type InterServerEvents, type ServerToClientEvents, type SocketData } from './socket.types';

export var socketServer: Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

export enum RoomsInSocket{
    Producers = 'producers',
    Consumers = 'consumers'
}

export function createServerSocket(httpServer: http.Server){
    
    socketServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {path: '/ws'});
    
    

    console.log(`Socket server listening`)

    socketServer.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>) => {
        console.log(`New connection: ${socket.id}`);

        const apikey = socket.request.headers['x-api-key'];
        if(apikey === process.env.API_KEY){

            socket.data.apiKey = apikey ?? "";
            socket.join(RoomsInSocket.Producers);
    
            socket.on('notifyFingerprint', async (request: FPNotify) => {
                FingerprintController.onNewFingerprintVerfiy(request.dni, request.nombre, request.fingerIndex, request.template);
            });

            socket.on('deleteuser', async (dni: string, callback: (deleted: boolean) => void) => {
                const deleted = await FPUserController.deleteFPUser(dni);
                callback(deleted);
            });

            socket.on('syncUsers', async (users: Array<IFP_User>, callback: (deleteUsers: Array<IFP_User>) => void) => {
                const deleteUsers = await FPUserController.syncUsers(users);
                callback(deleteUsers);
            });

            socket.on('updateOrCreateuser', async (fpUser: IFP_User, callback: (updated: boolean) => void) => {
                await FPUserController.createOrUpdateFPUser(fpUser.dni, fpUser.name, fpUser.lastName);
                callback(true);
            });

            notifyProducerState(socket);
        }else{
            socket.join(RoomsInSocket.Consumers);
    
            // Notify the consumer about the producer state
            notifyProducerState(socket);
        }

        socket.on('ping', (callback: (pong: string) => void) => {
            callback('pong');
        });

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

