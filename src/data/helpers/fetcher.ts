import constants from "@/constants";

type Method = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
type DataOption = any

interface RequestOptions {
	method: Method;
	headers?: HeadersInit;
	data?: DataOption;
	url: string;
}

type FetcherResponse<Tbody = {}> = {
	statusCode: number;
	data: Tbody
	isError: boolean;
	headers?: Headers;
}

export class Fetcher {
	private headers: Headers;
	private cookies = '';
	private data: DataOption;
	private isDebug = false;

	private constructor(private readonly baseURL: string = '') {}

	public static baseURL(baseURL: string = constants.HOST_URL) {
		return new Fetcher(baseURL)
	}

	public debug() {
		this.isDebug = true
		return this
	}

	private async request<T>(options: RequestOptions): Promise<FetcherResponse<T>> {
		const fromCache = getCache(options)
		if (typeof fromCache !== 'undefined')
			return fromCache

		const { url, method, data, headers } = options

		const result = await fetch(`${this.baseURL}/${url}`, {
			method,
			body: data,
			headers,
			credentials: 'include',
		})
			.then(this.responseParser.bind(this))
			.catch((error) => error)

		setCache(options, result)

		return result
	}

	private async responseParser<T>(response: Response): Promise<FetcherResponse<T>> {
		let res: T = { message: response.statusText } as any;
		try {
			res = await response.json()
		} catch {}

		const { headers } = response;

		if (response.status > 399) {
			try { throw new HttpError(res, response.status, response) }
			catch (e) {
				const err = e as HttpError

				if (this.isDebug)
					console.log(err.stack)

				return {
					statusCode: err.statusCode ?? 500,
					data: err.message as any,
					headers,
					isError: true,
				}
			}
		}

		return {
			statusCode: response.status || 500,
			data: res,
			headers,
			isError: false,
		}
	}

	private bodyParser({ method, data }: Pick<RequestOptions, 'method' | 'data'>) {
		if (method === 'GET') return;
		try { return JSON.stringify(data) } catch { return }
	}

	private urlParser({ method, data, url }: Pick<RequestOptions, 'method' | 'data' | 'url'>) {
		const parseMethods: Method[] = ['HEAD', 'OPTIONS', 'GET']

		if (url.startsWith('/'))
			url = url.replace(/^\//, '')

		if (!parseMethods.includes(method)) return `${url}`;

		const urlParams = new URLSearchParams()

		if (typeof data === 'object' && !Array.isArray(data))
			Object.entries<any>(data).forEach(([key, value]) => {
				urlParams.set(key, value)
			})

		if(urlParams.toString() !== "")
			return `${url}?${urlParams.toString()}`

		return url
	}

	public applyHeaders(headers: Headers): Fetcher {
		if (!this.headers)
			this.headers = headers

		return this;
	}

	public applyCookies(cookies: Map<string, string>): Fetcher {
		const cookiesArray = [];
		for (let cookie of cookies.values()) {
			cookiesArray.push(cookie)
		}

		if (cookiesArray.length > 0)
			this.cookies = cookiesArray.join('; ');

		return this;
	}

	public setHeader(key: string, value: string): Fetcher {
		if (!this.headers)
			this.headers = new Headers()

		this.headers.set(key, value)

		return this;
	}

	public setBody(body: DataOption): Fetcher {
		if (!this.data) {
			this.data = body;
		} else {
			throw Error('Body already set')
		}

		return this;
	}

	private getOptions({
		url,
		method,
	}: Partial<RequestOptions>): RequestOptions {
		this.setHeader('Content-Type', 'application/json')
		this.setHeader('Accept', 'application/json')
		if (this.cookies)
			this.setHeader('Cookie', this.cookies)

		return {
			method,
			data: this.bodyParser({ method, data: this.data }),
			url: this.urlParser({ method, url, data: this.data }),
			headers: this.headers
		}
	}

	public async get<T = any>(url: string) {
		const method: Method = "GET"
		return this.request<T>(
			this.getOptions({
				method,
				url,
			}),
		)
	}

	public async post<T = any>(url: string) {
		const method: Method = "POST"
		return this.request<T>(
			this.getOptions({
				method,
				url,
			}),
		)
	}
}

export class HttpError extends Error {
	constructor(
		public readonly data: any | undefined,
		public readonly statusCode: number = 500,
		_extra: Response
	) {
		super(HttpError.getMessage(data, _extra))

		if (data.status ?? data.statusCode)
			this.statusCode = data.status ?? data.statusCode ?? 500
	}

	private static getMessage(data: any | undefined, _extra: Response): string {
		if (data?.message) return data.message;
		if (data?.error) return data.error;
		if (typeof data === 'string') return data;
		if (_extra.statusText) return _extra.statusText;

		return 'Internal server error'
	}
}

let cache: Record<string, any> = {}

function getCache(options: RequestOptions) {
	const key = JSON.stringify(options)

	if (hasOwnProperty(cache, key)) {
		renewCache(key)
		return cache[key].data
	}

	return
}

function renewCache(key) {
	if (!hasOwnProperty(cache, key))
		return;

	clearTimeout(cache[key].timeout)
	cache[key].timeout = setTimeout(() => {
		delete cache[key]
	}, cache[key].ttl)
}

function setCache(options: RequestOptions, data: any, ttl = 2000) {
	const key = JSON.stringify(options)

	if (!getCache(options)) {
		cache[key] = {
			data: data,
			timeout: setTimeout(() => {
				delete cache[key]
			}, ttl),
			ttl,
		};
	}
}

function hasOwnProperty<O extends Record<string, any>, K extends keyof O>(obj:O, param: K): boolean {
	return Object.prototype.hasOwnProperty.call(obj, param)
}
