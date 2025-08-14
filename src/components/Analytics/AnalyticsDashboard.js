"use client";
import { useState, useEffect, useMemo } from "react";
import { analyticsService } from "@/services/analyticsService";
import {
    Dashboard,
    Insights,
    TrendingUp,
    TrendingDown,
    Assessment,
    Lightbulb,
    Star,
    Code,
    Timeline,
    Speed,
    CheckCircle,
    Warning,
    Info,
    Refresh,
} from "@mui/icons-material";
import { CircularProgress, LinearProgress } from "@mui/material";

const AnalyticsDashboard = ({ repositories, user, isLoading = false }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Generate analytics when repositories change
    useEffect(() => {
        if (repositories && repositories.length > 0) {
            setLoadingAnalytics(true);
            try {
                const analyticsData = analyticsService.generateAnalytics(
                    repositories,
                    user
                );
                setAnalytics(analyticsData);
                setLastUpdated(new Date());
            } catch (error) {
                console.error("Error generating analytics:", error);
            } finally {
                setLoadingAnalytics(false);
            }
        }
    }, [repositories, user]);

    const refreshAnalytics = () => {
        if (repositories && repositories.length > 0) {
            analyticsService.clearCache();
            setLoadingAnalytics(true);
            const analyticsData = analyticsService.generateAnalytics(
                repositories,
                user
            );
            setAnalytics(analyticsData);
            setLastUpdated(new Date());
            setLoadingAnalytics(false);
        }
    };

    if (isLoading || loadingAnalytics) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border dark:border-gray-700">
                <div className="text-center">
                    <CircularProgress size={40} className="mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Analyzing Repository Data
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Generating comprehensive analytics and insights...
                    </p>
                </div>
            </div>
        );
    }

    if (!repositories || repositories.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border dark:border-gray-700">
                <div className="text-center">
                    <Dashboard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                        No Data Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                        Analytics dashboard will appear once repository data is
                        loaded.
                    </p>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border dark:border-gray-700">
                <div className="text-center">
                    <Warning className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">
                        Analytics Error
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Failed to generate analytics data. Please try
                        refreshing.
                    </p>
                    <button
                        onClick={refreshAnalytics}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                        Retry Analysis
                    </button>
                </div>
            </div>
        );
    }

    const { overview, languages, engagement, trends, insights } = analytics;

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600 dark:text-green-400";
        if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
        return "text-red-600 dark:text-red-400";
    };

    const getScoreBackground = (score) => {
        if (score >= 80) return "bg-green-100 dark:bg-green-900/30";
        if (score >= 60) return "bg-yellow-100 dark:bg-yellow-900/30";
        return "bg-red-100 dark:bg-red-900/30";
    };

    const getInsightIcon = (iconType) => {
        switch (iconType) {
            case "star":
                return <Star className="w-5 h-5" />;
            case "language":
                return <Code className="w-5 h-5" />;
            case "activity":
                return <Timeline className="w-5 h-5" />;
            case "trending":
                return <TrendingUp className="w-5 h-5" />;
            default:
                return <Insights className="w-5 h-5" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                            <Dashboard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                Analytics Dashboard
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Comprehensive insights for{" "}
                                {user?.login || "repository"} data
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {lastUpdated && (
                            <div className="text-right">
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    Last updated
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                    {lastUpdated.toLocaleTimeString()}
                                </div>
                            </div>
                        )}
                        <button
                            onClick={refreshAnalytics}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                            title="Refresh Analytics"
                        >
                            <Refresh className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                </div>

                {/* Overall Score */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div
                        className={`p-4 rounded-lg ${getScoreBackground(
                            insights.summary.overallScore
                        )}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Overall Score
                                </h3>
                                <div
                                    className={`text-3xl font-bold ${getScoreColor(
                                        insights.summary.overallScore
                                    )}`}
                                >
                                    {insights.summary.overallScore}/100
                                </div>
                            </div>
                            <Speed
                                className={`w-8 h-8 ${getScoreColor(
                                    insights.summary.overallScore
                                )}`}
                            />
                        </div>
                        <div className="mt-3">
                            <LinearProgress
                                variant="determinate"
                                value={insights.summary.overallScore}
                                className="h-2 rounded-full"
                            />
                        </div>
                    </div>

                    {/* <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Insights Found
                                </h3>
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                    {insights.summary.totalInsights}
                                </div>
                            </div>
                            <Insights className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                    Recommendations
                                </h3>
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {insights.summary.totalRecommendations}
                                </div>
                            </div>
                            <Lightbulb className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div> */}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Key Metrics Overview
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {overview.total}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Total Repos
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {overview.totalStars}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Total Stars
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {overview.totalForks}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Total Forks
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {languages.diversity}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Languages
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                            {overview.averageStars}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Avg Stars
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                            {trends.activity.lastMonth}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Active (30d)
                        </div>
                    </div>
                </div>
            </div>

            {/* Insights */}
            {/* {insights.insights.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                        <Insights className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                        Key Insights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {insights.insights.map((insight, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700"
                            >
                                <div className="flex-shrink-0 text-green-600 dark:text-green-400">
                                    {getInsightIcon(insight.icon)}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-green-800 dark:text-green-200">
                                        {insight.title}
                                    </h4>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        {insight.description}
                                    </p>
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-200 dark:bg-green-800 text-xs font-medium text-green-800 dark:text-green-200 rounded-full">
                                        {insight.category}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {/* Recommendations */}
            {/* {insights.recommendations.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-600 dark:text-yellow-400" />
                        Recommendations
                    </h3>
                    <div className="space-y-4">
                        {insights.recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="flex items-start space-x-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700"
                            >
                                <div className="flex-shrink-0 text-yellow-600 dark:text-yellow-400">
                                    <Info className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                        {rec.title}
                                    </h4>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                        {rec.description}
                                    </p>
                                    <div className="mt-2 text-xs font-medium text-yellow-600 dark:text-yellow-400">
                                        Suggested Action: {rec.action}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )} */}

            {/* Growth Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Growth & Activity Trends
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                        <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                            Growth Rate
                        </div>
                        <div
                            className={`text-2xl font-bold ${
                                trends.growth.growthRate >= 0
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-red-600 dark:text-red-400"
                            }`}
                        >
                            {trends.growth.growthRate >= 0 ? "+" : ""}
                            {trends.growth.growthRate}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Year over year
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                        <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                            Recent Activity
                        </div>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {trends.activity.lastMonth}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Updated last month
                        </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                        <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                            Top Language
                        </div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {languages.dominantLanguage}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Most used
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
