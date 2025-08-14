"use client";
import Link from "next/link";
import {
    GitHub,
    LinkedIn,
    Email,
    KeyboardArrowUp,
    Code,
    Favorite,
    Home,
    Search,
} from "@mui/icons-material";
import { FaReact } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiVercel, SiMui } from "react-icons/si";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg">
                                <GitHub className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    GitHub Explorer
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Discover Repositories
                                </p>
                            </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                            A modern, responsive web application for exploring
                            GitHub repositories and user profiles. Built with
                            Next.js and powered by the GitHub API.
                        </p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <span>Made with</span>
                            <Favorite className="h-4 w-4 text-red-500 mx-1" />
                            <span>by</span>
                            <Link
                                href="https://github.com/Abhinav0115"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium ml-1"
                            >
                                Abhinav (@Abhinav0115)
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                >
                                    <Home className="h-4 w-4 mr-1" />
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                >
                                    <Search className="h-4 w-4 mr-1" />
                                    Search Users
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/favorites"
                                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm"
                                >
                                    <Favorite className="h-4 w-4 mr-1" />
                                    Favorites
                                </Link>
                            </li>
                            
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                            Connect
                        </h4>
                        <div className="space-y-3">
                            <Link
                                href="https://github.com/Abhinav0115"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <GitHub className="h-5 w-5 mr-2" />
                                <span className="text-sm">GitHub</span>
                            </Link>
                            <Link
                                href="https://linkedin.com/in/abhinav0115"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <LinkedIn className="h-5 w-5 mr-2" />
                                <span className="text-sm">LinkedIn</span>
                            </Link>
                            <Link
                                href="mailto:abhinav011501@gmail.com"
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                            >
                                <Email className="h-5 w-5 mr-2" />
                                <span className="text-sm">Email</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-6">
                    <button
                        onClick={scrollToTop}
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 text-sm flex items-center"
                    >
                        <KeyboardArrowUp className="h-4 w-4 mr-1" />
                        Back to Top
                    </button>
                </div>
                {/* Tech Stack */}
                <div className="mt-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="mb-4 sm:mb-0">
                            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Built with:
                            </h5>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                                    <FaReact className="h-4 w-4 text-blue-500" />
                                    <span className="text-xs">React</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                                    <SiNextdotjs className="h-4 w-4 text-black dark:text-white" />
                                    <span className="text-xs">Next.js</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                                    <SiTailwindcss className="h-4 w-4 text-cyan-500" />
                                    <span className="text-xs">Tailwind</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                                    <SiMui className="h-4 w-4 text-cyan-500" />
                                    <span className="text-xs">Material UI</span>
                                </div>
                                <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                                    <Code className="h-4 w-4 text-gray-500" />
                                    <span className="text-xs">GitHub API</span>
                                </div>
                            </div>
                        </div>

                        {/* Copyright */}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <p>
                                © {currentYear} GitHub Explorer. All rights
                                reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </footer>
    );
};

export default Footer;
