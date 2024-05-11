import { Type, type Static } from "@sinclair/typebox/type";
import type { IFP_User } from "../fpuser/model";

export interface ServerToClientEvents {
	fingerPrintReaded: (dni: string, nombre: string) => void
    producerState: (state: ProducerState) => void
}

export interface ClientToServerEvents {
    notifyFingerprint(request: FPNotify): void;
    
    updateOrCreateuser(fpUser: IFP_User, callback: (updated: boolean) => void): void;
    deleteuser(dni: string, callback: (deleted: boolean) => void): void;
    
    syncUsers(users: Array<IFP_User>, callback: (deleteUsers: Array<IFP_User>) => void): void;
    
    ping(callback: (pong: string) => void): void;
}

export interface InterServerEvents {
}

export interface SocketData {
    apiKey: string
}

// ----------------------------

export enum ProducerState { Active = "active", NotFound = "not_found" }

export const Schema_FPNotify = Type.Object({
    dni: Type.String(),
    nombre: Type.String(),
    template: Type.String(),
    fingerIndex: Type.Number()
})

export type FPNotify = Static<typeof Schema_FPNotify>

