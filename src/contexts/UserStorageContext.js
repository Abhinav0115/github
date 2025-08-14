/**
 * User Storage Context for managing GitHub users and repositories storage
 * Provides access to cached users, repositories, and search history
 */

"use client";
import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import userStorageService from "@/services/userStorageService";
import { toast } from "react-toastify";

const UserStorageContext = createContext();

export const useUserStorage = () => {
    const context = useContext(UserStorageContext);
    if (!context) {
        throw new Error(
            "useUserStorage must be used within a UserStorageProvider"
        );
    }
    return context;
};

export const UserStorageProvider = ({ children }) => {
    const [storedUsers, setStoredUsers] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [storageStats, setStorageStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize and load data from localStorage
    useEffect(() => {
        loadStorageData();
    }, []);

    const loadStorageData = useCallback(() => {
        try {
            setStoredUsers(userStorageService.getStoredUsers());
            setSearchHistory(userStorageService.getSearchHistory());
            setStorageStats(userStorageService.getStorageStats());
        } catch (error) {
            console.error("Error loading storage data:", error);
            toast.error("Failed to load cached data");
        }
    }, []);

    // ==================== USER METHODS ====================

    /**
     * Get a cached user
     * @param {string} username - GitHub username
     * @returns {Object|null} Cached user data or null
     */
    const getCachedUser = useCallback((username) => {
        return userStorageService.getUser(username);
    }, []);

    /**
     * Store a user in localStorage
     * @param {Object} userData - User data from GitHub API
     */
    const storeUser = useCallback((userData) => {
        try {
            const success = userStorageService.storeUser(userData);
            if (success) {
                setStoredUsers(userStorageService.getStoredUsers());
                setStorageStats(userStorageService.getStorageStats());
                // toast.success(
                //     `User ${userData.login} cached for offline access`
                // );
            }
            return success;
        } catch (error) {
            console.error("Error storing user:", error);
            toast.error("Failed to cache user data");
            return false;
        }
    }, []);

    /**
     * Update user's last accessed timestamp
     * @param {string} username - GitHub username
     */
    const updateUserAccess = useCallback((username) => {
        try {
            userStorageService.updateUserAccess(username);
            setStoredUsers(userStorageService.getStoredUsers());
        } catch (error) {
            console.error("Error updating user access:", error);
        }
    }, []);

    /**
     * Remove a user completely (user data, repos, search history)
     * @param {string} username - GitHub username to remove
     */
    const removeUser = useCallback((username) => {
        try {
            const success = userStorageService.removeUserCompletely(username);
            if (success) {
                setStoredUsers(userStorageService.getStoredUsers());
                setSearchHistory(userStorageService.getSearchHistory());
                setStorageStats(userStorageService.getStorageStats());
                toast.success(`${username} removed`);
            }
            return success;
        } catch (error) {
            console.error("Error removing user:", error);
            toast.error("Failed to remove user");
            return false;
        }
    }, []);

    /**
     * Remove user from search history only
     * @param {string} username - GitHub username
     */
    const removeFromSearchHistory = useCallback((username) => {
        try {
            const success =
                userStorageService.removeFromSearchHistory(username);
            if (success) {
                setSearchHistory(userStorageService.getSearchHistory());
                toast.success(`${username} removed from search history`);
            }
            return success;
        } catch (error) {
            console.error("Error removing from search history:", error);
            toast.error("Failed to remove from search history");
            return false;
        }
    }, []);

    /**
     * Check if user cache is valid
     * @param {string} username - GitHub username
     * @param {number} maxAgeHours - Maximum age in hours
     * @returns {boolean} Whether cache is valid
     */
    const isUserCacheValid = useCallback((username, maxAgeHours = 24) => {
        return userStorageService.isUserCacheValid(username, maxAgeHours);
    }, []);

    // ==================== REPOSITORY METHODS ====================

    /**
     * Get cached repositories for a user
     * @param {string} username - GitHub username
     * @returns {Array} Array of cached repositories
     */
    const getCachedRepos = useCallback((username) => {
        return userStorageService.getUserRepos(username);
    }, []);

    /**
     * Store repositories for a user
     * @param {string} username - GitHub username
     * @param {Array} repositories - Array of repository objects
     */
    const storeUserRepos = useCallback((username, repositories) => {
        try {
            const success = userStorageService.storeUserRepos(
                username,
                repositories
            );
            if (success) {
                setStorageStats(userStorageService.getStorageStats());
                toast.success(
                    `${repositories.length} repositories cached for ${username}`
                );
            }
            return success;
        } catch (error) {
            console.error("Error storing user repos:", error);
            toast.error("Failed to cache repository data");
            return false;
        }
    }, []);

    /**
     * Update repositories access timestamp
     * @param {string} username - GitHub username
     */
    const updateReposAccess = useCallback((username) => {
        try {
            userStorageService.updateReposAccess(username);
        } catch (error) {
            console.error("Error updating repos access:", error);
        }
    }, []);

    /**
     * Check if repos cache is valid
     * @param {string} username - GitHub username
     * @param {number} maxAgeHours - Maximum age in hours
     * @returns {boolean} Whether cache is valid
     */
    const isReposCacheValid = useCallback((username, maxAgeHours = 6) => {
        return userStorageService.isReposCacheValid(username, maxAgeHours);
    }, []);

    // ==================== SEARCH HISTORY METHODS ====================

    /**
     * Add a search to history
     * @param {string} username - Searched username
     * @param {boolean} found - Whether user was found
     */
    const addSearchHistory = useCallback((username, found = true) => {
        try {
            userStorageService.addSearchHistory(username, found);
            setSearchHistory(userStorageService.getSearchHistory());
        } catch (error) {
            console.error("Error adding search history:", error);
        }
    }, []);

    /**
     * Get recent users
     * @param {number} limit - Number of users to return
     * @returns {Array} Array of recent users
     */
    const getRecentUsers = useCallback((limit = 10) => {
        return userStorageService.getRecentUsers(limit);
    }, []);

    // ==================== UTILITY METHODS ====================

    /**
     * Get comprehensive user data (user + repos if available)
     * @param {string} username - GitHub username
     * @returns {Object} Combined user and repo data
     */
    const getComprehensiveUserData = useCallback(
        (username) => {
            const user = getCachedUser(username);
            const repos = getCachedRepos(username);

            return {
                user,
                repos,
                hasUser: !!user,
                hasRepos: repos.length > 0,
                userCacheValid: user ? isUserCacheValid(username) : false,
                reposCacheValid:
                    repos.length > 0 ? isReposCacheValid(username) : false,
            };
        },
        [getCachedUser, getCachedRepos, isUserCacheValid, isReposCacheValid]
    );

    /**
     * Store complete user data (user + repos)
     * @param {Object} userData - User data from GitHub API
     * @param {Array} repositories - Array of repository objects
     */
    const storeCompleteUserData = useCallback(
        (userData, repositories = []) => {
            try {
                setIsLoading(true);

                // Store user data
                const userSuccess = storeUser(userData);

                // Store repositories if provided
                let repoSuccess = true;
                if (repositories.length > 0) {
                    repoSuccess = storeUserRepos(userData.login, repositories);
                }

                // Add to search history
                addSearchHistory(userData.login, true);

                // Update access timestamp
                updateUserAccess(userData.login);

                return userSuccess && repoSuccess;
            } catch (error) {
                console.error("Error storing complete user data:", error);
                toast.error("Failed to cache user data completely");
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [storeUser, storeUserRepos, addSearchHistory, updateUserAccess]
    );

    // ==================== DATA MANAGEMENT METHODS ====================

    /**
     * Clear all cached data
     */
    const clearAllData = useCallback(() => {
        try {
            const success = userStorageService.clearAllData();
            if (success) {
                setStoredUsers([]);
                setSearchHistory([]);
                setStorageStats(null);
                toast.success("All cached data cleared successfully");
            }
            return success;
        } catch (error) {
            console.error("Error clearing all data:", error);
            toast.error("Failed to clear cached data");
            return false;
        }
    }, []);

    /**
     * Export all data for backup
     */
    const exportData = useCallback(() => {
        try {
            const data = userStorageService.exportData();
            if (data) {
                const dataStr = JSON.stringify(data, null, 2);
                const dataBlob = new Blob([dataStr], {
                    type: "application/json",
                });

                // Create download link
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `github-explorer-backup-${
                    new Date().toISOString().split("T")[0]
                }.json`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success("Data exported successfully");
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error exporting data:", error);
            toast.error("Failed to export data");
            return false;
        }
    }, []);

    /**
     * Import data from backup
     * @param {File} file - JSON file to import
     */
    const importData = useCallback(
        async (file) => {
            try {
                setIsLoading(true);

                const text = await file.text();
                const data = JSON.parse(text);

                const result = userStorageService.importData(data);

                if (result.success) {
                    loadStorageData(); // Refresh all data
                    toast.success(result.message);
                } else {
                    toast.error(result.error);
                }

                return result;
            } catch (error) {
                console.error("Error importing data:", error);
                toast.error("Failed to import data");
                return { success: false, error: error.message };
            } finally {
                setIsLoading(false);
            }
        },
        [loadStorageData]
    );

    /**
     * Refresh storage statistics
     */
    const refreshStats = useCallback(() => {
        setStorageStats(userStorageService.getStorageStats());
    }, []);

    // Context value
    const value = {
        // State
        storedUsers,
        searchHistory,
        storageStats,
        isLoading,

        // User methods
        getCachedUser,
        storeUser,
        updateUserAccess,
        removeUser,
        isUserCacheValid,

        // Repository methods
        getCachedRepos,
        storeUserRepos,
        updateReposAccess,
        isReposCacheValid,

        // Search history methods
        addSearchHistory,
        removeFromSearchHistory,
        getRecentUsers,

        // Utility methods
        getComprehensiveUserData,
        storeCompleteUserData,

        // Data management
        clearAllData,
        exportData,
        importData,
        refreshStats,
        loadStorageData,
    };

    return (
        <UserStorageContext.Provider value={value}>
            {children}
        </UserStorageContext.Provider>
    );
};

export default UserStorageContext;
