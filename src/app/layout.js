import "./globals.css";
import Head from "next/head";
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ToastContainer } from "react-toastify";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: "swap",
  adjustFontFallback: false,
})

export const metadata = {
  title: "Private Money Tracker - 100% Local, Zero Cloud Storage",
  description: "Track your income and expenses with complete privacy. All data stays on your device - no servers, no cloud, no tracking. Your financial data belongs to you only.",
  keywords: "private expense tracker, local money tracker, offline finance app, privacy finance, secure expense tracking, no cloud storage, local storage finance, personal budget tracker, private financial data, client-side expense tracker, zero tracking finance app, offline budget app, local financial management",
  authors: [{ name: "Private Finance Tools" }],
  creator: "Private Finance Tools",
  robots: "index, follow",
  openGraph: {
    title: "Private Money Tracker - Your Financial Data Stays Private",
    description: "100% local expense tracking. All your financial data stays on your device. No servers, no cloud storage, complete privacy guaranteed.",
    url: "https://simple-tracker-app.vercel.app",
    siteName: "Private Money Tracker",
    images: [
      {
        url: "https://simple-tracker-app.vercel.app/og-private-tracker.png",
        width: 1200,
        height: 630,
        alt: "Private Money Tracker - Local & Secure Financial Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Money Tracker - 100% Local & Private",
    description: "Track your finances without compromise. All data stays on your device. No cloud, no servers, no tracking.",
    images: ["https://simple-tracker-app.vercel.app/twitter-private-tracker.png"],
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
      <body className={`${plusJakartaSans.variable}`}><ToastContainer />{children}</body>
    </html>
  );
}
