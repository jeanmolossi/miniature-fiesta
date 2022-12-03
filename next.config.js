/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
	reactStrictMode: true,
	experimental: {
		appDir: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	assetPrefix: isProd
		? 'https://cdn.jeanmolossi.com.br'
		: undefined,
	poweredByHeader: false,
	httpAgentOptions: {
		keepAlive: false,
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: 'Strict-Transport-Security',
						value: 'max-age=63072000; includeSubDomains; preload'
					},
					{
						key: 'X-XSS-Protection',
						value: '1; mode=block'
					},
					{
						key: 'X-Frame-Options',
						value: 'SAMEORIGIN'
					},
					{
						key: 'Referrer-Policy',
						value: 'origin-when-cross-origin'
					}
				],
			},
		];
	},
};
