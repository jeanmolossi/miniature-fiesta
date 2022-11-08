export interface CreateAccount {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}

export interface CreatedAccount {
	id: string;
	name: string;
	email: string;
}
