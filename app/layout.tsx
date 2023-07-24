import ThemeProvider from '../src/components/ThemeProvider';
import '../src/theme/index.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<body>
				<ThemeProvider>{children}</ThemeProvider>
			</body>
		</html>
	);
}
