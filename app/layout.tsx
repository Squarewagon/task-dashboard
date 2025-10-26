import './globals.css'

export const metadata = {
  title: 'Task Dashboard',
  description: 'Stay organized and boost your productivity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
