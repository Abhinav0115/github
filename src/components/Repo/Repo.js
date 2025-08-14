/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */

"use client";
import { useEffect, useState, useMemo } from "react";
import Axios from "axios";
import {
    FaStar,
    FaGithub,
    FaCode,
    FaExternalLinkAlt,
    FaCopy,
    FaCalendarAlt,
} from "react-icons/fa";
import { BiGitRepoForked } from "react-icons/bi";
import { MdUpdate } from "react-icons/md";
import Link from "next/link";
import RepoFilters from "@/components/Repo/RepoFilters";
import RepositoryCloneHelper from "@/components/Repo/CloneDownloadButton";
import FavoriteButton from "@/components/Favorites/FavoriteButton";
import Image from "next/image";

const Repo = ({ repos_url, onRepositoriesData }) => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedRepo, setCopiedRepo] = useState(null);

    // Filter and sort states
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("updated_at");
    const [sortOrder, setSortOrder] = useState("desc");
    const [language, setLanguage] = useState("");
    const [visibleCount, setVisibleCount] = useState(9);

    // Helper functions for enhanced display
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

    // Copy to clipboard functionality
    const copyToClipboard = async (text, repoId) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedRepo(repoId);
            setTimeout(() => setCopiedRepo(null), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    // Load more repositories
    const loadMoreRepos = () => {
        setVisibleCount((prev) => prev + 9);
    };

    const fetchRepos_2 = async () => {
        if (!repos_url) return;

        setLoading(true);
        setError(null);
        try {
            const { data } = await Axios.get(repos_url);
            setRepos(data);
            // Call the callback to pass repositories data to parent component
            if (onRepositoriesData) {
                onRepositoriesData(data);
            }
        } catch (err) {
            setError("Failed to fetch repositories");
            console.error("Error fetching repos:", err);
        } finally {
            setLoading(false);
        }
    };

    // Get unique languages from repositories
    const availableLanguages = useMemo(() => {
        const languages = repos
            .map((repo) => repo.language)
            .filter((lang) => lang !== null && lang !== undefined)
            .filter((lang, index, arr) => arr.indexOf(lang) === index)
            .sort();
        return languages;
    }, [repos]);

    // Filter and sort repositories
    const filteredAndSortedRepos = useMemo(() => {
        let filtered = repos;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(
                (repo) =>
                    repo.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    (repo.description &&
                        repo.description
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()))
            );
        }

        // Apply language filter
        if (language) {
            filtered = filtered.filter((repo) => repo.language === language);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            // Handle different data types
            if (sortBy === "name") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            } else if (sortBy === "updated_at" || sortBy === "created_at") {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else if (
                typeof aValue === "number" &&
                typeof bValue === "number"
            ) {
                // Handle numeric values (stars, forks, size)
            } else {
                // Convert to string for comparison
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
    }, [repos, searchTerm, language, sortBy, sortOrder]);

    useEffect(() => {
        fetchRepos_2();
    }, [repos_url]);

    // Reset visible count when filters change
    useEffect(() => {
        setVisibleCount(9);
    }, [searchTerm, language, sortBy, sortOrder]);

    return (
        <>
            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
                    <span className="ml-4 text-gray-600 dark:text-gray-300 text-lg">
                        Loading repositories...
                    </span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <FaGithub className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
                            Error Loading Repositories
                        </h3>
                        <p className="text-red-600 dark:text-red-300">
                            {error}
                        </p>
                        <button
                            onClick={fetchRepos_2}
                            className="mt-4 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Repository Grid */}
            {!loading && !error && repos.length > 0 && (
                <div className="space-y-6">
                    {/* Filters */}
                    <RepoFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        language={language}
                        setLanguage={setLanguage}
                        availableLanguages={availableLanguages}
                        totalRepos={repos.length}
                        filteredCount={filteredAndSortedRepos.length}
                    />

                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
                            <FaGithub className="mr-3 text-gray-700 dark:text-gray-300" />
                            Repositories ({filteredAndSortedRepos.length})
                        </h2>
                        {filteredAndSortedRepos.length > visibleCount && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Showing{" "}
                                {Math.min(
                                    visibleCount,
                                    filteredAndSortedRepos.length
                                )}{" "}
                                of {filteredAndSortedRepos.length}
                            </div>
                        )}
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredAndSortedRepos
                            .slice(0, visibleCount)
                            .map((repo) => (
                                <div
                                    key={repo.id}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-600 dark:hover:shadow-gray-900/50 transition-all duration-300 overflow-hidden group"
                                >
                                    {/* Enhanced Header Section */}
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-750">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-2">
                                                    <Link
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={repo.html_url}
                                                        className="text-xl font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 group-hover:text-blue-700 dark:group-hover:text-blue-300 truncate"
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
                                                        src={
                                                            repo.owner
                                                                .avatar_url
                                                        }
                                                        alt={repo.owner.login}
                                                        width={24}
                                                        height={24}
                                                        className="w-6 h-6 rounded-full mr-2 border-2 border-white dark:border-gray-600 shadow-sm"
                                                    />
                                                    <span className="font-medium">
                                                        {repo.owner.login}
                                                    </span>
                                                    <span className="mx-2">
                                                        •
                                                    </span>
                                                    <span>
                                                        {getTimeAgo(
                                                            repo.updated_at
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Stats Row */}
                                        <div className="flex items-center space-x-3 mb-4">
                                            {/* Stars */}
                                            <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 px-3 py-2 rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm">
                                                <FaStar className="text-yellow-500 dark:text-yellow-400 mr-2 text-sm" />
                                                <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
                                                    {formatCount(
                                                        repo.stargazers_count
                                                    )}
                                                </span>
                                            </div>

                                            {/* Forks */}
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

                                        {/* Enhanced Description */}
                                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {repo.description || (
                                                <span className="italic text-gray-500 dark:text-gray-400">
                                                    No description available
                                                </span>
                                            )}
                                        </p>

                                        {/* Language Badge */}
                                        <div className="flex items-center justify-between mb-4">
                                            {repo.language && (
                                                <span className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800 shadow-sm">
                                                    <FaCode className="mr-2" />
                                                    {repo.language}
                                                </span>
                                            )}

                                            {/* Repository Size */}
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                {repo.size > 0 && (
                                                    <span>
                                                        {(
                                                            repo.size / 1024
                                                        ).toFixed(1)}{" "}
                                                        MB
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Enhanced Topics */}
                                        {repo.topics &&
                                            repo.topics.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {repo.topics
                                                        .slice(0, 6)
                                                        .map((topic, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors duration-200 cursor-pointer shadow-sm"
                                                            >
                                                                {topic}
                                                            </span>
                                                        ))}
                                                    {repo.topics.length > 6 && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                                                            +
                                                            {repo.topics
                                                                .length - 6}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {/* Enhanced Content Section */}
                                    <div className="p-4 space-y-4">
                                        {/* Repository Insights Grid */}
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
                                                    {getTimeAgo(
                                                        repo.updated_at
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Enhanced Homepage Link */}
                                        {repo.homepage && (
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4  rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center ">
                                                            <FaExternalLinkAlt className="text-blue-600 dark:text-blue-400 mr-2 text-sm" />
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

                                        {/* Repository Details */}
                                        {/* <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                                            <div className="text-purple-600 dark:text-purple-400">
                                                Branch
                                            </div>
                                            <div className="font-semibold text-purple-700 dark:text-purple-300">
                                                {repo.default_branch || "main"}
                                            </div>
                                        </div>
                                        <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                                            <div className="text-orange-600 dark:text-orange-400">
                                                License
                                            </div>
                                            <div className="font-semibold text-orange-700 dark:text-orange-300">
                                                {repo.license?.spdx_id ||
                                                    "None"}
                                            </div>
                                        </div>
                                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                                            <div className="text-gray-600 dark:text-gray-400">
                                                Visibility
                                            </div>
                                            <div className="font-semibold text-gray-700 dark:text-gray-300">
                                                {repo.visibility || "Public"}
                                            </div>
                                        </div>
                                    </div> */}
                                    </div>

                                    {/* Enhanced Footer */}
                                    <div className="px-6 pb-6">
                                        <div className="flex items-center justify-center pt-4 border-t border-gray-100 dark:border-gray-700">
                                            {/* Enhanced Action Buttons */}
                                            <div className="flex items-center space-x-3">
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={repo.html_url}
                                                    className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white text-sm font-medium py-2.5 px-4 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105 shadow-md text-nowrap"
                                                >
                                                    <FaGithub className="mr-2" />
                                                    View Code
                                                </a>

                                                <RepositoryCloneHelper
                                                    repo={repo}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>

                    {/* View More Button */}
                    {filteredAndSortedRepos.length > visibleCount && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={loadMoreRepos}
                                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md flex items-center space-x-2"
                            >
                                <span>View More Repositories</span>
                                <span className="bg-blue-500 dark:bg-blue-400 text-white text-xs px-2 py-1 rounded-full">
                                    +
                                    {Math.min(
                                        9,
                                        filteredAndSortedRepos.length -
                                            visibleCount
                                    )}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* No Repositories State */}
            {!loading && !error && repos.length === 0 && (
                <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <FaGithub className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 dark:text-gray-200 mb-3">
                            No repositories found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            This user hasn't created any public repositories
                            yet.
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Repo;
