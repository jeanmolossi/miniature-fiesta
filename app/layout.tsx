'use client';

import '@/presentation/styles/global.scss'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
		<head></head>
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
