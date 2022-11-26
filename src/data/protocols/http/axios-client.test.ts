import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { describe, test, expect, beforeAll, afterAll, afterEach, beforeEach } from 'vitest';
import { HttpClient } from './axios-client';

function defaultHandler(status = 200, message?: string) {
	let response: Record<any, any>;
	if (message)
		response = { message }
	if (!message && typeof message === 'undefined')
		response = { message: "OK" }

	return (_, res, ctx) => {
		return res(
			ctx.status(status),
			ctx.json(response)
		)
	}
}

export const handlers = [
	rest.get('/ping', defaultHandler()),
	rest.post('/post', defaultHandler(201)),
	rest.put('/put',  defaultHandler()),
	rest.delete('/delete', defaultHandler(204, null))
]

const server = setupServer(...handlers)

type Result = { message: "OK" }

describe('Http protocol > HttpClient', function () {
	let client: HttpClient;

	beforeAll(() => server.listen())
	beforeEach(() => { client = new HttpClient() })
	afterAll(() => server.close())
	afterEach(() => {
		server.resetHandlers()
		client = undefined;
	})

	test('should call get request', async function () {
		const fakeQuery = new URLSearchParams()
		fakeQuery.append('param', 'value')
		const call = client.get<Result>('/ping', fakeQuery, { headers: { 'x-extra-header': '1' } })

		const { data, status, request } = await call
		expect(data).toEqual({ message: "OK" })
		expect(status).toBe(200)
		expect(request.headers).toHaveProperty('x-extra-header', '1')
	})

	test('should call post request', async function () {
		const call = client.post<Result>(
			'/post',
			{ fakeBody: true },
			{ headers: { 'x-extra-header': '1' } }
		)

		const { data, status, request } = await call
		expect(data).toEqual({ message: "OK" })
		expect(status).toBe(201)
		expect(request.headers).toHaveProperty('x-extra-header', '1')
	})

	test('should call put request', async function () {
		const call = client.put<Result>(
			'/put',
			{ fakeBody: true },
			{ headers: { 'x-extra-header': '1' } }
		)

		const { data, status, request } = await call
		expect(data).toEqual({ message: "OK" })
		expect(status).toBe(200)
		expect(request.headers).toHaveProperty('x-extra-header', '1')
	})

	test('should call delete request', async function () {
		const call = client.delete(
			'/delete',
			{ headers: { 'x-extra-header': '1' } }
		)

		const { data, status, request } = await call
		expect(data).toBeFalsy()
		expect(status).toBe(204)
		expect(request.headers).toHaveProperty('x-extra-header', '1')
	})
})
