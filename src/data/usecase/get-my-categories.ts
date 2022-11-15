import constants from "@/constants";
import { cookies } from "next/headers";
import { Category } from "domain/categories/category";
import { Meta } from "domain/misc/meta";
import { Fetcher } from "../helpers/fetcher";

interface CategoryList {
	categories: Category[];
	meta: Meta;
}

export async function getMyCategories(params?: URLSearchParams) {
	const query = params
		? `?${params.toString()}`
		: ''

	const { data, isError } = await Fetcher
		.baseURL(constants.API_BASE_URL)
		.applyCookies(cookies())
		.get<CategoryList>('/categories' + query)

	if (isError)
		throw new Error(data as any)

	return data;
}
