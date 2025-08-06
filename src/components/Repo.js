/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useEffect, useState } from "react";
import Axios from "axios";
import { FaStar, FaGithub, FaCode, FaExternalLinkAlt } from "react-icons/fa";
import { BiGitRepoForked } from "react-icons/bi";
import Link from "next/link";

const Repo = ({ repos_url }) => {
    console.log("repos_url", repos_url);
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRepos_2 = async () => {
        if (!repos_url) return;

        setLoading(true);
        setError(null);
        try {
            const { data } = await Axios.get(repos_url);
            setRepos(data);
        } catch (err) {
            setError("Failed to fetch repositories");
            console.error("Error fetching repos:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepos_2();
    }, [repos_url]);

    return (
        <>
            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-4 text-gray-600 text-lg">
                        Loading repositories...
                    </span>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-12">
                    <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                            <FaGithub className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-red-800 mb-2">
                            Error Loading Repositories
                        </h3>
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={fetchRepos_2}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Repository Grid */}
            {!loading && !error && repos.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                            <FaGithub className="mr-3 text-gray-700" />
                            Repositories ({repos.length})
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {repos.map((repo) => (
                            <div
                                key={repo.id}
                                className="bg-white rounded-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                            >
                                {/* Header Section */}
                                <div className="p-5 border-b border-gray-100">
                                    <div className="flex items-start justify-between mb-4">
                                        <Link
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={repo.html_url}
                                            className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors duration-200 group-hover:text-blue-700"
                                        >
                                            {repo.name}
                                        </Link>

                                        {/* Stats */}
                                        <div className="flex items-center space-x-3 ml-3">
                                            {/* Stars */}
                                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                                                <FaStar className="text-yellow-500 mr-1 text-sm" />
                                                <span className="text-sm font-semibold text-yellow-700">
                                                    {repo.stargazers_count.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Forks */}
                                            {repo.forks_count > 0 && (
                                                <div className="flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-200">
                                                    <BiGitRepoForked className="text-green-600 mr-1 text-sm" />
                                                    <span className="text-sm font-semibold text-green-700">
                                                        {repo.forks_count.toLocaleString()}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-700 text-sm leading-relaxed mb-3">
                                        {repo.description ||
                                            "No description available"}
                                    </p>

                                    {/* Language Badge */}
                                    {repo.language && (
                                        <div className="flex items-center">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                                <FaCode className="mr-1" />
                                                {repo.language}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content Section */}
                                <div className="p-5 space-y-4">
                                    {/* Homepage Link */}
                                    {repo.homepage && (
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                                            <div className="flex items-center mb-2">
                                                <FaExternalLinkAlt className="text-blue-600 mr-2 text-xs" />
                                                <span className="text-xs font-medium text-gray-600">
                                                    Live Demo
                                                </span>
                                            </div>
                                            <Link
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={repo.homepage}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm break-all transition-colors duration-200"
                                            >
                                                {repo.homepage}
                                            </Link>
                                        </div>
                                    )}

                                    {/* Repository Info */}
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                        <span>
                                            Updated{" "}
                                            {new Date(
                                                repo.updated_at
                                            ).toLocaleDateString()}
                                        </span>
                                        {repo.size > 0 && (
                                            <span>
                                                {(repo.size / 1024).toFixed(1)}{" "}
                                                MB
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer */}
                                <div className="px-5 pb-5">
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        {/* View Repository Button */}
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={repo.html_url}
                                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg flex items-center transition-all duration-200 transform hover:scale-105"
                                        >
                                            <FaGithub className="mr-2" />
                                            View Code
                                        </a>

                                        {/* Visibility Badge */}
                                        <span
                                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                repo.private
                                                    ? "bg-red-100 text-red-800 border border-red-200"
                                                    : "bg-green-100 text-green-800 border border-green-200"
                                            }`}
                                        >
                                            {repo.private
                                                ? "Private"
                                                : "Public"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No Repositories State */}
            {!loading && !error && repos.length === 0 && (
                <div className="text-center py-16">
                    <div className="max-w-md mx-auto">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <FaGithub className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-medium text-gray-700 mb-3">
                            No repositories found
                        </h3>
                        <p className="text-gray-500">
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
