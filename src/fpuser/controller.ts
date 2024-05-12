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
}

// Función para eliminar un FPUser
export async function deleteFPUser(dni: string) {
	//Put active to false
	const updated = await FPUser.findOneAndUpdate({dni}, {active: false});
	console.log(`Deleted user: ${dni}`);
	
	return true;
}

export async function getAllUsers() : Promise<IFP_User[]> {
	const users = await FPUser.find({active: true});
	return users;
}


export async function syncUsers(users: IFP_User[]) : Promise<IFP_User[]> {
    throw new Error('Function not implemented.');
}
