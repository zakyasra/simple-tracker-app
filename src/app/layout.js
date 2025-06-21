import "./globals.css";
import Head from "next/head";
import { Poppins } from 'next/font/google'
import { ToastContainer } from "react-toastify";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins', // Optional: for CSS variables
  display: "swap",
  adjustFontFallback: false,
})

export const metadata = {
  title: "Expense Tracker",
  description: "Track your expenses easily with our Expense Tracker app.",
  keywords: "expense tracker, budget, finance, personal finance, money management",
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }],
  creator: "Your Name",
  openGraph: {
    title: "Expense Tracker",
    description: "Track your expenses easily with our Expense Tracker app.",
    url: "https://yourwebsite.com/expense-tracker",
    siteName: "Expense Tracker",
    images: [
      {
        url: "https://yourwebsite.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Expense Tracker Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expense Tracker",
    description: "Track your expenses easily with our Expense Tracker app.",
    images: ["https://yourwebsite.com/twitter-image.png"],
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className={`${poppins.variable}`}><ToastContainer />{children}</body>
    </html>
  );
}
