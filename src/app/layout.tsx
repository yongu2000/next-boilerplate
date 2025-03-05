"use client";

import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';
import ProtectedRoute from "@/components/ProtectedRoute";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ['latin'] });

const publicRoutes = ["/", "/login", "/register", /^\/posts\/\d+$/];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.some((route) =>
    typeof route === "string" ? route === pathname : route.test(pathname)
  );

  return (
    <html lang="ko">
      <body className={`${inter.className} antialiased`}>
        {isPublicRoute ? children : <ProtectedRoute>{children}</ProtectedRoute>};
        <Toaster position="top-center" />
      </body>
    </html>
  );
}

// export const metadata = {
//   title: 'Next.js Boilerplate',
//   description: 'A Next.js boilerplate with authentication and CRUD features',
// };