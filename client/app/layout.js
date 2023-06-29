import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import Toaster from "./Toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pollapex",
  description: "Build powerful surveys!",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Provider>
          <Toaster />
          {children}
        </Provider>
      </body>
    </html>
  );
}
