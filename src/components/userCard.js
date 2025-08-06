/* eslint-disable react/no-unescaped-entities */

import { Card, CardContent } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import {
    FaMapMarkerAlt,
    FaExternalLinkAlt,
    FaBlog,
    FaUsers,
    FaBook,
} from "react-icons/fa";

const UserCard = ({ user }) => {
    return (
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0 hover:shadow-2xl transition-all duration-300 max-w-full">
            <div className="flex flex-col lg:flex-row">
                {/* Avatar Section */}
                <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center lg:w-1/3">
                    <div className="text-center">
                        <Image
                            src={user.avatar_url}
                            alt={user.name || user.login}
                            width={200}
                            height={200}
                            className="rounded-full border-4 border-white shadow-lg object-cover mx-auto"
                        />

                        {/* Stats */}
                        <div className="mt-6 flex justify-center space-x-4">
                            <div className="text-center">
                                <div className="flex items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                                    <FaBook className="text-blue-600 mr-1" />
                                    <span className="font-bold text-gray-800">
                                        {user.public_repos}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600 mt-1 block">
                                    Repos
                                </span>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                                    <FaUsers className="text-green-600 mr-1" />
                                    <span className="font-bold text-gray-800">
                                        {user.followers}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600 mt-1 block">
                                    Followers
                                </span>
                            </div>

                            <div className="text-center">
                                <div className="flex items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                                    <FaUsers className="text-purple-600 mr-1" />
                                    <span className="font-bold text-gray-800">
                                        {user.following}
                                    </span>
                                </div>
                                <span className="text-xs text-gray-600 mt-1 block">
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
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                            {user.name || user.login}
                        </h1>
                        {user.name && (
                            <p className="text-lg text-gray-600 font-medium">
                                @{user.login}
                            </p>
                        )}
                    </div>

                    {/* Location */}
                    {user.location && (
                        <div className="flex items-center text-gray-600">
                            <FaMapMarkerAlt className="mr-2 text-red-500" />
                            <span className="text-lg font-medium">
                                {user.location}
                            </span>
                        </div>
                    )}

                    {/* Bio */}
                    {user.bio && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                            <p className="text-gray-700 text-base leading-relaxed italic">
                                "{user.bio}"
                            </p>
                        </div>
                    )}

                    {/* Links Section */}
                    <div className="space-y-3">
                        {/* GitHub Profile */}
                        {user.html_url && (
                            <div className="flex items-center">
                                <FaExternalLinkAlt className="mr-3 text-blue-500 flex-shrink-0" />
                                <div>
                                    <span className="text-sm text-gray-600 block">
                                        GitHub Profile:
                                    </span>
                                    <Link
                                        href={user.html_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 break-all"
                                    >
                                        {user.html_url}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Blog */}
                        {user.blog && (
                            <div className="flex items-center">
                                <FaBlog className="mr-3 text-green-500 flex-shrink-0" />
                                <div>
                                    <span className="text-sm text-gray-600 block">
                                        Blog:
                                    </span>
                                    <Link
                                        href={
                                            user.blog.startsWith("http")
                                                ? user.blog
                                                : `https://${user.blog}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800 font-medium hover:underline transition-colors duration-200 break-all"
                                    >
                                        {user.blog}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Company and other info */}
                    {(user.company || user.email) && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            {user.company && (
                                <div className="mb-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        Company:{" "}
                                    </span>
                                    <span className="text-gray-800">
                                        {user.company}
                                    </span>
                                </div>
                            )}
                            {user.email && (
                                <div>
                                    <span className="text-sm font-medium text-gray-600">
                                        Email:{" "}
                                    </span>
                                    <span className="text-gray-800">
                                        {user.email}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Join date */}
                    <div className="text-sm text-gray-500">
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
