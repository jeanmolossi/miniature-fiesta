import constants from "@/constants";
import { Http, HttpClient } from "@/data/protocols/http/axios-client";

/**
 * makeHttpClient - Server side factory to new HttpClient
 * @returns {HttpClient}
 */
export function makeHttpClient(): Http.Client {
	return new HttpClient(constants.API_BASE_URL)
}
