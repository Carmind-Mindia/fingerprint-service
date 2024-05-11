import { FPUser } from "../fpuser/model";
import { RoomsInSocket, socketServer } from "../service/socket";

// Función para dar de alta un subscriptor
export async function updateOrCreateFingerprint(dni: string, fingerIndex: number, fingerData: string) {

	var fpuser = await FPUser.findOne({dni});

	if(!fpuser){
		// TODO: Enviar un mensaje de error
		return;
	}

	fpuser.lastDateVerified = new Date();

	fpuser.fingerprints = fpuser.fingerprints || [];

	// Buscar si el fingerprint ya existe
	var finger = fpuser.fingerprints.find(f => f.fingerIndex === fingerIndex);

	if(finger){
		if(finger.template !== fingerData){
			finger.template = fingerData;
			console.log(`Updated fingerprint: ${dni} - ${fingerIndex}`);
		} else {
			console.log(`Fingerprint already exists: ${dni} - ${fingerIndex}`);
		}
	}

	if(!finger){
		fpuser.fingerprints.push({fingerIndex, template: fingerData});
		console.log(`New fingerprint: ${dni} - ${fingerIndex}`);
	}
		

	await fpuser.save();
	return;
}

export async function onNewFingerprintVerfiy(dni: string, nombre: string, fingerIndex: number, fingerData: string) {
	await updateOrCreateFingerprint(dni, fingerIndex, fingerData);
	
	socketServer.in(RoomsInSocket.Consumers).emit('fingerPrintReaded', dni, nombre);
}

