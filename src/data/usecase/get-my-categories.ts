import { cookies } from "next/headers";
import { Category } from "domain/categories/category";
import { Meta } from "domain/misc/meta";
import { makeHttpClient } from "../server/factory/http-client";

interface CategoryList {
	categories: Category[];
	meta: Meta;
}

export async function getMyCategories(query?: URLSearchParams) {
	const { data } = await makeHttpClient()
		.get<CategoryList>('/categories', {query, cookies: cookies()})
	return data;
}
