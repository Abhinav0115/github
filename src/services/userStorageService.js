/**
 * User Storage Service for localStorage persistence
 * Stores GitHub users and their repositories for offline access and faster loading.
 * Provides methods to add, remove, and retrieve users and their repositories.
 */

const USER_STORAGE_KEY = "explorer_users";
const USER_REPOS_STORAGE_KEY = "explorer_user_repos";

class UserStorageService {
    constructor() {
        this.userStorageKey = USER_STORAGE_KEY;
        this.reposStorageKey = USER_REPOS_STORAGE_KEY;
    }

    // ==================== USER METHODS ====================

    /**
     * Get all stored users from localStorage
     * @returns {Array} Array of stored user objects
     */
    getStoredUsers() {
        try {
            if (typeof window === "undefined") {
                return []; // SSR safety
            }

            const stored = localStorage.getItem(this.userStorageKey);
            if (!stored) {
                return [];
            }

            const parsed = JSON.parse(stored);

            // Validate the structure
            if (!Array.isArray(parsed)) {
                console.warn("Invalid users data structure, resetting...");
                this.clearAllUsers();
                return [];
            }

            return parsed;
        } catch (error) {
            console.error("Error retrieving users from localStorage:", error);
            return [];
        }
    }

    /**
     * Get a specific user by username
     * @param {string} username - GitHub username
     * @returns {Object|null} User object or null if not found
     */
    getUser(username) {
        try {
            const users = this.getStoredUsers();
            return (
                users.find(
                    (user) =>
                        user.login.toLowerCase() === username.toLowerCase()
                ) || null
            );
        } catch (error) {
            console.error("Error getting user:", error);
            return null;
        }
    }

    /**
     * Store a GitHub user in localStorage
     * @param {Object} userData - GitHub user data from API
     * @returns {boolean} Success status
     */
    storeUser(userData) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            if (!userData || !userData.login) {
                console.error("Invalid user data provided");
                return false;
            }

            const users = this.getStoredUsers();

            // Remove existing user if present (update scenario)
            const filteredUsers = users.filter(
                (user) =>
                    user.login.toLowerCase() !== userData.login.toLowerCase()
            );

            // Add timestamp and cache info
            const userWithMetadata = {
                ...userData,
                cached_at: new Date().toISOString(),
                last_accessed: new Date().toISOString(),
            };

            filteredUsers.push(userWithMetadata);

            // Keep only latest 50 users to prevent excessive storage
            const limitedUsers = filteredUsers.slice(-50);

