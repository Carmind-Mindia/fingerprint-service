export interface ServerToClientEvents {
	fingerPrintReaded: (dni: string, nombre: string) => void
    producerState: (state: ProducerState) => void
}

export enum ProducerState { Active = "active", NotFound = "not_found" }

export interface ClientToServerEvents {
    notifyFingerprint(dni: string, nombre: string, template: string, fingerIndex: number): void
    ping: () => string
}

export interface InterServerEvents {
	ping: () => void
}

export interface SocketData {
    apiKey: string
}
