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
			<meta charSet="UTF-8" />
			<meta http-equiv="X-UA-Compatible" content="IE=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Financial</title>
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
