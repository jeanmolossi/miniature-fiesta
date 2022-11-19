export interface CreateCategory {
	name: string;
	parent_id?: string;
}

export interface CreatedCategory {
	id: string;
	user: { id: string; };
	name: string;
	created_at: string;
	updated_at: string;
	_self: string;
}
