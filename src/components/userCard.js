/* eslint-disable react/no-unescaped-entities */

import { Card, CardContent } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import {
    FaMapMarkerAlt,
    FaExternalLinkAlt,
    FaGlobe,
    FaUsers,
    FaBook,
} from "react-icons/fa";

const UserCard = ({ user }) => {
    return (
        <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 max-w-full dark:shadow-gray-900/50">
            <div className="flex flex-col lg:flex-row">
                {/* Avatar Section */}
                <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center lg:w-1/3">
                    <div className="text-center">
                        <Image
                            src={user.avatar_url}
                            alt={user.name || user.login}
                            width={260}
                            height={260}
                            className="rounded-full border-4 border-white shadow-lg object-cover mx-auto"
                        />

                        {/* Stats */}
                        <div className="mt-6 flex justify-center space-x-4">
                            <div className="text-center">
                                <div className="flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm">
                                    <FaBook className="text-blue-600 dark:text-blue-400 mr-1" />
                                    <span className="font-bold text-gray-800 dark:text-white">
                                        {user.public_repos}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 block">
                                    Repos
                                </span>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm">
                                    <FaUsers className="text-green-600 dark:text-green-400 mr-1" />
                                    <span className="font-bold text-gray-800 dark:text-white">
                                        {user.followers}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 block">
                                    Followers
                                </span>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center bg-white dark:bg-gray-700 rounded-lg p-2 shadow-sm">
                                    <FaUsers className="text-purple-600 dark:text-purple-400 mr-1" />
                                    <span className="font-bold text-gray-800 dark:text-white">
                                        {user.following}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-300 mt-1 block">
                                    Following
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <CardContent className="flex-1 p-8 space-y-6">
                    {/* Name and Username */}
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                            {user.name || user.login}
                        </h1>
                        {user.name && (
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                                @{user.login}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    {user.location && (
                        <div className="flex items-center text-gray-600 dark:text-gray-300">
                            <FaMapMarkerAlt className="mr-2 text-red-500 dark:text-red-400" />
                            <span className="text-lg font-medium">
                                {user.location}
                            </span>
                        </div>
                    )}

                    {/* Bio */}
                    {user.bio && (
                        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <p className="text-gray-700 dark:text-gray-200 text-base leading-relaxed italic">
                                "{user.bio}"
                            </p>
                        </div>
                    )}

                    {/* Links Section */}
                    <div className="space-y-3">
                        {/* GitHub Profile */}
                        {user.html_url && (
                            <div className="flex items-center">
                                <FaExternalLinkAlt className="mr-3 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 block">
                                        GitHub Profile:
                                    </span>
                                    <Link
                                        href={user.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200 break-all"
                                    >
                                        {user.html_url}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Website */}
                        {user.blog && (
                            <div className="flex items-center">
                                <FaGlobe className="mr-3 text-green-500 dark:text-green-400 flex-shrink-0" />
                                <div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400 block">
                                        Website:
                                    </span>
                                    <Link
                                        href={
                                            user.blog.startsWith("http")
                                                ? user.blog
                                                : `https://${user.blog}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium hover:underline transition-colors duration-200 break-all"
                                    >
                                        {user.blog}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Company and other info */}
                    {(user.company || user.email) && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                            {user.company && (
                                <div className="mb-2">
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Company:{" "}
                                    </span>
                                    <span className="text-gray-800 dark:text-white">
                                        {user.company}
                                    </span>
                                </div>
                            )}
                            {user.email && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Email:{" "}
                                    </span>
                                    <span className="text-gray-800 dark:text-white">
                                        {user.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Join date */}
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span>
                            Joined GitHub on{" "}
                            {new Date(user.created_at).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                }
                            )}
                        </span>
                    </div>
                </CardContent>
            </div>
        </Card>
    );
};

export default UserCard;
