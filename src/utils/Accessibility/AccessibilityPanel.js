"use client";
import React from "react";
import { useAccessibility } from "@/utils/Accessibility/AccessibilityProvider";
import {
    FaUniversalAccess,
    FaEye,
    FaKeyboard,
    FaTextHeight,
    FaPalette,
    FaVolumeUp,
} from "react-icons/fa";

const AccessibilityPanel = ({ isOpen, onClose }) => {
    const { settings, updateSetting, announce } = useAccessibility();

    const handleSettingChange = (key, value) => {
        updateSetting(key, value);
        announce(`${key} ${value ? "enabled" : "disabled"}`, "polite");
    };

    const fontSizeOptions = [
        { value: "small", label: "Small", size: "14px" },
        { value: "normal", label: "Normal", size: "16px" },
        { value: "large", label: "Large", size: "18px" },
        { value: "extra-large", label: "Extra Large", size: "20px" },
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
                role="dialog"
                aria-labelledby="accessibility-title"
                aria-describedby="accessibility-description"
            >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaUniversalAccess className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <h2
                                id="accessibility-title"
                                className="text-xl font-bold text-gray-900 dark:text-white"
                            >
                                Accessibility Settings
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            aria-label="Close accessibility panel"
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
                    <p
                        id="accessibility-description"
                        className="text-sm text-gray-600 dark:text-gray-400 mt-2"
                    >
                        Customize the interface to meet your accessibility needs
                    </p>
                </div>

                {/* Settings */}
                <div className="p-6 space-y-6">
                    {/* High Contrast */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaPalette className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <div>
                                <label
                                    htmlFor="high-contrast"
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    High Contrast
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Increase contrast for better visibility
                                </p>
                            </div>
                        </div>
                        <button
                            id="high-contrast"
                            role="switch"
                            aria-checked={settings.highContrast}
                            onClick={() =>
                                handleSettingChange(
                                    "highContrast",
                                    !settings.highContrast
                                )
                            }
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                settings.highContrast
                                    ? "bg-blue-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    settings.highContrast
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Reduced Motion */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaEye className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <div>
                                <label
                                    htmlFor="reduced-motion"
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Reduced Motion
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Minimize animations and transitions
                                </p>
                            </div>
                        </div>
                        <button
                            id="reduced-motion"
                            role="switch"
                            aria-checked={settings.reducedMotion}
                            onClick={() =>
                                handleSettingChange(
                                    "reducedMotion",
                                    !settings.reducedMotion
                                )
                            }
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                settings.reducedMotion
                                    ? "bg-blue-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    settings.reducedMotion
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Font Size */}
                    <div>
                        <div className="flex items-center space-x-3 mb-3">
                            <FaTextHeight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <label className="text-sm font-medium text-gray-900 dark:text-white">
                                Font Size
                            </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {fontSizeOptions.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() =>
                                        handleSettingChange(
                                            "fontSize",
                                            option.value
                                        )
                                    }
                                    className={`p-3 text-center rounded-lg border-2 transition-colors ${
                                        settings.fontSize === option.value
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                                    }`}
                                    style={{ fontSize: option.size }}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Keyboard Navigation */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaKeyboard className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <div>
                                <label
                                    htmlFor="keyboard-nav"
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Enhanced Keyboard Navigation
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Show focus indicators and keyboard shortcuts
                                </p>
                            </div>
                        </div>
                        <button
                            id="keyboard-nav"
                            role="switch"
                            aria-checked={settings.keyboardNavigation}
                            onClick={() =>
                                handleSettingChange(
                                    "keyboardNavigation",
                                    !settings.keyboardNavigation
                                )
                            }
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                settings.keyboardNavigation
                                    ? "bg-blue-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    settings.keyboardNavigation
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Screen Reader Mode */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <FaVolumeUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                            <div>
                                <label
                                    htmlFor="screen-reader"
                                    className="text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Screen Reader Optimized
                                </label>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Enhanced announcements and descriptions
                                </p>
                            </div>
                        </div>
                        <button
                            id="screen-reader"
                            role="switch"
                            aria-checked={settings.screenReaderMode}
                            onClick={() =>
                                handleSettingChange(
                                    "screenReaderMode",
                                    !settings.screenReaderMode
                                )
                            }
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                settings.screenReaderMode
                                    ? "bg-blue-600"
                                    : "bg-gray-200 dark:bg-gray-700"
                            }`}
                        >
                            <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                    settings.screenReaderMode
                                        ? "translate-x-5"
                                        : "translate-x-0"
                                }`}
                            />
                        </button>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => {
                                const defaultSettings = {
                                    highContrast: false,
                                    reducedMotion: false,
                                    fontSize: "normal",
                                    keyboardNavigation: true,
                                    screenReaderMode: false,
                                };
                                Object.keys(defaultSettings).forEach((key) => {
                                    updateSetting(key, defaultSettings[key]);
                                });
                                announce(
                                    "Accessibility settings reset to default",
                                    "polite"
                                );
                            }}
                            className="w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                        >
                            Reset to Default
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessibilityPanel;
