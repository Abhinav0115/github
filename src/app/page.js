"use client";
import { useState, useEffect, useCallback } from "react";
import Axios from "axios";
import { toast } from "react-toastify";
import {Input, CircularProgress } from "@mui/material";
import UserCard from "@/components/userCard";
import Repo from "@/components/Repo";

export default function Home() {
    const [user, setUser] = useState(null);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [debouncedQuery, setDebouncedQuery] = useState("");

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [query]);

    // Auto-search when debounced query changes
    useEffect(() => {
        if (debouncedQuery.trim() && debouncedQuery.length > 2) {
            fetchUser(debouncedQuery);
        } else if (debouncedQuery.trim() === "") {
            setUser(null);
            setError(null);
        }
    }, [debouncedQuery]);

    const fetchUser = async (username = query) => {
        if (!username.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const { data } = await Axios.get(
                `https://api.github.com/users/${username.trim()}`
            );
            setUser(data);
            toast.success(`User ${data.login} fetched successfully!`);
        } catch (error) {
            console.error("Error fetching user:", error);

            let errorMessage = "Failed to fetch user. Please try again.";
            if (error.response?.status === 404) {
                errorMessage = "User not found. Please check the username.";
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

    console.log("user", user);
    console.log("query", query);
    //container, row, col, input, button

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                        GitHub Repository Explorer
                    </h1>
                    <p className="text-base text-gray-600 max-w-2xl mx-auto">
                        Discover and explore GitHub repositories from any user.
                        Start typing a username for instant search.
                    </p>
                </div>

                {/* Search Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Input
                                type="text"
                                placeholder="Enter GitHub username (e.g., octocat)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={onKeyDownhandler}
                                className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            border: "none",
                                        },
                                    },
                                }}
                                disabled={loading}
                            />

                            {/* Loading indicator in input */}
                            {loading && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <CircularProgress size={20} />
                                </div>
                            )}

                            {/* Clear button */}
                            {query && !loading && (
                                <button
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            )}

                            {/* Search hint */}
                            {query.length > 0 &&
                                query.length <= 2 &&
                                !loading && (
                                    <div className="absolute top-full left-0 mt-1 text-xs text-gray-500">
                                        Type at least 3 characters for
                                        auto-search
                                    </div>
                                )}
                        </div>

                        <button
                            onClick={handleManualSearch}
                            disabled={!query.trim() || loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center min-w-[140px]"
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

                    {/* Search status */}
                    {debouncedQuery !== query && query.length > 2 && (
                        <div className="mt-3 text-sm text-blue-600 flex items-center">
                            <CircularProgress size={14} className="mr-2" />
                            Searching as you type...
                        </div>
                    )}
                </div>

                {/* Results Section */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-red-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        Search Error
                                    </h3>
                                    <div className="mt-1 text-sm text-red-700">
                                        {error}
                                    </div>
                                </div>
                                <div className="ml-auto">
                                    <button
                                        onClick={() => setError(null)}
                                        className="inline-flex text-red-400 hover:text-red-600 transition-colors"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
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
                            <p className="text-gray-600 text-lg">
                                Searching for user...
                            </p>
                        </div>
                    </div>
                )}

                {user && !loading && (
                    <div className="space-y-8">
                        <UserCard user={user} />
                        <Repo repos_url={user.repos_url} />
                    </div>
                )}

                {!user && !loading && !error && query.length === 0 && (
                    <div className="text-center py-16">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-10 h-10 text-blue-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 mb-3">
                                Ready to explore?
                            </h3>
                            <p className="text-gray-500">
                                Start typing a GitHub username above to discover
                                their repositories. Search happens automatically
                                as you type!
                            </p>
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
                                <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-yellow-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    Keep typing...
                                </h3>
                                <p className="text-gray-500">
                                    Enter at least 3 characters to start
                                    searching automatically.
                                </p>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}
