"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FavoritesPage from "@/components/Favorites/FavoritesPage";
import {
    SkipLink,
    FocusIndicator,
    ScrollToTop,
    KeyboardShortcuts,
} from "@/utils/Accessibility/AccessibilityHelpers";

export default function Favorites() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* Skip Links */}
            <SkipLink href="#main-content">Skip to main content</SkipLink>
            <SkipLink href="#favorites-content">Skip to favorites</SkipLink>

            {/* Focus and Accessibility Indicators */}
            <FocusIndicator />
            <KeyboardShortcuts />

            <Navbar />

            <main id="main-content" tabIndex="-1" className="outline-none">
                <div id="favorites-content">
                    <FavoritesPage />
                </div>
            </main>

            {/* Accessibility Helpers */}
            <ScrollToTop />

            <Footer />
        </div>
    );
}
