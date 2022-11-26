'use client';

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import '@/presentation/styles/global.css'

export interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
		<head>
			<link rel="shortcut icon" href='/favicon.ico' />
			<meta charSet="UTF-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Financial</title>

			<link rel="manifest" href="/manifest.json" />
		</head>
		<body>
			<ToastContainer
				position='bottom-center'
				autoClose={5000}
				closeOnClick
				pauseOnHover
				theme='dark'
			/>

			{children}
		</body>
    </html>
  )
}
