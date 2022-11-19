import { CreateCategory, CreatedCategory } from "domain/categories/create-category";
import { Fetcher } from "../helpers/fetcher";

export async function createCategory(category: CreateCategory): Promise<CreatedCategory> {
	const response = await Fetcher
		.baseURL()
		.setBody(category)
		.post<CreatedCategory>(`/api/create-category`)

	if (response.isError) {
		throw new Error(response.data as any)
	}

	return response.data
}
