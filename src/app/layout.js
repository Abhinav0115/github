import localFont from "next/font/local";
import "./globals.css";
import { AccessibilityProvider } from "@/utils/Accessibility/AccessibilityProvider";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { UserStorageProvider } from "@/contexts/UserStorageContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
    title: "Repository Explorer - Discover & Explore GitHub Repositories",
    description:
        "A modern, accessible web application to search GitHub users and explore their repositories with advanced filtering and analytics.",
    keywords:
        "GitHub, repositories, developer tools, code explorer, git, open source",
    author: "Abhinav Anand",
    viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="">
                <AccessibilityProvider>
                    <UserStorageProvider>
                        <FavoritesProvider>
                            {children}
                            <ToastContainer
                                position="top-right"
                                autoClose={3000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                                theme="light"
                                toastClassName="dark:bg-gray-800 dark:text-white"
                            />
                        </FavoritesProvider>
                    </UserStorageProvider>
                </AccessibilityProvider>
            </body>
        </html>
    );
}
