"use client";
import { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import { Input, CircularProgress } from "@mui/material";
import { Close, Error, Person, Warning, Search } from "@mui/icons-material";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import UserCard from "@/components/userCard";
import RepositoryDashboard from "@/components/Repo/RepositoryDashboard";
import FavoritesWidget from "@/components/Favorites/FavoritesWidget";
import RecentUsers from "@/components/RecentUsers";
import {
    SkipLink,
    FocusIndicator,
    ScrollToTop,
    KeyboardShortcuts,
} from "@/utils/Accessibility/AccessibilityHelpers";
import { useAccessibility } from "@/utils/Accessibility/AccessibilityProvider";
import { useUserStorage } from "@/contexts/UserStorageContext";

export default function Home() {
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const { announce, settings } = useAccessibility();

    // User storage context
    const {
        getCachedUser,
        storeUser,
        isUserCacheValid,
        addSearchHistory,
        updateUserAccess,
        getRecentUsers,
    } = useUserStorage();

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [query]);

    const fetchUser = async (username = query) => {
        if (!username.trim()) return;

        const trimmedUsername = username.trim();
        setLoading(true);
        setError(null);
        announce(`Searching for user ${trimmedUsername}`, "polite");

        try {
            // Check if user is cached and valid
            const cachedUser = getCachedUser(trimmedUsername);
            const isCacheValid = isUserCacheValid(trimmedUsername, 24); // 24 hours cache

            if (cachedUser && isCacheValid) {
                // Use cached data
                setUser(cachedUser);
                updateUserAccess(trimmedUsername);
                toast.success(`User ${cachedUser.login} fetched!`, {
                    icon: "⚡",
                });
                announce(
                    `Found user ${cachedUser.login}. ${cachedUser.public_repos} repositories available.`,
                    "polite"
                );
                addSearchHistory(trimmedUsername, true);
                return;
            }

            // Fetch from API
            const { data } = await Axios.get(
                `https://api.github.com/users/${trimmedUsername}`
            );

            // Store in cache
            storeUser(data);
            setUser(data);
            addSearchHistory(trimmedUsername, true);

            toast.success(`User ${data.login} fetched successfully!`);
            announce(
                `Found user ${data.login}. ${data.public_repos} repositories available.`,
                "polite"
            );
        } catch (error) {
            console.error("Error fetching user:", error);

            let errorMessage = "Failed to fetch user. Please try again.";
            if (error.response?.status === 404) {
                errorMessage = "User not found. Please check the username.";
                addSearchHistory(trimmedUsername, false);
            } else if (error.response?.status === 403) {
                errorMessage =
                    "API rate limit exceeded. Please try again later.";
            } else if (!navigator.onLine) {
                errorMessage =
                    "No internet connection. Please check your network.";
            }

            setError(errorMessage);
            setUser(null);
            toast.error(errorMessage);
            announce(`Error: ${errorMessage}`, "assertive");
        } finally {
            setLoading(false);
        }
    };

    const onKeyDownhandler = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            e.preventDefault();
            fetchUser(query);
        }
    };

    const handleManualSearch = () => {
        fetchUser(query);
    };

    const clearSearch = () => {
        setQuery("");
        setUser(null);
        setError(null);
    };

    // Handle user selection from recent users
    const handleUserSelect = (username) => {
        setQuery(username);
        fetchUser(username);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Skip Links */}
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <SkipLink href="#search-input">Skip to search</SkipLink>

            {/* Focus and Accessibility Indicators */}
            <FocusIndicator />
            <KeyboardShortcuts />

            <Navbar />
            <main id="main-content" tabIndex="-1" className="outline-none">
                <div className="container mx-auto px-4 py-6 max-w-7xl">
                    {/* Header Section */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Repository Explorer
                        </h1>
                        <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Discover and explore GitHub repositories from any
                            user. Start typing a username for instant search.
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 mb-8 max-w-2xl mx-auto border dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1 relative">
                                <label
                                    htmlFor="search-input"
                                    className="sr-only"
                                >
                                    Search for GitHub username
                                </label>
                                <Input
                                    id="search-input"
                                    type="text"
                                    placeholder="Enter GitHub username (e.g., abhinav0115)"
                                    value={query}
                                    onChange={(e) =>
                                        setQuery(
                                            e.target.value.replace(/\s/g, "")
                                        )
                                    }
                                    onKeyDown={onKeyDownhandler}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            "& fieldset": {
                                                border: "none",
                                            },
                                        },
                                        "& .MuiInputBase-input": {
                                            color: "inherit",
                                            "&::placeholder": {
                                                color: "inherit",
                                                opacity: 0.7,
                                            },
                                        },
                                    }}
                                    disabled={loading}
                                    aria-describedby={
                                        query.length > 0 && query.length <= 2
                                            ? "search-hint"
                                            : undefined
                                    }
                                    aria-label="GitHub username search input"
                                />

                                {/* Loading indicator in input */}
                                {loading && (
                                    <div
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                        aria-label="Searching..."
                                        role="status"
                                    >
                                        <CircularProgress size={20} />
                                    </div>
                                )}

                                {/* Clear button */}
                                {query && !loading && (
                                    <button
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <Close className="w-5 h-5" />
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={handleManualSearch}
                                disabled={!query.trim() || loading}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center min-w-[140px] mt-4 md:mt-0"
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress
                                            size={16}
                                            color="inherit"
                                            className="mr-2"
                                        />
                                        Searching...
                                    </>
                                ) : (
                                    "Search User"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {error && (
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Error className="h-5 w-5 text-red-400 dark:text-red-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                            Search Error
                                        </h3>
                                        <div className="mt-1 text-sm text-red-700 dark:text-red-300">
                                            {error}
                                        </div>
                                    </div>
                                    <div className="ml-auto">
                                        <button
                                            onClick={() => setError(null)}
                                            className="inline-flex text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-300 transition-colors"
                                        >
                                            <Close className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading && !user && (
                        <div className="flex justify-center items-center py-16">
                            <div className="text-center">
                                <CircularProgress size={40} className="mb-4" />
                                <p className="text-gray-600 dark:text-gray-300 text-lg">
                                    Searching for user...
                                </p>
                            </div>
                        </div>
                    )}

                    {user && !loading && (
                        <div className="space-y-4">
                            <UserCard user={user} />
                            <RepositoryDashboard 
                                repos_url={user.repos_url}
                                userName={user.login}
                            />
                        </div>
                    )}

                    {!user && !loading && !error && query.length === 0 && (
                        <div className="space-y-8">
                            {/* Recent Users Component */}
                            <RecentUsers onUserSelect={handleUserSelect} />

                            {/* Favorites Widget */}
                            <FavoritesWidget />

                            {/* Welcome Message */}
                            <div className="text-center py-8">
                                <div className="max-w-md mx-auto">
                                    <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <Person className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">
                                        Ready to explore?
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Start typing a GitHub username above to
                                        discover their repositories.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {!user &&
                        !loading &&
                        !error &&
                        query.length > 0 &&
                        query.length <= 2 && (
                            <div className="text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                        <Warning className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                                        Keep typing...
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Enter at least 3 characters to start
                                        searching automatically.
                                    </p>
                                </div>
                            </div>
                        )}
                    {!user &&
                        !loading &&
                        !error &&
                        query.length > 0 &&
                        query.length > 2 && (
                            <div className="text-center py-8 pb-5">
                                <div className="max-w-md mx-auto">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h3 className="text-lg text-gray-700 dark:text-gray-200 mb-2">
                                        Searching for{" "}
                                        <span className="font-semibold underline">
                                            {query}
                                        </span>
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Press Enter or click the search button
                                        to find repositories.
                                    </p>
                                </div>
                            </div>
                        )}
                </div>
            </main>

            {/* Accessibility Helpers */}
            <ScrollToTop />

            <Footer />
        </div>
    );
}
