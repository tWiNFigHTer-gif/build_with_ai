import type { ReactNode } from "react";

export const metadata = {
	title: "LearnSync",
	description: "AI-powered study sync platform"
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}

