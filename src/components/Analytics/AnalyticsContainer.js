"use client";
import { useState } from "react";
import { Analytics, BarChart, Insights } from "@mui/icons-material";
import SimpleRepositoryAnalytics from "./SimpleRepositoryAnalytics";
import AnalyticsDashboard from "./AnalyticsDashboard";

const AnalyticsContainer = ({ repositories, user, isLoading = false }) => {
    const [activeView, setActiveView] = useState("dashboard");

    const views = [
        {
            id: "dashboard",
            name: "Dashboard",
            icon: <Analytics className="w-4 h-4" />,
            component: AnalyticsDashboard,
        },
        {
            id: "detailed",
            name: "Detailed Analytics",
            icon: <BarChart className="w-4 h-4" />,
            component: SimpleRepositoryAnalytics,
        },
    ];

    const ActiveComponent =
        views.find((view) => view.id === activeView)?.component ||
        AnalyticsDashboard;

    if (!repositories && !isLoading) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* View Selector */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-lg">
                            <Insights className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                Repository Analytics & Insights
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Comprehensive analysis of repository data and
                                performance metrics
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2">
                    {views.map((view) => (
                        <button
                            key={view.id}
                            onClick={() => setActiveView(view.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                activeView === view.id
                                    ? "bg-blue-600 text-white shadow-md"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                        >
                            {view.icon}
                            <span className="text-sm font-medium">
                                {view.name}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Analytics View */}
            <ActiveComponent
                repositories={repositories}
                user={user}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AnalyticsContainer;