            localStorage.setItem(
                this.userStorageKey,
                JSON.stringify(limitedUsers)
            );
            return true;
        } catch (error) {
            console.error("Error storing user in localStorage:", error);
            return false;
        }
    }

    /**
     * Remove a specific user from storage
     * @param {string} username - GitHub username to remove
     * @returns {boolean} Success status
     */
    removeUser(username) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            const users = this.getStoredUsers();
            const filteredUsers = users.filter(
                (user) => user.login.toLowerCase() !== username.toLowerCase()
            );

            localStorage.setItem(
                this.userStorageKey,
                JSON.stringify(filteredUsers)
            );
            return true;
        } catch (error) {
            console.error("Error removing user:", error);
            return false;
        }
    }

    /**
     * Remove repositories for a specific user
     * @param {string} username - GitHub username
     * @returns {boolean} Success status
     */
    removeUserRepos(username) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            const allRepos = this.getAllStoredRepos();
            const userKey = username.toLowerCase();

            if (allRepos[userKey]) {
                delete allRepos[userKey];
                localStorage.setItem(
                    this.reposStorageKey,
                    JSON.stringify(allRepos)
                );
            }

            return true;
        } catch (error) {
            console.error("Error removing user repos:", error);
            return false;
        }
    }

    /**
     * Remove user from search history
     * @param {string} username - GitHub username
     * @returns {boolean} Success status
     */
    removeFromSearchHistory(username) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            const SEARCH_HISTORY_KEY = "explorer_search_history";
            const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
            let history = stored ? JSON.parse(stored) : [];

            // Remove all entries for this username
            history = history.filter(
                (item) => item.username.toLowerCase() !== username.toLowerCase()
            );

            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
            return true;
        } catch (error) {
            console.error("Error removing from search history:", error);
            return false;
        }
    }

    /**
     * Remove all data for a specific user (user, repos, search history)
     * @param {string} username - GitHub username
     * @returns {boolean} Success status
     */
    removeUserCompletely(username) {
        try {
            const userRemoved = this.removeUser(username);
            const reposRemoved = this.removeUserRepos(username);
            const historyRemoved = this.removeFromSearchHistory(username);

            return userRemoved && reposRemoved && historyRemoved;
        } catch (error) {
            console.error("Error removing user completely:", error);
            return false;
        }
    }

    /**
     * Update user's last accessed timestamp
     * @param {string} username - GitHub username
     */
    updateUserAccess(username) {
        try {
            if (typeof window === "undefined") {
                return;
            }

            const users = this.getStoredUsers();
            const userIndex = users.findIndex(
                (user) => user.login.toLowerCase() === username.toLowerCase()
            );

            if (userIndex !== -1) {
                users[userIndex].last_accessed = new Date().toISOString();
                localStorage.setItem(
                    this.userStorageKey,
                    JSON.stringify(users)
                );
            }
        } catch (error) {
            console.error("Error updating user access:", error);
        }
    }

    // ==================== REPOSITORY METHODS ====================

    /**
     * Get all stored user repositories
     * @returns {Object} Object with usernames as keys and repo arrays as values
     */
    getAllStoredRepos() {
        try {
            if (typeof window === "undefined") {
                return {};
            }

            const stored = localStorage.getItem(this.reposStorageKey);
            if (!stored) {
                return {};
            }

            const parsed = JSON.parse(stored);

            // Validate the structure
            if (typeof parsed !== "object" || parsed === null) {
                console.warn("Invalid repos data structure, resetting...");
                this.clearAllRepos();
                return {};
            }

            return parsed;
        } catch (error) {
            console.error("Error retrieving repos from localStorage:", error);
            return {};
        }
    }

    /**
     * Get repositories for a specific user
     * @param {string} username - GitHub username
     * @returns {Array} Array of repository objects
     */
    getUserRepos(username) {
        try {
            const allRepos = this.getAllStoredRepos();
            const userKey = username.toLowerCase();
            return allRepos[userKey]?.repos || [];
        } catch (error) {
            console.error("Error getting user repos:", error);
            return [];
        }
    }

    /**
     * Store repositories for a user
     * @param {string} username - GitHub username
     * @param {Array} repositories - Array of repository objects
     * @returns {boolean} Success status
     */
    storeUserRepos(username, repositories) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            if (!username || !Array.isArray(repositories)) {
                console.error("Invalid parameters provided");
                return false;
            }

            const allRepos = this.getAllStoredRepos();
            const userKey = username.toLowerCase();

            // Store repos with metadata
            allRepos[userKey] = {
                username: username,
                repos: repositories,
                cached_at: new Date().toISOString(),
                last_accessed: new Date().toISOString(),
                count: repositories.length,
            };

            // Keep only latest 20 users' repos to prevent excessive storage
            const userKeys = Object.keys(allRepos);
            if (userKeys.length > 20) {
                // Sort by last_accessed and keep most recent 20
                const sortedUsers = userKeys
                    .map((key) => ({
                        key,
                        lastAccessed: allRepos[key].last_accessed,
                    }))
                    .sort(
                        (a, b) =>
                            new Date(b.lastAccessed) - new Date(a.lastAccessed)
                    )
                    .slice(0, 20);

                const filteredRepos = {};
                sortedUsers.forEach(({ key }) => {
                    filteredRepos[key] = allRepos[key];
                });

                localStorage.setItem(
                    this.reposStorageKey,
                    JSON.stringify(filteredRepos)
                );
            } else {
                localStorage.setItem(
                    this.reposStorageKey,
                    JSON.stringify(allRepos)
                );
            }

            return true;
        } catch (error) {
            console.error("Error storing user repos in localStorage:", error);
            return false;
        }
    }

    /**
     * Update repositories access timestamp for a user
     * @param {string} username - GitHub username
     */
    updateReposAccess(username) {
        try {
            if (typeof window === "undefined") {
                return;
            }

            const allRepos = this.getAllStoredRepos();
            const userKey = username.toLowerCase();

            if (allRepos[userKey]) {
                allRepos[userKey].last_accessed = new Date().toISOString();
                localStorage.setItem(
                    this.reposStorageKey,
                    JSON.stringify(allRepos)
                );
            }
        } catch (error) {
            console.error("Error updating repos access:", error);
        }
    }

    // ==================== SEARCH HISTORY METHODS ====================

    /**
     * Add a search to search history
     * @param {string} username - Searched username
     * @param {boolean} found - Whether user was found
     */
    addSearchHistory(username, found = true) {
        try {
            if (typeof window === "undefined") {
                return;
            }

            const SEARCH_HISTORY_KEY = "explorer_search_history";
            const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
            let history = stored ? JSON.parse(stored) : [];

            // Ensure it's an array
            if (!Array.isArray(history)) {
                history = [];
            }

            // Remove existing entry for this username
            history = history.filter(
                (item) => item.username.toLowerCase() !== username.toLowerCase()
            );

            // Add new entry at the beginning
            history.unshift({
                username: username,
                searched_at: new Date().toISOString(),
                found: found,
            });

            // Keep only latest 50 searches
            history = history.slice(0, 50);

            localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
        } catch (error) {
            console.error("Error adding search history:", error);
        }
    }

    /**
     * Get search history
     * @returns {Array} Array of search history objects
     */
    getSearchHistory() {
        try {
            if (typeof window === "undefined") {
                return [];
            }

            const SEARCH_HISTORY_KEY = "explorer_search_history";
            const stored = localStorage.getItem(SEARCH_HISTORY_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Error getting search history:", error);
            return [];
        }
    }

    // ==================== UTILITY METHODS ====================

    /**
     * Check if user data is cached and still valid
     * @param {string} username - GitHub username
     * @param {number} maxAgeHours - Maximum age in hours (default: 24)
     * @returns {boolean} Whether cached data is valid
     */
    isUserCacheValid(username, maxAgeHours = 24) {
        try {
            const user = this.getUser(username);
            if (!user || !user.cached_at) {
                return false;
            }

            const cachedTime = new Date(user.cached_at);
            const now = new Date();
            const diffHours = (now - cachedTime) / (1000 * 60 * 60);

            return diffHours < maxAgeHours;
        } catch (error) {
            console.error("Error checking user cache validity:", error);
            return false;
        }
    }

    /**
     * Check if user repos are cached and still valid
     * @param {string} username - GitHub username
     * @param {number} maxAgeHours - Maximum age in hours (default: 6)
     * @returns {boolean} Whether cached repos are valid
     */
    isReposCacheValid(username, maxAgeHours = 6) {
        try {
            const allRepos = this.getAllStoredRepos();
            const userKey = username.toLowerCase();
            const userRepos = allRepos[userKey];

            if (!userRepos || !userRepos.cached_at) {
                return false;
            }

            const cachedTime = new Date(userRepos.cached_at);
            const now = new Date();
            const diffHours = (now - cachedTime) / (1000 * 60 * 60);

            return diffHours < maxAgeHours;
        } catch (error) {
            console.error("Error checking repos cache validity:", error);
            return false;
        }
    }

    /**
     * Get recently accessed users
     * @param {number} limit - Number of users to return (default: 10)
     * @returns {Array} Array of recently accessed users
     */
    getRecentUsers(limit = 10) {
        try {
            const users = this.getStoredUsers();
            return users
                .sort(
                    (a, b) =>
                        new Date(b.last_accessed) - new Date(a.last_accessed)
                )
                .slice(0, limit);
        } catch (error) {
            console.error("Error getting recent users:", error);
            return [];
        }
    }

    /**
     * Get storage statistics
     * @returns {Object} Storage usage statistics
     */
    getStorageStats() {
        try {
            if (typeof window === "undefined") {
                return null;
            }

            const userData = localStorage.getItem(this.userStorageKey);
            const reposData = localStorage.getItem(this.reposStorageKey);
            const searchData = localStorage.getItem("explorer_search_history");

            const userSize = userData ? new Blob([userData]).size : 0;
            const reposSize = reposData ? new Blob([reposData]).size : 0;
            const searchSize = searchData ? new Blob([searchData]).size : 0;

            const totalSize = userSize + reposSize + searchSize;

            return {
                users: {
                    count: this.getStoredUsers().length,
                    sizeInBytes: userSize,
                    sizeInKB: (userSize / 1024).toFixed(2),
                },
                repositories: {
                    userCount: Object.keys(this.getAllStoredRepos()).length,
                    sizeInBytes: reposSize,
                    sizeInKB: (reposSize / 1024).toFixed(2),
                },
                searchHistory: {
                    count: this.getSearchHistory().length,
                    sizeInBytes: searchSize,
                    sizeInKB: (searchSize / 1024).toFixed(2),
                },
                total: {
                    sizeInBytes: totalSize,
                    sizeInKB: (totalSize / 1024).toFixed(2),
                    sizeInMB: (totalSize / (1024 * 1024)).toFixed(2),
                },
            };
        } catch (error) {
            console.error("Error getting storage stats:", error);
            return null;
        }
    }

    // ==================== CLEANUP METHODS ====================

    /**
     * Clear all stored users
     */
    clearAllUsers() {
        try {
            if (typeof window === "undefined") {
                return false;
            }
            localStorage.removeItem(this.userStorageKey);
            return true;
        } catch (error) {
            console.error("Error clearing users:", error);
            return false;
        }
    }

    /**
     * Clear all stored repositories
     */
    clearAllRepos() {
        try {
            if (typeof window === "undefined") {
                return false;
            }
            localStorage.removeItem(this.reposStorageKey);
            return true;
        } catch (error) {
            console.error("Error clearing repos:", error);
            return false;
        }
    }

    /**
     * Clear search history
     */
    clearSearchHistory() {
        try {
            if (typeof window === "undefined") {
                return false;
            }
            localStorage.removeItem("explorer_search_history");
            return true;
        } catch (error) {
            console.error("Error clearing search history:", error);
            return false;
        }
    }

    /**
     * Clear all user-related data
     */
    clearAllData() {
        try {
            this.clearAllUsers();
            this.clearAllRepos();
            this.clearSearchHistory();
            return true;
        } catch (error) {
            console.error("Error clearing all data:", error);
            return false;
        }
    }

    // ==================== EXPORT/IMPORT METHODS ====================

    /**
     * Export all user data for backup
     * @returns {Object} Export data object
     */
    exportData() {
        try {
            return {
                version: "1.0",
                exported_at: new Date().toISOString(),
                users: this.getStoredUsers(),
                repositories: this.getAllStoredRepos(),
                searchHistory: this.getSearchHistory(),
                stats: this.getStorageStats(),
            };
        } catch (error) {
            console.error("Error exporting data:", error);
            return null;
        }
    }

    /**
     * Import user data from backup
     * @param {Object} importData - Data to import
     * @returns {Object} Import result
     */
    importData(importData) {
        try {
            if (typeof window === "undefined") {
                return { success: false, error: "Not in browser environment" };
            }

            if (!importData || typeof importData !== "object") {
                return { success: false, error: "Invalid import data" };
            }

            let imported = 0;

            // Import users
            if (importData.users && Array.isArray(importData.users)) {
                importData.users.forEach((user) => {
                    if (this.storeUser(user)) {
                        imported++;
                    }
                });
            }

            // Import repositories
            if (
                importData.repositories &&
                typeof importData.repositories === "object"
            ) {
                Object.entries(importData.repositories).forEach(
                    ([username, repoData]) => {
                        if (repoData.repos && Array.isArray(repoData.repos)) {
                            this.storeUserRepos(username, repoData.repos);
                        }
                    }
                );
            }

            // Import search history
            if (
                importData.searchHistory &&
                Array.isArray(importData.searchHistory)
            ) {
                localStorage.setItem(
                    "explorer_search_history",
                    JSON.stringify(importData.searchHistory)
                );
            }

            return {
                success: true,
                imported: imported,
                message: `Successfully imported ${imported} users and related data`,
            };
        } catch (error) {
            console.error("Error importing data:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    }
}

// Create and export a singleton instance
export const userStorageService = new UserStorageService();
export default userStorageService;
