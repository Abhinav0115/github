"use client";
import { useState, useEffect, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Area,
    AreaChart,
} from "recharts";
import {
    Assessment,
    TrendingUp,
    Code,
    Star,
    Timeline,
    Language,
    Update,
    Visibility,
    ExpandMore,
    ExpandLess,
    Analytics,
    Insights,
    DataUsage,
} from "@mui/icons-material";
import { FaGithub, FaStar, FaCodeBranch } from "react-icons/fa";
import { BiGitRepoForked } from "react-icons/bi";

const RepositoryAnalytics = ({ repositories, user }) => {
    const [expandedSection, setExpandedSection] = useState("overview");
    const [isLoading, setIsLoading] = useState(false);

    // Color palette for charts
    const colors = [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#06B6D4",
        "#F97316",
        "#84CC16",
        "#EC4899",
        "#6366F1",
    ];

    // Calculate analytics data
    const analyticsData = useMemo(() => {
        if (!repositories || repositories.length === 0) return null;

        // Language distribution
        const languageStats = {};
        repositories.forEach((repo) => {
            if (repo.language) {
                languageStats[repo.language] =
                    (languageStats[repo.language] || 0) + 1;
            }
        });

        const languageData = Object.entries(languageStats)
            .map(([language, count]) => ({
                language,
                count,
                percentage: ((count / repositories.length) * 100).toFixed(1),
            }))
            .sort((a, b) => b.count - a.count);

        // Repository metrics over time (created_at)
        const reposByYear = {};
        repositories.forEach((repo) => {
            const year = new Date(repo.created_at).getFullYear();
            reposByYear[year] = (reposByYear[year] || 0) + 1;
        });

        const yearlyData = Object.entries(reposByYear)
            .map(([year, count]) => ({
                year: parseInt(year),
                repositories: count,
            }))
            .sort((a, b) => a.year - b.year);

        // Stars and forks distribution
        const starCategories = {
            0: 0,
            "1-10": 0,
            "11-50": 0,
            "51-100": 0,
            "101-500": 0,
            "500+": 0,
        };

        repositories.forEach((repo) => {
            const stars = repo.stargazers_count;
            if (stars === 0) starCategories["0"]++;
            else if (stars <= 10) starCategories["1-10"]++;
            else if (stars <= 50) starCategories["11-50"]++;
            else if (stars <= 100) starCategories["51-100"]++;
            else if (stars <= 500) starCategories["101-500"]++;
            else starCategories["500+"]++;
        });

        const starDistribution = Object.entries(starCategories).map(
            ([range, count]) => ({ range, count })
        );

        // Top repositories by metrics
        const topStarredRepos = [...repositories]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 5);

        const topForkedRepos = [...repositories]
            .sort((a, b) => b.forks_count - a.forks_count)
            .slice(0, 5);

        const recentlyUpdated = [...repositories]
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 5);

        // Activity metrics
        const totalStars = repositories.reduce(
            (sum, repo) => sum + repo.stargazers_count,
            0
        );
        const totalForks = repositories.reduce(
            (sum, repo) => sum + repo.forks_count,
            0
        );
        const averageStars = (totalStars / repositories.length).toFixed(1);
        const averageForks = (totalForks / repositories.length).toFixed(1);

        // Repository types
        const repoTypes = {
            public: repositories.filter((repo) => !repo.private).length,
            private: repositories.filter((repo) => repo.private).length,
            forked: repositories.filter((repo) => repo.fork).length,
            original: repositories.filter((repo) => !repo.fork).length,
        };

        return {
            languageData,
            yearlyData,
            starDistribution,
            topStarredRepos,
            topForkedRepos,
            recentlyUpdated,
            totalStars,
            totalForks,
            averageStars,
            averageForks,
            repoTypes,
            totalRepos: repositories.length,
        };
    }, [repositories]);

    const toggleSection = (section) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    if (!repositories || repositories.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
                <div className="text-center py-8">
                    <Analytics className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                        No Repository Data
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Analytics will be available once repositories are
                        loaded.
                    </p>
                </div>
            </div>
        );
    }

    const {
        languageData,
        yearlyData,
        starDistribution,
        topStarredRepos,
        topForkedRepos,
        recentlyUpdated,
        totalStars,
        totalForks,
        averageStars,
        averageForks,
        repoTypes,
        totalRepos,
    } = analyticsData;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                            <Assessment className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Repository Analytics
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Comprehensive insights into{" "}
                                {user?.login || "repository"} data
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {totalRepos}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Total Repositories
                        </div>
                    </div>
                </div>

                {/* Key Metrics Overview */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    Total Stars
                                </p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                                    {totalStars}
                                </p>
                                <p className="text-xs text-blue-500 dark:text-blue-400">
                                    Avg: {averageStars}
                                </p>
                            </div>
                            <FaStar className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                    Total Forks
                                </p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {totalForks}
                                </p>
                                <p className="text-xs text-green-500 dark:text-green-400">
                                    Avg: {averageForks}
                                </p>
                            </div>
                            <BiGitRepoForked className="w-8 h-8 text-green-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                    Languages
                                </p>
                                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                    {languageData.length}
                                </p>
                                <p className="text-xs text-purple-500 dark:text-purple-400">
                                    Different
                                </p>
                            </div>
                            <Code className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                                    Original
                                </p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                                    {repoTypes.original}
                                </p>
                                <p className="text-xs text-orange-500 dark:text-orange-400">
                                    {repoTypes.forked} forked
                                </p>
                            </div>
                            <FaGithub className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Language Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
                <button
                    onClick={() => toggleSection("languages")}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                    <div className="flex items-center space-x-3">
                        <Language className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Programming Languages Distribution
                        </h3>
                    </div>
                    {expandedSection === "languages" ? (
                        <ExpandLess />
                    ) : (
                        <ExpandMore />
                    )}
                </button>

                {expandedSection === "languages" && (
                    <div className="px-6 pb-6">
                        {languageData && languageData.length > 0 ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                

                                {/* Language List */}
                                <div className="space-y-3">
                                    <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-4">
                                        Top Programming Languages
                                    </h4>
                                    {languageData
                                        .slice(0, 8)
                                        .map((lang, index) => (
                                            <div
                                                key={lang.language}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                colors[
                                                                    index %
                                                                        colors.length
                                                                ],
                                                        }}
                                                    />
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        {lang.language}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {lang.count} repos
                                                    </span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        ({lang.percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Code className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    No language data available for the
                                    repositories.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Repository Activity Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
                <button
                    onClick={() => toggleSection("timeline")}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                    <div className="flex items-center space-x-3">
                        <Timeline className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Repository Creation Timeline
                        </h3>
                    </div>
                    {expandedSection === "timeline" ? (
                        <ExpandLess />
                    ) : (
                        <ExpandMore />
                    )}
                </button>

                {expandedSection === "timeline" && (
                    <div className="px-6 pb-6">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={yearlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" />
                                    <YAxis />
                                    <Tooltip />
                                    <Area
                                        type="monotone"
                                        dataKey="repositories"
                                        stroke="#10B981"
                                        fill="#10B981"
                                        fillOpacity={0.3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Star Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
                <button
                    onClick={() => toggleSection("stars")}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                    <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Star Distribution Analysis
                        </h3>
                    </div>
                    {expandedSection === "stars" ? (
                        <ExpandLess />
                    ) : (
                        <ExpandMore />
                    )}
                </button>

                {expandedSection === "stars" && (
                    <div className="px-6 pb-6">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={starDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#F59E0B" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Top Repositories */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700">
                <button
                    onClick={() => toggleSection("top-repos")}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                >
                    <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Top Performing Repositories
                        </h3>
                    </div>
                    {expandedSection === "top-repos" ? (
                        <ExpandLess />
                    ) : (
                        <ExpandMore />
                    )}
                </button>

                {expandedSection === "top-repos" && (
                    <div className="px-6 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Most Starred */}
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                                    <FaStar className="w-4 h-4 text-yellow-500 mr-2" />
                                    Most Starred
                                </h4>
                                <div className="space-y-3">
                                    {topStarredRepos.map((repo, index) => (
                                        <div
                                            key={repo.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {repo.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {repo.description ||
                                                        "No description"}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                                <FaStar className="w-3 h-3 text-yellow-500" />
                                                <span>
                                                    {repo.stargazers_count}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Most Forked */}
                            <div>
                                <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-4 flex items-center">
                                    <BiGitRepoForked className="w-4 h-4 text-green-500 mr-2" />
                                    Most Forked
                                </h4>
                                <div className="space-y-3">
                                    {topForkedRepos.map((repo, index) => (
                                        <div
                                            key={repo.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                    {repo.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {repo.description ||
                                                        "No description"}
                                                </p>
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                                                <BiGitRepoForked className="w-3 h-3 text-green-500" />
                                                <span>{repo.forks_count}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepositoryAnalytics;
