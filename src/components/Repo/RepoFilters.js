"use client";
import React, { useEffect } from "react";
import { Input } from "@mui/material";
import { Search, Clear, FilterList } from "@mui/icons-material";

const RepoFilters = ({
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    totalRepos,
    filteredCount,
    language,
    setLanguage,
    availableLanguages = [],
}) => {
    const clearFilters = () => {
        setSearchTerm("");
        setLanguage("");
    };

    const handleSortByChange = (newSortBy) => {
        setSortBy(newSortBy);
        // Reset sort order to appropriate default when sort type changes
        if (newSortBy === "name") {
            setSortOrder("asc"); // A to Z for names
        } else {
            setSortOrder("desc"); // Newest/Highest first for others
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm.trim() === "") {
                setSearchTerm("");
            }
        }, 5000); // 500ms delay
        return () => clearTimeout(timer);
    }, [searchTerm, setSearchTerm]);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 shadow-lg">
            <div className="flex flex-col space-y-4">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-2">
                    <FilterList className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Filter & Sort Repositories
                    </h3>
                </div>
                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                    {/* Search Filter - Left Side */}
                    <div className="flex-1 min-w-0 lg:max-w-md">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Search Repositories
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Search by name or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            border: "none",
                                        },
                                    },
                                    "& .MuiInputBase-input": {
                                        color: "inherit",
                                        paddingLeft: "2.5rem",
                                        paddingRight: "2.5rem",
                                        "&::placeholder": {
                                            color: "inherit",
                                            opacity: 0.6,
                                        },
                                    },
                                }}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm("")}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <Clear className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Controls - Right Side */}
                    <div className="flex flex-col sm:flex-row gap-3 lg:items-end lg:flex-shrink-0">
                        {/* Language Filter */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[130px]"
                            >
                                <option value="">All Languages</option>
                                {availableLanguages.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Sort By */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    handleSortByChange(e.target.value)
                                }
                                className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[120px]"
                            >
                                <option value="name">Name</option>
                                <option value="stargazers_count">Stars</option>
                                <option value="updated_at">Last Updated</option>
                                <option value="created_at">Created Date</option>
                            </select>
                        </div>

                        {/* Sort Order */}
                        <div className="min-w-0">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Order
                            </label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="w-full sm:w-auto px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[110px]"
                            >
                                {sortBy === "name" && (
                                    <>
                                        <option value="asc">A to Z</option>
                                        <option value="desc">Z to A</option>
                                    </>
                                )}
                                {sortBy === "stargazers_count" && (
                                    <>
                                        <option value="desc">
                                            High to Low
                                        </option>
                                        <option value="asc">Low to High</option>
                                    </>
                                )}
                                {(sortBy === "created_at" ||
                                    sortBy === "updated_at") && (
                                    <>
                                        <option value="desc">
                                            Newest First
                                        </option>
                                        <option value="asc">
                                            Oldest First
                                        </option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        {(searchTerm || language) && (
                            <div className="flex-shrink-0">
                                <label className="block text-sm font-medium text-transparent mb-2 lg:hidden">
                                    Clear
                                </label>
                                <button
                                    onClick={clearFilters}
                                    className="w-full sm:w-auto px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 whitespace-nowrap"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>{" "}
                {/* Results Summary */}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {filteredCount} of {totalRepos} repositories
                            {searchTerm && (
                                <span className="ml-1">
                                    matching &quot;
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {searchTerm}
                                    </span>
                                    &quot;
                                </span>
                            )}
                            {language && (
                                <span className="ml-1">
                                    in{" "}
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {language}
                                    </span>
                                </span>
                            )}
                        </p>

                        {filteredCount === 0 && totalRepos > 0 && (
                            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full">
                                No repositories match your filters
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RepoFilters;
