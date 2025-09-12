import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "../components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "../components/ThemeProvider";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";
import { getMetadata } from "../utils/scaffold-eth/getMetadata";
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = getMetadata({
  title: "Rovify - Event Discovery & NFT Tickets",
  description: "Discover amazing events, connect with like-minded people, and collect NFT tickets on the blockchain. Built with 🏗 Scaffold-ETH 2",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={`${inter.variable} scroll-smooth`}>
      <body>
        <ThemeProvider enableSystem>
          <AuthProvider>
            <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;