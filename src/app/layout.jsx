import './globals.css'
import { Chivo } from 'next/font/google'

const font = Chivo({ weight:'400', subsets: ['latin'] })

export const metadata = {
  title: 'Gavri Kepets',
  description: 'Personal Website of Gavri Kepets',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={font.className}>{children}</body>
    </html>
  )
}
