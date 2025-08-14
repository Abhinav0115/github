"use client";
import React from "react";
import { FaArrowUp } from "react-icons/fa";
import { useAccessibility } from "@/utils/Accessibility/AccessibilityProvider";

const SkipLink = ({ href, children }) => {
    const { announce } = useAccessibility();

    const handleClick = (e) => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.focus();
            target.scrollIntoView({ behavior: "smooth" });
            announce(`Navigated to ${children}`, "polite");
        }
    };

    return (
        <a
            href={href}
            onClick={handleClick}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
        >
            {children}
        </a>
    );
};

const FocusIndicator = () => {
    const { settings, focusVisible } = useAccessibility();

    if (!settings.keyboardNavigation || !focusVisible) return null;

    return (
        <style jsx global>{`
            [data-focus-visible="true"] *:focus {
                outline: 3px solid #3b82f6 !important;
                outline-offset: 2px !important;
            }

            [data-high-contrast="true"] {
                filter: contrast(200%) !important;
            }

            [data-reduced-motion="true"] * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }

            [data-font-size="small"] {
                font-size: 14px !important;
            }

            [data-font-size="large"] {
                font-size: 18px !important;
            }

            [data-font-size="extra-large"] {
                font-size: 20px !important;
            }
        `}</style>
    );
};

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = React.useState(false);
    const { announce, settings } = useAccessibility();

    React.useEffect(() => {
        const toggleVisibility = () => {
            if (window.pageYOffset > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: settings.reducedMotion ? "auto" : "smooth",
        });
        announce("Scrolled to top of page", "polite");
    };

    if (!isVisible) return null;

    return (
        <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-110"
            aria-label="Scroll to top of page"
            title="Scroll to top"
        >
            <FaArrowUp className="h-5 w-5" />
        </button>
    );
};

const KeyboardShortcuts = () => {
    const { settings, skipToMain, announce } = useAccessibility();
    const [showHelp, setShowHelp] = React.useState(false);

    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (!settings.keyboardNavigation) return;

            // Show keyboard shortcuts help
            if (e.key === "?" && e.shiftKey) {
                e.preventDefault();
                setShowHelp(!showHelp);
                announce(
                    showHelp
                        ? "Keyboard shortcuts hidden"
                        : "Keyboard shortcuts displayed",
                    "polite"
                );
            }

            // Focus search
            if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
                e.preventDefault();
                const searchInput =
                    document.querySelector('input[type="text"]') ||
                    document.getElementById("search-input");
                if (searchInput) {
                    searchInput.focus();
                    announce("Focused search input", "polite");
                }
            }

            // Navigate to favorites with Alt + F
            if (e.key === "f" && e.altKey) {
                e.preventDefault();
                if (!window.location.pathname.includes("/favorites")) {
                    window.location.href = "/favorites";
                    announce("Navigating to favorites page", "polite");
                }
            }

            // Navigate to home with Alt + H
            if (e.key === "h" && e.altKey) {
                e.preventDefault();
                if (window.location.pathname !== "/") {
                    window.location.href = "/";
                    announce("Navigating to home page", "polite");
                }
            }

            // Skip to main content
            if (e.key === "m" && e.altKey) {
                e.preventDefault();
                skipToMain();
            }

            // Close modals with Escape
            if (e.key === "Escape") {
                setShowHelp(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [settings.keyboardNavigation, showHelp, skipToMain, announce]);

    if (!showHelp) return null;

    const shortcuts = [
        { key: "/", description: "Focus search input" },
        { key: "Alt + M", description: "Skip to main content" },
        { key: "Alt + F", description: "Go to favorites page" },
        { key: "Alt + H", description: "Go to home page" },
        { key: "Tab", description: "Navigate between elements" },
        { key: "Enter", description: "Activate buttons and links" },
        { key: "Space", description: "Activate buttons" },
        { key: "Escape", description: "Close modals and dialogs" },
        { key: "Shift + ?", description: "Show/hide this help" },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Keyboard Shortcuts
                        </h3>
                        <button
                            onClick={() => setShowHelp(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label="Close keyboard shortcuts help"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="space-y-3">
                        {shortcuts.map((shortcut, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between"
                            >
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {shortcut.description}
                                </span>
                                <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded">
                                    {shortcut.key}
                                </kbd>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export { SkipLink, FocusIndicator, ScrollToTop, KeyboardShortcuts };
