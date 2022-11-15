import { NextApiResponse } from "next";
import { NextRequest } from "next/server";

export default function ping(_request: NextRequest, response: NextApiResponse) {
	return response.status(200).json({ message: 'ok' })
}
