/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./src/**/*.{js,ts,jsx,tsx}",
		"./src/**/components/*.{js,ts,jsx,tsx}"
	],
	theme: {
		fontFamily: {
			cal: ["Cal Sans", "Inter var", "sans-serif"],
		},
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans],
				mono: ["Consolas", ...defaultTheme.fontFamily.mono],
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
	],
};
