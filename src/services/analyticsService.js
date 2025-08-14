/**
 * Analytics Service for GitHub Repositories
 * Provides methods to generate comprehensive analytics and insights for repositories.
 * Includes caching for performance optimization.
 * Utilizes various metrics such as language distribution, activity patterns, and engagement statistics.
 */
export class RepositoryAnalyticsService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Generate comprehensive analytics for repositories
     */
    generateAnalytics(repositories, user = null) {
        const cacheKey = `analytics_${user?.login || "anonymous"}_${
            repositories.length
        }`;

        // Check cache first
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        const analytics = {
            overview: this.generateOverview(repositories),
            languages: this.analyzeLanguages(repositories),
            activity: this.analyzeActivity(repositories),
            engagement: this.analyzeEngagement(repositories),
            trends: this.analyzeTrends(repositories),
            insights: this.generateInsights(repositories, user),
        };

        // Cache the results
        this.setCache(cacheKey, analytics);
        return analytics;
    }

    /**
     * Generate overview statistics
     */
    generateOverview(repositories) {
        const total = repositories.length;
        const totalStars = repositories.reduce(
            (sum, repo) => sum + repo.stargazers_count,
            0
        );
        const totalForks = repositories.reduce(
            (sum, repo) => sum + repo.forks_count,
            0
        );
        const totalWatchers = repositories.reduce(
            (sum, repo) => sum + repo.watchers_count,
            0
        );

        const publicRepos = repositories.filter((repo) => !repo.private).length;
        const privateRepos = repositories.filter((repo) => repo.private).length;
        const forkedRepos = repositories.filter((repo) => repo.fork).length;
        const originalRepos = repositories.filter((repo) => !repo.fork).length;

        const hasIssues = repositories.filter((repo) => repo.has_issues).length;
        const hasWiki = repositories.filter((repo) => repo.has_wiki).length;
        const hasPages = repositories.filter((repo) => repo.has_pages).length;

        return {
            total,
            totalStars,
            totalForks,
            totalWatchers,
            averageStars: (totalStars / total).toFixed(1),
            averageForks: (totalForks / total).toFixed(1),
            averageWatchers: (totalWatchers / total).toFixed(1),
            distribution: {
                public: publicRepos,
                private: privateRepos,
                forked: forkedRepos,
                original: originalRepos,
            },
            features: {
                withIssues: hasIssues,
                withWiki: hasWiki,
                withPages: hasPages,
            },
        };
    }

    /**
     * Analyze programming languages
     */
    analyzeLanguages(repositories) {
        const languageStats = {};
        const languageBytes = {};

        repositories.forEach((repo) => {
            if (repo.language) {
                languageStats[repo.language] =
                    (languageStats[repo.language] || 0) + 1;
                // Estimate bytes (using size as proxy)
                languageBytes[repo.language] =
                    (languageBytes[repo.language] || 0) + repo.size;
            }
        });

        const languageData = Object.entries(languageStats)
            .map(([language, count]) => ({
                language,
                count,
                percentage: ((count / repositories.length) * 100).toFixed(1),
                totalSize: languageBytes[language] || 0,
            }))
            .sort((a, b) => b.count - a.count);

        const dominantLanguage = languageData[0]?.language || "None";
        const languageDiversity = Object.keys(languageStats).length;

        return {
            data: languageData,
            dominantLanguage,
            diversity: languageDiversity,
            distribution: languageStats,
        };
    }

    /**
     * Analyze repository activity patterns
     */
    analyzeActivity(repositories) {
        // Creation timeline
        const creationByYear = {};
        const creationByMonth = {};
        const updatesByYear = {};

        repositories.forEach((repo) => {
            const createdYear = new Date(repo.created_at).getFullYear();
            const createdMonth = new Date(repo.created_at).getMonth();
            const updatedYear = new Date(repo.updated_at).getFullYear();

            creationByYear[createdYear] =
                (creationByYear[createdYear] || 0) + 1;
            creationByMonth[createdMonth] =
                (creationByMonth[createdMonth] || 0) + 1;
            updatesByYear[updatedYear] = (updatesByYear[updatedYear] || 0) + 1;
        });

        const yearlyCreation = Object.entries(creationByYear)
            .map(([year, count]) => ({ year: parseInt(year), count }))
            .sort((a, b) => a.year - b.year);

        const monthlyCreation = Object.entries(creationByMonth)
            .map(([month, count]) => ({
                month: parseInt(month),
                monthName: new Date(0, month).toLocaleString("default", {
                    month: "long",
                }),
                count,
            }))
            .sort((a, b) => a.month - b.month);

        // Activity metrics
        const recentlyActive = repositories.filter((repo) => {
            const lastUpdate = new Date(repo.updated_at);
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return lastUpdate > sixMonthsAgo;
        }).length;

        const activePercentage = (
            (recentlyActive / repositories.length) *
            100
        ).toFixed(1);

        return {
            timeline: {
                yearly: yearlyCreation,
                monthly: monthlyCreation,
                updates: updatesByYear,
            },
            activity: {
                recentlyActive,
                activePercentage,
                totalRepositories: repositories.length,
            },
        };
    }

    /**
     * Analyze engagement metrics
     */
    analyzeEngagement(repositories) {
        // Star distribution
        const starRanges = {
            0: 0,
            "1-5": 0,
            "6-20": 0,
            "21-50": 0,
            "51-100": 0,
            "101-500": 0,
            "500+": 0,
        };

        repositories.forEach((repo) => {
            const stars = repo.stargazers_count;
            if (stars === 0) starRanges["0"]++;
            else if (stars <= 5) starRanges["1-5"]++;
            else if (stars <= 20) starRanges["6-20"]++;
            else if (stars <= 50) starRanges["21-50"]++;
            else if (stars <= 100) starRanges["51-100"]++;
            else if (stars <= 500) starRanges["101-500"]++;
            else starRanges["500+"]++;
        });

        const starDistribution = Object.entries(starRanges).map(
            ([range, count]) => ({
                range,
                count,
                percentage: ((count / repositories.length) * 100).toFixed(1),
            })
        );

        // Top performers
        const topStarred = [...repositories]
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 10);

        const topForked = [...repositories]
            .sort((a, b) => b.forks_count - a.forks_count)
            .slice(0, 10);

        const topWatched = [...repositories]
            .sort((a, b) => b.watchers_count - a.watchers_count)
            .slice(0, 10);

        // Engagement ratios
        const avgStarToForkRatio =
            repositories
                .filter((repo) => repo.forks_count > 0)
                .reduce(
                    (sum, repo) =>
                        sum + repo.stargazers_count / repo.forks_count,
                    0
                ) / repositories.filter((repo) => repo.forks_count > 0).length;

        return {
            starDistribution,
            topPerformers: {
                mostStarred: topStarred,
                mostForked: topForked,
                mostWatched: topWatched,
            },
            metrics: {
                averageStarToForkRatio: avgStarToForkRatio?.toFixed(2) || 0,
            },
        };
    }

    /**
     * Analyze trends and patterns
     */
    analyzeTrends(repositories) {
        const now = new Date();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const threeMonthsAgo = new Date(
            now.getTime() - 90 * 24 * 60 * 60 * 1000
        );
        const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

        // Recent activity
        const recentActivity = {
            lastMonth: repositories.filter(
                (repo) => new Date(repo.updated_at) > oneMonthAgo
            ).length,
            lastThreeMonths: repositories.filter(
                (repo) => new Date(repo.updated_at) > threeMonthsAgo
            ).length,
            lastYear: repositories.filter(
                (repo) => new Date(repo.updated_at) > oneYearAgo
            ).length,
        };

        // Growth trends
        const creationTrends = {
            lastYear: repositories.filter(
                (repo) => new Date(repo.created_at) > oneYearAgo
            ).length,
            previousYear: repositories.filter((repo) => {
                const created = new Date(repo.created_at);
                const twoYearsAgo = new Date(
                    now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000
                );
                return created > twoYearsAgo && created <= oneYearAgo;
            }).length,
        };

        const growthRate =
            creationTrends.previousYear > 0
                ? (
                      ((creationTrends.lastYear - creationTrends.previousYear) /
                          creationTrends.previousYear) *
                      100
                  ).toFixed(1)
                : 0;

        return {
            activity: recentActivity,
            growth: {
                ...creationTrends,
                growthRate: parseFloat(growthRate),
            },
        };
    }

    /**
     * Generate insights and recommendations
     */
    generateInsights(repositories, user) {
        const insights = [];
        const overview = this.generateOverview(repositories);
        const languages = this.analyzeLanguages(repositories);
        const engagement = this.analyzeEngagement(repositories);
        const trends = this.analyzeTrends(repositories);

        // Language insights
        if (languages.diversity >= 5) {
            insights.push({
                type: "positive",
                category: "Languages",
                title: "Great Language Diversity",
                description: `You work with ${languages.diversity} different programming languages, showing versatility and adaptability.`,
                icon: "language",
            });
        }

        // Engagement insights
        if (overview.totalStars > 100) {
            insights.push({
                type: "positive",
                category: "Engagement",
                title: "Strong Community Engagement",
                description: `Your repositories have earned ${overview.totalStars} stars total, indicating valuable contributions to the community.`,
                icon: "star",
            });
        }

        // Activity insights
        if (trends.activity.lastMonth > 0) {
            insights.push({
                type: "positive",
                category: "Activity",
                title: "Recent Activity",
                description: `You've been active recently with ${trends.activity.lastMonth} repositories updated in the last month.`,
                icon: "activity",
            });
        }

        // Growth insights
        if (trends.growth.growthRate > 0) {
            insights.push({
                type: "positive",
                category: "Growth",
                title: "Positive Growth Trend",
                description: `Repository creation has increased by ${trends.growth.growthRate}% compared to the previous year.`,
                icon: "trending",
            });
        }

        // Recommendations
        const recommendations = [];

        if (overview.features.withPages < overview.total * 0.3) {
            recommendations.push({
                type: "suggestion",
                title: "Consider GitHub Pages",
                description:
                    "Only a few repositories use GitHub Pages. Consider creating documentation sites for your projects.",
                action: "Enable GitHub Pages for documentation",
            });
        }

        if (overview.averageStars < 1 && overview.total > 5) {
            recommendations.push({
                type: "suggestion",
                title: "Improve Repository Visibility",
                description:
                    "Consider adding better README files, descriptions, and topics to increase discoverability.",
                action: "Enhance repository documentation",
            });
        }

        return {
            insights,
            recommendations,
            summary: {
                totalInsights: insights.length,
                totalRecommendations: recommendations.length,
                overallScore: this.calculateOverallScore(
                    overview,
                    engagement,
                    trends
                ),
            },
        };
    }

    /**
     * Calculate overall repository score
     */
    calculateOverallScore(overview, engagement, trends) {
        let score = 0;
        const maxScore = 100;

        // Repository count (max 20 points)
        score += Math.min(overview.total * 2, 20);

        // Stars (max 25 points)
        score += Math.min(overview.totalStars * 0.5, 25);

        // Activity (max 20 points)
        score += Math.min(trends.activity.lastThreeMonths * 4, 20);

        // Language diversity (max 15 points)
        score += Math.min(Object.keys(overview.distribution).length * 3, 15);

        // Features usage (max 10 points)
        const featureUsage =
            (overview.features.withIssues +
                overview.features.withWiki +
                overview.features.withPages) /
            (overview.total * 3);
        score += featureUsage * 10;

        // Growth trend (max 10 points)
        if (trends.growth.growthRate > 0) {
            score += Math.min(trends.growth.growthRate, 10);
        }

        return Math.min(Math.round(score), maxScore);
    }

    /**
     * Cache management
     */
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
        });
    }

    clearCache() {
        this.cache.clear();
    }
}

// Singleton instance
export const analyticsService = new RepositoryAnalyticsService();
