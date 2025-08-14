"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    GitHub,
    Search,
    Home,
    Menu,
    Close,
    DarkMode,
    LightMode,
    Favorite,
} from "@mui/icons-material";
import { useFavorites } from "@/contexts/FavoritesContext";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { getFavoritesCount } = useFavorites();

    // Load theme from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setIsDarkMode(true);
            document.documentElement.classList.add("dark");
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);

        if (newTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="flex items-center space-x-2 text-gray-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
                                <GitHub className="h-6 w-6 text-white" />
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-xl font-bold text-gray-800 dark:text-white">
                                    Repository Explorer
                                </span>
                                <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                                    Discover Repositories
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            href="/"
                            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200"
                        >
                            <Home className="h-4 w-4" />
                            <span className="font-medium">Home</span>
                        </Link>

                        <Link
                            href="/"
                            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        >
                            <Search className="h-4 w-4" />
                            <span className="font-medium">Search</span>
                        </Link>

                        <Link
                            href="/favorites"
                            className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 relative"
                        >
                            <Favorite className="h-4 w-4" />
                            <span className="font-medium">Favorites</span>
                            {getFavoritesCount() > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px] font-bold">
                                    {getFavoritesCount() > 99
                                        ? "99+"
                                        : getFavoritesCount()}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Right side actions */}
                    <div className="flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            title={
                                isDarkMode
                                    ? "Switch to Light Mode"
                                    : "Switch to Dark Mode"
                            }
                            aria-label={
                                isDarkMode
                                    ? "Switch to Light Mode"
                                    : "Switch to Dark Mode"
                            }
                        >
                            {isDarkMode ? (
                                <LightMode className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <DarkMode className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>

                        {/* GitHub Link */}
                        <Link
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center space-x-2 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            aria-label="Visit GitHub website"
                        >
                            <GitHub className="h-4 w-4" />
                            <span className="text-sm font-medium">GitHub</span>
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                            aria-label={
                                isMobileMenuOpen
                                    ? "Close mobile menu"
                                    : "Open mobile menu"
                            }
                            aria-expanded={isMobileMenuOpen}
                        >
                            {isMobileMenuOpen ? (
                                <Close className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            ) : (
                                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link
                                href="/"
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Home className="h-4 w-4" />
                                <span className="font-medium">Home</span>
                            </Link>

                            <Link
                                href="/"
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Search className="h-4 w-4" />
                                <span className="font-medium">Search</span>
                            </Link>

                            <Link
                                href="/favorites"
                                className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 relative"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                <Favorite className="h-4 w-4" />
                                <span className="font-medium">Favorites</span>
                                {getFavoritesCount() > 0 && (
                                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] text-[10px] font-bold ml-auto">
                                        {getFavoritesCount() > 99
                                            ? "99+"
                                            : getFavoritesCount()}
                                    </span>
                                )}
                            </Link>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                                <Link
                                    href="https://github.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <GitHub className="h-4 w-4" />
                                    <span className="font-medium">
                                        Visit GitHub
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
