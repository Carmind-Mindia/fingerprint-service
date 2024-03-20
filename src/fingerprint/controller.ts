import { RoomsInSocket, socketServer } from "../service/socket";
import { Fingerprint } from "./model";

// Función para dar de alta un subscriptor
export async function updateOrCreateFingerprint(dni: string, fingerIndex: number, fingerData: string) {

	var finger = await Fingerprint.findOne({dni, template: fingerData});

	if(finger){
		finger.lastDateVerified = new Date();
		await finger.save();
		return;
	}

	// Crear un nuevo documento de fingerprint
	finger = new Fingerprint({
		dni,
		template: fingerData,
		fingerIndex,
		lastDateVerified: new Date()
	})

	await finger.save()

	return;
}

export async function onNewFingerprintVerfiy(dni: string, nombre: string, fingerIndex: number, fingerData: string) {
	await updateOrCreateFingerprint(dni, fingerIndex, fingerData);

	socketServer.in(RoomsInSocket.Consumers).emit('fingerPrintReaded', dni, nombre);
}

