"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const AccessibilityContext = createContext();

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (!context) {
        throw new Error(
            "useAccessibility must be used within an AccessibilityProvider"
        );
    }
    return context;
};

export const AccessibilityProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        highContrast: false,
        reducedMotion: false,
        fontSize: "normal", // small, normal, large, extra-large
        keyboardNavigation: true,
        screenReaderMode: false,
    });

    const [focusVisible, setFocusVisible] = useState(false);
    const [announcements, setAnnouncements] = useState([]);

    // Load accessibility settings from localStorage
    useEffect(() => {
        const savedSettings = localStorage.getItem("accessibility-settings");
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }

        // Detect if user prefers reduced motion
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setSettings((prev) => ({ ...prev, reducedMotion: true }));
        }

        // Detect if user prefers high contrast
        if (window.matchMedia("(prefers-contrast: high)").matches) {
            setSettings((prev) => ({ ...prev, highContrast: true }));
        }
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(
            "accessibility-settings",
            JSON.stringify(settings)
        );

        // Apply settings to document
        document.documentElement.setAttribute(
            "data-font-size",
            settings.fontSize
        );
        document.documentElement.setAttribute(
            "data-high-contrast",
            settings.highContrast
        );
        document.documentElement.setAttribute(
            "data-reduced-motion",
            settings.reducedMotion
        );
    }, [settings]);

    // Keyboard navigation detection
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Tab") {
                setFocusVisible(true);
            }
        };

        const handleMouseDown = () => {
            setFocusVisible(false);
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleMouseDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleMouseDown);
        };
    }, []);

    const updateSetting = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const announce = (message, priority = "polite") => {
        const announcement = {
            id: Date.now(),
            message,
            priority,
            timestamp: new Date(),
        };

        setAnnouncements((prev) => [...prev, announcement]);

        // Remove announcement after 5 seconds
        setTimeout(() => {
            setAnnouncements((prev) =>
                prev.filter((a) => a.id !== announcement.id)
            );
        }, 5000);
    };

    const skipToMain = () => {
        const mainContent = document.getElementById("main-content");
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: "smooth" });
        }
    };

    const value = {
        settings,
        updateSetting,
        focusVisible,
        announce,
        skipToMain,
        announcements,
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}

            {/* Screen Reader Announcements */}
            <div
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
                role="status"
            >
                {announcements
                    .filter((a) => a.priority === "polite")
                    .slice(-1)
                    .map((a) => (
                        <div key={a.id}>{a.message}</div>
                    ))}
            </div>

            <div
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
                role="alert"
            >
                {announcements
                    .filter((a) => a.priority === "assertive")
                    .slice(-1)
                    .map((a) => (
                        <div key={a.id}>{a.message}</div>
                    ))}
            </div>
        </AccessibilityContext.Provider>
    );
};
