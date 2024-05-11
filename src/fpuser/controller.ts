import { FPUser, type IFP_User } from "./model";

// Función para crear un nuevo FPUser
export async function createOrUpdateFPUser(dni: string, name: string, lastName: string) {
	var fpUser = await FPUser.findOne({dni});

	if(fpUser){
		fpUser.name = name;
		fpUser.lastName = lastName;
		await fpUser.save();
		return;
	}

	fpUser = new FPUser({
		dni,
		name,
		lastName
	});

	await fpUser.save();
}

// Función para eliminar un FPUser
export async function deleteFPUser(dni: string) {
	//Put active to false
	const updated = await FPUser.findOneAndUpdate({dni}, {active: false});
	return !!updated;
}



export async function syncUsers(users: IFP_User[]) : Promise<IFP_User[]> {
    throw new Error('Function not implemented.');
}
