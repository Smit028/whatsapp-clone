// app/layout.js
export const metadata = {
  title: "Chat Application",
  description: "A simple chat application using Next.js and Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
