import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export default function ping(request: NextRequest, response: NextApiResponse) {
	return response.status(200).json({ message: 'ok' })
}
