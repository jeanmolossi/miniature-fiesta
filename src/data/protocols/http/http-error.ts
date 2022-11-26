import { AxiosError } from "axios";

export class HttpError extends Error {
	public statusCode: number = 500

	constructor(private readonly _error: Error | AxiosError) {
		super(HttpError.extractMessage(_error))
		this.readStatusCode();
	}

	static extractMessage(error: Error | AxiosError): string {
		if (!error)
			return "Internal Server Error"

		if (error instanceof AxiosError && error.isAxiosError) {
			if ('response' in error && error.response) {
				if (typeof error.response?.data === 'string')
					return error.response.data
				if (error.response.data?.message)
					return error.response.data.message
				if (error.response.data?.error)
					return error.response.data.error
				if (error.response.statusText)
					return error.response.statusText
			}

			if ('request' in error) {
				return "Empty response"
			}

			if (!('response' in error)) {
				return error.message ?? 'Internal Server Error'
			}
		}

		return "Internal Server Error"
	}

	public getResponse(): Record<string, any> {
		const error = this._error
		if (error instanceof AxiosError && error.isAxiosError) {
			if ('response' in error) {
				return error.response
			}

			if ('request' in error) {
				return error.request
			}

			return;
		}

		return
	}

	private readStatusCode() {
		if ('response' in this._error && this._error.response) {
			this.statusCode = this._error.response.status
		}
	}

	public getData() {
		const response = this.getResponse()
		if (response?.data) {
			return response.data
		}

		return;
	}
}
