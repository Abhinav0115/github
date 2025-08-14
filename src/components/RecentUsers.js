"use client";
import { useState, useEffect } from "react";
import { useUserStorage } from "@/contexts/UserStorageContext";
import {
    Person,
    History,
    AccessTime,
    Search,
    TrendingUp,
    Storage,
    CloudOff,
    DeleteOutline,
} from "@mui/icons-material";
import { FaGithub } from "react-icons/fa";
import Image from "next/image";

const RecentUsers = ({ onUserSelect }) => {
    const {
        getRecentUsers,
        searchHistory,
        storageStats,
        getCachedUser,
        isUserCacheValid,
        isReposCacheValid,
        getCachedRepos,
        removeUser,
        removeFromSearchHistory,
    } = useUserStorage();

    const [recentUsers, setRecentUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("recent");

    useEffect(() => {
        setRecentUsers(getRecentUsers(8));
    }, [getRecentUsers]);

    const handleUserClick = (username) => {
        if (onUserSelect) {
            onUserSelect(username);
        }
    };

    const handleDeleteUser = (username, event) => {
        event.stopPropagation(); // Prevent triggering user selection
        if (window.confirm(`Remove ${username} from search history?`)) {
            removeUser(username);
            setRecentUsers(getRecentUsers(8));
        }
    };

    const handleDeleteFromHistory = (username, event) => {
        event.stopPropagation(); // Prevent triggering user selection
        if (window.confirm(`Remove ${username} from search history?`)) {
            removeFromSearchHistory(username);
        }
    };

    const formatTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600)
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400)
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 2592000)
            return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    };

    const getCacheStatusIcon = (username) => {
        const userValid = isUserCacheValid(username);
        const reposValid = isReposCacheValid(username);
        const hasRepos = getCachedRepos(username).length > 0;

        if (userValid && (reposValid || hasRepos)) {
            return (
                <Storage
                    className="w-4 h-4 text-green-600 dark:text-green-400"
                    title="Fully cached"
                />
            );
        } else if (userValid) {
            return (
                <CloudOff
                    className="w-4 h-4 ml-2 text-yellow-600 dark:text-yellow-400"
                    title="User cached, repos may be stale"
                />
            );
        } else {
            return (
                <CloudOff
                    className="w-4 h-4 text-red-600 dark:text-red-400"
                    title="Cache expired"
                />
            );
        }
    };

    if (recentUsers.length === 0 && searchHistory.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with Tabs */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 p-4 py-2.5 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-1.5">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                        <History className="mr-2 text-blue-600 dark:text-blue-400" />
                        User History
                    </h3>
                    {storageStats && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                            <div>{storageStats.users.count} users cached</div>
                            <div>{storageStats.total.sizeInKB} KB used</div>
                        </div>
                    )}
                </div>

                {/* Tab Navigation */}
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveTab("recent")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === "recent"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600"
                        }`}
                    >
                        <Person className="w-4 h-4 mr-1 inline" />
                        Recent Users ({recentUsers.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === "history"
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-600"
                        }`}
                    >
                        <Search className="w-4 h-4 mr-1 inline" />
                        Search History ({searchHistory.length})
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className=" p-2.5">
                {activeTab === "recent" && (
                    <div>
                        {recentUsers.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {recentUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 group"
                                    >
                                        <div
                                            onClick={() =>
                                                handleUserClick(user.login)
                                            }
                                            className="flex items-center flex-1 min-w-0 cursor-pointer"
                                        >
                                            <Image
                                                src={user.avatar_url}
                                                alt={user.login}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-500 shadow-sm"
                                            />
                                            <div className="ml-3 flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold text-gray-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                                                        {user.login}
                                                    </h4>
                                                    <div className="flex items-center space-x-2">
                                                        {getCacheStatusIcon(
                                                            user.login
                                                        )}
                                                        <button
                                                            onClick={(e) =>
                                                                handleDeleteUser(
                                                                    user.login,
                                                                    e
                                                                )
                                                            }
                                                            className="p-1 rounded-lg text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                                            title={`Remove ${user.login}`}
                                                            aria-label={`Remove ${user.login}`}
                                                        >
                                                            <DeleteOutline className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    <AccessTime className="w-3 h-3 mr-1" />
                                                    {formatTimeAgo(
                                                        user.last_accessed
                                                    )}
                                                    {user.public_repos !==
                                                        undefined && (
                                                        <>
                                                            <span className="mx-2">
                                                                •
                                                            </span>
                                                            <FaGithub className="w-3 h-3 mr-1" />
                                                            {user.public_repos}{" "}
                                                            repos
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Person className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No recent users
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Search for users to see them here
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "history" && (
                    <div>
                        {searchHistory.length > 0 ? (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {searchHistory
                                    .slice(0, 20)
                                    .map((search, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                                                search.found
                                                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                                            }`}
                                        >
                                            <div
                                                onClick={() =>
                                                    search.found &&
                                                    handleUserClick(
                                                        search.username
                                                    )
                                                }
                                                className={`flex items-center flex-1 min-w-0 ${
                                                    search.found
                                                        ? "cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg p-1 -m-1"
                                                        : ""
                                                }`}
                                            >
                                                <div
                                                    className={`w-2 h-2 rounded-full mr-3 ${
                                                        search.found
                                                            ? "bg-green-500 dark:bg-green-400"
                                                            : "bg-red-500 dark:bg-red-400"
                                                    }`}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center">
                                                        <span
                                                            className={`text-sm font-medium truncate ${
                                                                search.found
                                                                    ? "text-green-700 dark:text-green-300"
                                                                    : "text-red-700 dark:text-red-300"
                                                            }`}
                                                        >
                                                            {search.username}
                                                        </span>
                                                        {search.found &&
                                                            getCacheStatusIcon(
                                                                search.username
                                                            )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatTimeAgo(
                                                            search.searched_at
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <div className="text-xs text-gray-400 dark:text-gray-500">
                                                    {search.found
                                                        ? "Found"
                                                        : "Not found"}
                                                </div>
                                                <button
                                                    onClick={(e) =>
                                                        handleDeleteFromHistory(
                                                            search.username,
                                                            e
                                                        )
                                                    }
                                                    className="p-1 rounded text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                                    title={`Remove ${search.username} from search history`}
                                                    aria-label={`Remove ${search.username} from search history`}
                                                >
                                                    <DeleteOutline className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Search className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No search history
                                </p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Your searches will appear here
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default RecentUsers;
