import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import Link from "next/link";
import Image from "next/image";
import logo from "../../public/logo.png"; // Adjust the path to your logo file

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LynkSwap: Omni-Chain DEX",
  description: "Starter template for using thirdweb SDK with Next.js App router",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
          <nav className="p-4 flex items-center justify-between ">
                        
          <div className="flex items-center ml-4">

            <Image src={logo} alt="Project Logo" width={200} height={200} className="mr-4" />
            </div>
            <ul className="flex space-x-4">
            <li>
  <Link href="/" className="text-2xl font-bold text-zinc-300 hover:text-white">
    Home
  </Link>
</li>
<li>
  <Link href="/app" className="text-2xl font-bold text-zinc-300 hover:text-white">
    App
  </Link>
</li>
<li>
  <Link href="/transactions" className="text-2xl font-bold text-zinc-300 hover:text-white">
    Transactions
  </Link>
</li>
<li>
  <Link href="/docs" className="text-2xl font-bold text-zinc-300 hover:text-white">
    Docs
  </Link>
</li>
            </ul>
          </nav>
          {children}
        </ThirdwebProvider>
      </body>
    </html>
  );
}