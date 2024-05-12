import { FPUser, type IFP_User } from "./model";

// Función para crear un nuevo FPUser
export async function createOrUpdateFPUser(dni: string, name: string, lastName: string) {
	var fpUser = await FPUser.findOne({dni});

	if(fpUser){
		fpUser.name = name;
		fpUser.lastName = lastName;
		fpUser.active = true;
		await fpUser.save();
		console.log(`Updated user: ${dni}`);
		return;
	}

	fpUser = new FPUser({
		dni,
		name,
		lastName
	});

	await fpUser.save();
	console.log(`New user: ${dni}`);
	return fpUser;
}

// Función para eliminar un FPUser
export async function deleteFPUser(dni: string) {
	//Put active to false
	const updated = await FPUser.findOneAndUpdate({dni}, {active: false});
	console.log(`Deleted user: ${dni}`);
	
	return true;
}

export async function getAllUsers() : Promise<IFP_User[]> {
	const users = await FPUser.find({active: true}, {fingerprints: 0, loginId: 0, active: 0});
	return users;
}


export async function syncUsers(users: IFP_User[]) : Promise<IFP_User[]> {
	console.log(users);
	
	// Obtenemos todos los usuarios activos
	const dbUsers = await FPUser.find();

	// Obtenemos los usuarios que han sido eliminados en el servidor
	const deletedOnServer = dbUsers.filter(u => !users.find(usr => usr.dni === u.dni) && u.active);

	users.filter(u => !dbUsers.find(usr => usr.dni === u.dni)).forEach(u => {
		createOrUpdateFPUser(u.dni, u.name, u.lastName);
	});

	// TODO: Sincronizar bien cuando el cliente de java no esta conectado
	
	return deletedOnServer;
}
