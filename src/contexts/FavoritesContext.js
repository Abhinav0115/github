/**
 * Favorites Context for managing user favorites in a GitHub repository explorer application.
 * This context provides functionality to add, remove, and retrieve favorite repositories,
 * as well as to load and save favorites to localStorage.
 */


"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import { favoritesService } from "@/services/favoritesService";

const FavoritesContext = createContext();

// Actions
const FAVORITES_ACTIONS = {
    LOAD_FAVORITES: "LOAD_FAVORITES",
    ADD_FAVORITE: "ADD_FAVORITE",
    REMOVE_FAVORITE: "REMOVE_FAVORITE",
    CLEAR_FAVORITES: "CLEAR_FAVORITES",
};

// Reducer
const favoritesReducer = (state, action) => {
    switch (action.type) {
        case FAVORITES_ACTIONS.LOAD_FAVORITES:
            return {
                ...state,
                favorites: action.payload,
                isLoading: false,
            };

        case FAVORITES_ACTIONS.ADD_FAVORITE:
            const newFavorites = [...state.favorites, action.payload];
            return {
                ...state,
                favorites: newFavorites,
            };

        case FAVORITES_ACTIONS.REMOVE_FAVORITE:
            const filteredFavorites = state.favorites.filter(
                (repo) => repo.id !== action.payload
            );
            return {
                ...state,
                favorites: filteredFavorites,
            };

        case FAVORITES_ACTIONS.CLEAR_FAVORITES:
            return {
                ...state,
                favorites: [],
            };

        default:
            return state;
    }
};

// Initial state
const initialState = {
    favorites: [],
    isLoading: true,
};

export const FavoritesProvider = ({ children }) => {
    const [state, dispatch] = useReducer(favoritesReducer, initialState);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const loadFavorites = () => {
            try {
                const savedFavorites = favoritesService.getFavorites();
                dispatch({
                    type: FAVORITES_ACTIONS.LOAD_FAVORITES,
                    payload: savedFavorites,
                });
            } catch (error) {
                console.error("Error loading favorites:", error);
                dispatch({
                    type: FAVORITES_ACTIONS.LOAD_FAVORITES,
                    payload: [],
                });
            }
        };

        loadFavorites();
    }, []);

    // Add a repository to favorites
    const addFavorite = (repo) => {
        try {
            // Check if already in favorites
            if (state.favorites.some((fav) => fav.id === repo.id)) {
                return false; // Already in favorites
            }

            const favoriteRepo = {
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                html_url: repo.html_url,
                clone_url: repo.clone_url,
                homepage: repo.homepage,
                language: repo.language,
                stargazers_count: repo.stargazers_count,
                forks_count: repo.forks_count,
                topics: repo.topics,
                created_at: repo.created_at,
                updated_at: repo.updated_at,
                owner: {
                    login: repo.owner.login,
                    avatar_url: repo.owner.avatar_url,
                    html_url: repo.owner.html_url,
                },
                added_at: new Date().toISOString(), // Track when it was favorited
            };

            favoritesService.addFavorite(favoriteRepo);
            dispatch({
                type: FAVORITES_ACTIONS.ADD_FAVORITE,
                payload: favoriteRepo,
            });
            return true;
        } catch (error) {
            console.error("Error adding favorite:", error);
            return false;
        }
    };

    // Remove a repository from favorites
    const removeFavorite = (repoId) => {
        try {
            favoritesService.removeFavorite(repoId);
            dispatch({
                type: FAVORITES_ACTIONS.REMOVE_FAVORITE,
                payload: repoId,
            });
            return true;
        } catch (error) {
            console.error("Error removing favorite:", error);
            return false;
        }
    };

    // Check if a repository is in favorites
    const isFavorite = (repoId) => {
        return state.favorites.some((repo) => repo.id === repoId);
    };

    // Clear all favorites
    const clearFavorites = () => {
        try {
            favoritesService.clearFavorites();
            dispatch({
                type: FAVORITES_ACTIONS.CLEAR_FAVORITES,
            });
            return true;
        } catch (error) {
            console.error("Error clearing favorites:", error);
            return false;
        }
    };

    // Get favorites count
    const getFavoritesCount = () => {
        return state.favorites.length;
    };

    // Get favorites by language
    const getFavoritesByLanguage = (language) => {
        return state.favorites.filter((repo) => repo.language === language);
    };

    // Get recent favorites
    const getRecentFavorites = (limit = 5) => {
        return state.favorites
            .sort((a, b) => new Date(b.added_at) - new Date(a.added_at))
            .slice(0, limit);
    };

    const value = {
        favorites: state.favorites,
        isLoading: state.isLoading,
        addFavorite,
        removeFavorite,
        isFavorite,
        clearFavorites,
        getFavoritesCount,
        getFavoritesByLanguage,
        getRecentFavorites,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};

export default FavoritesContext;
