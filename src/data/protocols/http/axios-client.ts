import 'reflect-metadata';
import axios, { AxiosInstance } from "axios";
import { HttpError } from "./http-error";

export namespace Http {
	export enum Method {
		POST = 'POST',
		GET = 'GET',
		PUT = 'PUT',
		PATCH = 'PATCH',
		DELETE = 'DELETE',
		OPTIONS = 'OPTIONS',
		HEAD = 'HEAD',
	}

	export interface Options {
		headers?: Record<string, string>;
		cookies?: Map<string, string>;
		query?: URLSearchParams;
	}

	export interface Response<T> {
		data: T;
		status: number;
		headers?: Map<string, string>
		request?: Record<string, any>
	}

	export interface Params<B extends Record<any, any>> {
		method: Method;
		url: string;
		body?: B;
		query?: URLSearchParams;
		headers?: Record<string, string>;
		cookies?: Map<string, string>;
	}

	export interface Client {
		get<T = any>(path: string, extras?: Options): Promise<Response<T>>
		post<T = any, B extends Record<any, any> = any>(path: string, data?: B, extras?: Options): Promise<Response<T>>
		put<T = any, B extends Record<any, any> = any>(path: string, data?: B, extras?: Options): Promise<Response<T>>
		patch<T = any, B extends string | number | symbol | boolean = any>(path: string, data?: B, extras?: Options): Promise<Response<T>>
		delete<T = any>(path: string, extras?: Options): Promise<Response<T>>
	}

	export interface Config {
		timeout?: number;
		headers?: Record<string, string>
	}
}

export class HttpClient implements Http.Client {
	private readonly client: AxiosInstance;

	constructor(baseURL?: string, config: Http.Config = {}) {
		const { headers = {}, ...options } = config

		this.client = axios.create({
			baseURL,
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				...headers,
			},
			...options
		})
	}

	public async get<T = any>(path: string, extras: Http.Options = {}): Promise<Http.Response<T>> {
		const { headers: xHeaders = {}, query, ...options } = extras;

		return await this.request<T, URLSearchParams>({
			method: Http.Method.GET,
			url: path,
			query,
			headers: xHeaders,
			...options
		})
	}

	public async post<T = any, B extends Record<any, any> = any>(path: string, data?: B, extras: Http.Options = {}): Promise<Http.Response<T>> {
		const { headers: xHeaders, ...options } = extras;

		return await this.request<T, B>({
			method: Http.Method.POST,
			url: path,
			body: data,
			headers: xHeaders,
			...options
		})
	}

	public async put<T, B extends Record<any, any> = any>(path: string, data?: B, extras: Http.Options = {}): Promise<Http.Response<T>> {
		const { headers: xHeaders, ...options } = extras;

		return await this.request<T, B>({
			method: Http.Method.PUT,
			url: path,
			body: data,
			headers: xHeaders,
			...options
		})
	}

	public async patch<T, B extends string | number | boolean | symbol>(path: string, data?: B, extras?: Http.Options): Promise<Http.Response<T>> {
		const { headers: xHeaders, ...options } = extras;

		return await this.request<T, B>({
			method: Http.Method.PUT,
			url: path,
			body: data,
			headers: xHeaders,
			...options
		})
	}

	public async delete<T>(path: string, extras?: Http.Options): Promise<Http.Response<T>> {
		const { headers: xHeaders, ...options } = extras;

		return await this.request<T, never>({
			method: Http.Method.DELETE,
			url: path,
			headers: xHeaders,
			...options
		})
	}

	private async request<T extends Record<any, any>, B>({
		method = Http.Method.GET,
		url,
		body,
		query,
		headers,
		cookies,
	}: Http.Params<B>) {
		let sendData: T extends URLSearchParams ? T : Record<'data', any> = {} as any

		// query param methods
		if ([Http.Method.GET, Http.Method.HEAD, Http.Method.OPTIONS].includes(method))
			Object.assign(sendData, { params: query })
		else // any other write accepted methods will receive body
			Object.assign(sendData, { data: body })

		try {
			const { data, status, headers: responseHeaders, config: request } = await this.client.request<T>({
				method,
				url: url,
				headers: buildCookies(headers, cookies),
				...sendData,
			})

			const mapHeaders = parseHeaders(responseHeaders)

			return { data, status, headers: mapHeaders, request }
		} catch (error) {
			// The request was been sent and the server responds
			// with error
			if (error.response) {
				throw new HttpError(error)
			}

			// The request was been sent and no responde was received
			if (error.request) {
				throw new HttpError(error)
			}

			// any other error case
			throw new HttpError(error)
		}
	}
}

function parseHeaders(_headers: Record<string, string>): Map<string, string> {
	const headers = new Map<string, string>([])

	Object.entries(_headers).forEach(([header, value]) => {
		headers.set(header, value)
	})

	return headers
}


function buildCookies(headers: Record<string, string>, cookies: Map<string, string> = new Map([])): Record<string, string> {
	if (!cookies || cookies?.size === 0) return headers;

	const cookie = [...cookies]
		.flatMap(([, value]) => value ? [`${value.trim()}`] : undefined)
		.join('; ')

	if (!headers) return { Cookie: cookie }
	return Object.assign(headers, { Cookie: cookie })
}
