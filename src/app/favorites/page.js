"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FavoritesPage from "@/components/Favorites/FavoritesPage";

export default function Favorites() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            <Navbar />

            <main id="main-content" tabIndex="-1" className="outline-none">
                <div id="favorites-content">
                    <FavoritesPage />
                </div>
            </main>
            <Footer />
        </div>
    );
}
