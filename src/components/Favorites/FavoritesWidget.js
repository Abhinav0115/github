"use client";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Favorite, TrendingUp, Language, Star } from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

const FavoritesWidget = () => {
    const { favorites, getFavoritesCount, getRecentFavorites } = useFavorites();

    const recentFavorites = getRecentFavorites(3);
    const totalStars = favorites.reduce(
        (sum, repo) => sum + repo.stargazers_count,
        0
    );
    const uniqueLanguages = [
        ...new Set(
            favorites.map((repo) => repo.language).filter((lang) => lang)
        ),
    ].length;

    const formatCount = (count) => {
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    if (getFavoritesCount() === 0) {
        return (
            <></>
            // <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            //     <div className="text-center">
            //         <div className="w-12 h-12 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            //             <Favorite className="w-6 h-6 text-red-600 dark:text-red-400" />
            //         </div>
            //         <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            //             No Favorites Yet
            //         </h3>
            //         <p className="text-gray-500 dark:text-gray-400 text-sm">
            //             Start adding repositories to your favorites!
            //         </p>
            //     </div>
            // </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <Favorite className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Favorites
                    </h3>
                </div>
                <Link
                    href="/favorites"
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                >
                    View All
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {getFavoritesCount()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Repositories
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {formatCount(totalStars)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total Stars
                    </div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {uniqueLanguages}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        Languages
                    </div>
                </div>
            </div>

            {/* Recent Favorites */}
            <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Recent Favorites
                </h4>
                {recentFavorites.map((repo) => (
                    <div
                        key={repo.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                        <Image
                            src={repo.owner.avatar_url}
                            alt={repo.owner.login}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {repo.name}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{repo.owner.login}</span>
                                {repo.language && (
                                    <>
                                        <span>•</span>
                                        <span>{repo.language}</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                            <Star className="w-3 h-3 mr-1" />
                            {formatCount(repo.stargazers_count)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesWidget;
