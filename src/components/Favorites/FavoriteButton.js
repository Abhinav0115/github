"use client";
import { useState } from "react";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useFavorites } from "@/contexts/FavoritesContext";
import { toast } from "react-toastify";

const FavoriteButton = ({
    repo,
    size = "medium",
    showText = true,
    className = "",
}) => {
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const [isLoading, setIsLoading] = useState(false);

    const isRepoFavorited = isFavorite(repo.id);

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setIsLoading(true);

        try {
            if (isRepoFavorited) {
                const success = removeFavorite(repo.id);
                if (success) {
                    toast.success(`Removed "${repo.name}" from favorites`, {
                        icon: "💔",
                    });
                } else {
                    toast.error("Failed to remove from favorites");
                }
            } else {
                const success = addFavorite(repo);
                if (success) {
                    toast.success(`Added "${repo.name}" to favorites`, {
                        icon: "❤️",
                    });
                } else {
                    toast.warning("Repository is already in favorites");
                }
            }
        } catch (error) {
            console.error("Error toggling favorite:", error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    // Size configurations
    const sizeConfig = {
        small: {
            button: "p-1.5",
            icon: "w-4 h-4",
            text: "text-xs",
        },
        medium: {
            button: "p-2",
            icon: "w-5 h-5",
            text: "text-sm",
        },
        large: {
            button: "p-3",
            icon: "w-6 h-6",
            text: "text-base",
        },
    };

    const config = sizeConfig[size] || sizeConfig.medium;

    return (
        <button
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={`
                ${config.button}
                ${
                    isRepoFavorited
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30"
                        : "bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                }
                border rounded-lg transition-all duration-200 flex items-center space-x-1.5
                disabled:opacity-50 disabled:cursor-not-allowed
                hover:scale-105 active:scale-95
                ${className}
            `}
            title={
                isRepoFavorited ? "Remove from favorites" : "Add to favorites"
            }
            aria-label={
                isRepoFavorited ? "Remove from favorites" : "Add to favorites"
            }
        >
            {isLoading ? (
                <div
                    className={`${config.icon} animate-spin rounded-full border-2 border-current border-t-transparent`}
                />
            ) : isRepoFavorited ? (
                <Favorite className={`${config.icon} text-red-500`} />
            ) : (
                <FavoriteBorder className={config.icon} />
            )}

            {showText && (
                <span className={`font-medium ${config.text}`}>
                    {isRepoFavorited ? "Favorited" : "Favorite"}
                </span>
            )}
        </button>
    );
};

export default FavoriteButton;
