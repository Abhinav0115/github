"use client";
import { useState, useMemo } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import FavoriteButton from "./FavoriteButton";
import {
    Favorite,
    Search,
    Language,
    Clear,
    Star,
    ForkRight,
    Code,
    Launch,
    GitHub,
    Home,
    FilterList,
} from "@mui/icons-material";
import {
    FaStar,
    FaGithub,
    FaExternalLinkAlt,
    FaCalendarAlt,
} from "react-icons/fa";
import { BiGitRepoForked } from "react-icons/bi";
import { MdUpdate } from "react-icons/md";
import Link from "next/link";
import { toast } from "react-toastify";
import Image from "next/image";

const FavoritesPage = () => {
    const { favorites, isLoading, clearFavorites, getFavoritesByLanguage } =
        useFavorites();

    // Filter and sort states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("added_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedLanguage, setSelectedLanguage] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Get unique languages from favorites
    const availableLanguages = useMemo(() => {
        const languages = favorites
            .map((repo) => repo.language)
            .filter((lang) => lang !== null && lang !== undefined)
            .filter((lang, index, arr) => arr.indexOf(lang) === index)
            .sort();
        return languages;
    }, [favorites]);

    // Filter and sort favorites
    const filteredAndSortedFavorites = useMemo(() => {
        let filtered = favorites;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (repo) =>
                    repo.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    repo.full_name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (repo.description &&
                        repo.description
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        // Apply language filter
        if (selectedLanguage) {
            filtered = filtered.filter(
                (repo) => repo.language === selectedLanguage
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle different data types
            if (sortBy === "name" || sortBy === "full_name") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            } else if (
                sortBy === "added_at" ||
                sortBy === "created_at" ||
                sortBy === "updated_at"
            ) {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (
                typeof aValue === "number" &&
                typeof bValue === "number"
            ) {
                // Handle numeric values (stars, forks)
            } else {
                aValue = String(aValue || "");
                bValue = String(bValue || "");
            }

            if (sortOrder === "asc") {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [favorites, searchTerm, selectedLanguage, sortBy, sortOrder]);

    // Helper functions
    const getTimeAgo = (date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;
        if (diffInSeconds < 31536000)
            return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
        return `${Math.floor(diffInSeconds / 31536000)}y ago`;
    };

    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    const handleClearFavorites = () => {
        if (
            window.confirm(
                "Are you sure you want to remove all favorites? This action cannot be undone."
            )
        ) {
            const success = clearFavorites();
            if (success) {
                toast.success("All favorites cleared successfully");
            } else {
                toast.error("Failed to clear favorites");
            }
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 dark:border-red-400"></div>
                        <span className="ml-4 text-gray-600 dark:text-gray-300 text-lg">
                            Loading favorites...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                                <Favorite className="w-8 h-8 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                    My Favorites
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {favorites.length}{" "}
                                    {favorites.length === 1
                                        ? "repository"
                                        : "repositories"}{" "}
                                    saved
                                </p>
                            </div>
                        </div>

                        {favorites.length > 0 && (
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleClearFavorites}
                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                                >
                                    <Clear className="w-3 h-3" />
                                    <span>Clear All</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    {favorites.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                            Total
                                        </p>
                                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                            {favorites.length}
                                        </p>
                                    </div>
                                    <GitHub className="w-6 h-6 text-blue-500" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                            Languages
                                        </p>
                                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                            {availableLanguages.length}
                                        </p>
                                    </div>
                                    <Language className="w-6 h-6 text-purple-500" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                                            Total Stars
                                        </p>
                                        <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                                            {formatCount(
                                                favorites.reduce(
                                                    (sum, repo) =>
                                                        sum +
                                                        repo.stargazers_count,
                                                    0
                                                )
                                            )}
                                        </p>
                                    </div>
                                    <Star className="w-6 h-6 text-yellow-500" />
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                            Total Forks
                                        </p>
                                        <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                            {formatCount(
                                                favorites.reduce(
                                                    (sum, repo) =>
                                                        sum + repo.forks_count,
                                                    0
                                                )
                                            )}
                                        </p>
                                    </div>
                                    <ForkRight className="w-6 h-6 text-green-500" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* No Favorites State */}
                {favorites.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border dark:border-gray-700">
                        <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <Favorite className="w-12 h-12 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                            No Favorites Yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                            Start exploring repositories and add them to your
                            favorites by clicking the heart icon.
                        </p>
                        <Link
                            href="/"
                            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
                        >
                            <Home className="w-4 h-4" />
                            <span>Explore Repositories</span>
                        </Link>
                    </div>
                )}

                {/* Filters and Search */}
                {favorites.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Filter & Search
                            </h3>
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-2 rounded-lg flex items-center space-x-2"
                            >
                                <FilterList className="w-4 h-4" />
                                <span>Filters</span>
                            </button>
                        </div>

                        <div
                            className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${
                                showFilters ? "block" : "hidden md:grid"
                            }`}
                        >
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search favorites..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            {/* Language Filter */}
                            <select
                                value={selectedLanguage}
                                onChange={(e) =>
                                    setSelectedLanguage(e.target.value)
                                }
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Languages</option>
                                {availableLanguages.map((language) => (
                                    <option key={language} value={language}>
                                        {language}
                                    </option>
                                ))}
                            </select>

                            {/* Sort By */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="added_at">Date Added</option>
                                <option value="name">Name</option>
                                <option value="stargazers_count">Stars</option>
                                <option value="forks_count">Forks</option>
                                <option value="updated_at">Last Updated</option>
                                <option value="created_at">Created Date</option>
                            </select>

                            {/* Sort Order */}
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="desc">Descending</option>
                                <option value="asc">Ascending</option>
                            </select>
                        </div>

                        {filteredAndSortedFavorites.length !==
                            favorites.length && (
                            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                                Showing {filteredAndSortedFavorites.length} of{" "}
                                {favorites.length} favorites
                            </div>
                        )}
                    </div>
                )}

                {/* Favorites Grid */}
                {filteredAndSortedFavorites.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAndSortedFavorites.map((repo) => (
                            <div
                                key={repo.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-red-300 dark:hover:border-red-600 dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden group"
                            >
                                {/* Header Section */}
                                <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-2">
                                                <Link
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={repo.html_url}
                                                    className="text-xl font-bold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200 group-hover:text-red-700 dark:group-hover:text-red-300 truncate"
                                                >
                                                    {repo.name}
                                                </Link>
                                                <FavoriteButton
                                                    repo={repo}
                                                    size="medium"
                                                    showText={false}
                                                />
                                            </div>

                                            {/* Owner Info */}
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <Image
                                                    src={repo.owner.avatar_url}
                                                    alt={repo.owner.login}
                                                    width={24}
                                                    height={24}
                                                    className="w-6 h-6 rounded-full mr-2 border-2 border-white dark:border-gray-600 shadow-sm"
                                                />
                                                <span className="font-medium">
                                                    {repo.owner.login}
                                                </span>
                                                <span className="mx-2">•</span>
                                                <span>
                                                    Added{" "}
                                                    {getTimeAgo(repo.added_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
                                            <FaStar className="text-yellow-500 dark:text-yellow-400 mr-2 text-sm" />
                                            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                                {formatCount(
                                                    repo.stargazers_count
                                                )}
                                            </span>
                                        </div>

                                        {repo.forks_count > 0 && (
                                            <div className="flex items-center bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800 shadow-sm">
                                                <BiGitRepoForked className="text-green-600 dark:text-green-400 mr-2 text-sm" />
                                                <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                    {formatCount(
                                                        repo.forks_count
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                        {repo.description || (
                                            <span className="italic text-gray-500 dark:text-gray-400">
                                                No description available
                                            </span>
                                        )}
                                    </p>

                                    {/* Language and Topics */}
                                    <div className="space-y-3">
                                        {repo.language && (
                                            <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800 shadow-sm">
                                                <Code className="mr-2 w-3 h-3" />
                                                {repo.language}
                                            </span>
                                        )}

                                        {repo.topics &&
                                            repo.topics.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {repo.topics
                                                        .slice(0, 4)
                                                        .map((topic, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800"
                                                            >
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    {repo.topics.length > 4 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                                            +
                                                            {repo.topics
                                                                .length - 4}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-4 space-y-4">
                                    {/* Repository Insights */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                                            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mb-1">
                                                <FaCalendarAlt className="mr-1" />
                                                Created
                                            </div>
                                            <div className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                                {new Date(
                                                    repo.created_at
                                                ).toLocaleDateString()}
                                            </div>
                                        </div>

                                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                                            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mb-1">
                                                <MdUpdate className="mr-1" />
                                                Updated
                                            </div>
                                            <div className="text-sm font-semibold text-green-700 dark:text-green-300">
                                                {getTimeAgo(repo.updated_at)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Homepage Link */}
                                    {repo.homepage && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center mb-1">
                                                        <Launch className="text-blue-600 dark:text-blue-400 mr-2 text-sm" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                            Live Demo
                                                        </span>
                                                    </div>
                                                    <Link
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={repo.homepage}
                                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm break-all transition-colors duration-200"
                                                    >
                                                        {repo.homepage}
                                                    </Link>
                                                </div>
                                                <Link
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={repo.homepage}
                                                    className="ml-3 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
                                                >
                                                    <FaExternalLinkAlt className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="px-6 pb-6">
                                    <div className="flex items-center justify-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={repo.html_url}
                                            className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 text-white text-sm font-medium py-2.5 px-6 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105 shadow-md"
                                        >
                                            <FaGithub className="mr-2" />
                                            View Repository
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Search Results */}
                {favorites.length > 0 &&
                    filteredAndSortedFavorites.length === 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border dark:border-gray-700">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-2">
                                No Results Found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                Try adjusting your search or filter criteria.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedLanguage("");
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default FavoritesPage;
