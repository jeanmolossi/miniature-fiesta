import constants from "@/constants";
import { HttpClient } from "@/data/protocols/http/axios-client";

/**
 * makeHttpClient - Client side factory to new HttpClient
 * @returns {HttpClient}
 */
export function makeHttpClient(): HttpClient {
	return new HttpClient(constants.HOST_URL)
}
