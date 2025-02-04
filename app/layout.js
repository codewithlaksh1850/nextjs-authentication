import "./globals.css";

export const metadata = {
  title: "NextJS Authentication System",
  description: "A secure authentication system using nextjs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
