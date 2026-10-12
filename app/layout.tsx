import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vikas Dhavande',
  description: 'Vikas Dhavande Personal Portfolio & Systems Platform',
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
