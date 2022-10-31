import UnauthDefaultLayout from "../src/presentation/components/_unauth_layout";

export interface RootLayoutProps {
	children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <head></head>
      <body>
		<UnauthDefaultLayout>
			{children}
		</UnauthDefaultLayout>
	  </body>
    </html>
  )
}
