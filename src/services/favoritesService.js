/**
 * Favorites Service - Manages user favorites in a GitHub repository explorer application.
 * Provides methods to add, remove, and retrieve favorite repositories, as well as check if a repository is favorited.
 * Uses localStorage for persistence.
 * Includes methods for importing and exporting favorites, and checking storage usage.
 */


const STORAGE_KEY = "explorer_favorites";

class FavoritesService {
    constructor() {
        this.storageKey = STORAGE_KEY;
    }

    // Get all favorites from localStorage
    getFavorites() {
        try {
            if (typeof window === "undefined") {
                return []; // SSR safety
            }

            const stored = localStorage.getItem(this.storageKey);
            if (!stored) {
                return [];
            }

            const parsed = JSON.parse(stored);

            // Validate the structure
            if (!Array.isArray(parsed)) {
                console.warn("Invalid favorites data structure, resetting...");
                this.clearFavorites();
                return [];
            }

            return parsed;
        } catch (error) {
            console.error(
                "Error retrieving favorites from localStorage:",
                error
            );
            return [];
        }
    }

    // Add a favorite repository
    addFavorite(repo) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            const favorites = this.getFavorites();

            // Check if already exists
            if (favorites.some((fav) => fav.id === repo.id)) {
                return false;
            }

            // Add timestamp if not present
            const repoWithTimestamp = {
                ...repo,
                added_at: repo.added_at || new Date().toISOString(),
            };

            favorites.push(repoWithTimestamp);
            localStorage.setItem(this.storageKey, JSON.stringify(favorites));

            return true;
        } catch (error) {
            console.error("Error adding favorite to localStorage:", error);
            return false;
        }
    }

    // Remove a favorite repository
    removeFavorite(repoId) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            const favorites = this.getFavorites();
            const updatedFavorites = favorites.filter(
                (repo) => repo.id !== repoId
            );

            localStorage.setItem(
                this.storageKey,
                JSON.stringify(updatedFavorites)
            );
            return true;
        } catch (error) {
            console.error("Error removing favorite from localStorage:", error);
            return false;
        }
    }

    // Clear all favorites
    clearFavorites() {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            localStorage.removeItem(this.storageKey);
            return true;
        } catch (error) {
            console.error("Error clearing favorites from localStorage:", error);
            return false;
        }
    }

    // Check if a repository is favorited
    isFavorite(repoId) {
        try {
            const favorites = this.getFavorites();
            return favorites.some((repo) => repo.id === repoId);
        } catch (error) {
            console.error("Error checking favorite status:", error);
            return false;
        }
    }

    // Get favorites count
    getFavoritesCount() {
        try {
            return this.getFavorites().length;
        } catch (error) {
            console.error("Error getting favorites count:", error);
            return 0;
        }
    }

    // Export favorites (for backup/sharing)
    exportFavorites() {
        try {
            const favorites = this.getFavorites();
            const exportData = {
                version: "1.0",
                exported_at: new Date().toISOString(),
                count: favorites.length,
                favorites: favorites,
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });

            return dataBlob;
        } catch (error) {
            console.error("Error exporting favorites:", error);
            return null;
        }
    }

    // Import favorites (from backup)
    importFavorites(importData) {
        try {
            if (typeof window === "undefined") {
                return false;
            }

            let data;
            if (typeof importData === "string") {
                data = JSON.parse(importData);
            } else {
                data = importData;
            }

            // Validate import data structure
            if (!data.favorites || !Array.isArray(data.favorites)) {
                throw new Error("Invalid import data structure");
            }

            // Merge with existing favorites (avoid duplicates)
            const existingFavorites = this.getFavorites();
            const existingIds = new Set(
                existingFavorites.map((repo) => repo.id)
            );

            const newFavorites = data.favorites.filter(
                (repo) => !existingIds.has(repo.id)
            );

            const mergedFavorites = [...existingFavorites, ...newFavorites];
            localStorage.setItem(
                this.storageKey,
                JSON.stringify(mergedFavorites)
            );

            return {
                success: true,
                imported: newFavorites.length,
                skipped: data.favorites.length - newFavorites.length,
                total: mergedFavorites.length,
            };
        } catch (error) {
            console.error("Error importing favorites:", error);
            return {
                success: false,
                error: error.message,
            };
        }
    }

    // Get storage usage info
    getStorageInfo() {
        try {
            if (typeof window === "undefined") {
                return null;
            }

            const data = localStorage.getItem(this.storageKey);
            const sizeInBytes = data ? new Blob([data]).size : 0;
            const sizeInKB = (sizeInBytes / 1024).toFixed(2);

            return {
                count: this.getFavoritesCount(),
                sizeInBytes,
                sizeInKB,
                storageKey: this.storageKey,
            };
        } catch (error) {
            console.error("Error getting storage info:", error);
            return null;
        }
    }
}

// Create and export a singleton instance
export const favoritesService = new FavoritesService();
export default favoritesService;
