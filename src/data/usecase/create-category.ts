import { CreateCategory, CreatedCategory } from "domain/categories/create-category";
import { makeHttpClient } from "../client/factory/http-client";

export async function createCategory(category: CreateCategory): Promise<CreatedCategory> {
	const response = await makeHttpClient()
		.post<CreatedCategory>(`/api/create-category`, category)
	return response.data
}
