"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import {
    Download,
    ContentCopy,
    GetApp,
    FolderZip,
    Terminal,
    CloudDownload,
    Code,
    FileCopy,
    OpenInNew,
    Close,
} from "@mui/icons-material";
import { toast } from "react-toastify";

/**
 * Repository Clone/Download Helper Component
 * Provides comprehensive options for cloning and downloading repositories
 */
const RepositoryCloneHelper = ({ repo, className = "" }) => {
    const [showModal, setShowModal] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [activeTab, setActiveTab] = useState("clone");
    const modalRef = useRef(null);

    // Close modal when clicking outside or pressing Escape
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setShowModal(false);
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === "Escape") {
                setShowModal(false);
            }
        };

        if (showModal) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscapeKey);
            // Prevent background scrolling
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscapeKey);
            document.body.style.overflow = "unset";
        };
    }, [showModal]);

    // Copy text to clipboard with feedback
    const copyToClipboard = useCallback(async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(`${type} copied to clipboard!`);
        } catch (err) {
            toast.error("Failed to copy to clipboard");
            console.error("Clipboard error:", err);
        }
    }, []);

    // Download repository as ZIP
    const downloadZip = useCallback(async () => {
        setDownloading(true);

        try {
            const zipUrl = `${repo.html_url}/archive/refs/heads/${
                repo.default_branch || "main"
            }.zip`;

            // Create a temporary link to trigger download
            const link = document.createElement("a");
            link.href = zipUrl;
            link.download = `${repo.name}-${repo.default_branch || "main"}.zip`;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Downloading ${repo.name} as ZIP...`);
            setShowModal(false);
        } catch (err) {
            toast.error("Failed to download repository");
            console.error("Download error:", err);
        } finally {
            setTimeout(() => setDownloading(false), 2000);
        }
    }, [repo]);

    // Generate clone commands
    const getCloneCommands = useCallback(() => {
        return {
            https: `git clone ${repo.clone_url}`,
            ssh: `git clone ${repo.ssh_url}`,
            gh: `gh repo clone ${repo.full_name}`,
            degit: `npx degit ${repo.full_name}`,
        };
    }, [repo]);

    // Generate download commands
    const getDownloadCommands = useCallback(() => {
        return {
            curl: `curl -L ${repo.html_url}/archive/refs/heads/${
                repo.default_branch || "main"
            }.zip -o ${repo.name}.zip`,
            wget: `wget ${repo.html_url}/archive/refs/heads/${
                repo.default_branch || "main"
            }.zip -O ${repo.name}.zip`,
        };
    }, [repo]);

    const cloneCommands = getCloneCommands();
    const downloadCommands = getDownloadCommands();

    return (
        <>
            {/* Clone/Download Button */}
            <button
                onClick={() => setShowModal(true)}
                disabled={downloading}
                className={`flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-md ${className}`}
            >
                {downloading ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Downloading...
                    </>
                ) : (
                    <>
                        <Download className="w-4 h-4 mr-2" />
                        Clone/Download
                    </>
                )}
            </button>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Clone/Download Repository
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {repo.full_name}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            >
                                <Close className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <div className="flex">
                                <button
                                    onClick={() => setActiveTab("clone")}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "clone"
                                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                                >
                                    <Code className="w-5 h-5 inline mr-2" />
                                    Clone Repository
                                </button>
                                <button
                                    onClick={() => setActiveTab("download")}
                                    className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                                        activeTab === "download"
                                            ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                                            : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    }`}
                                >
                                    <CloudDownload className="w-5 h-5 inline mr-2" />
                                    Download Files
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {/* Clone Tab */}
                            {activeTab === "clone" && (
                                <div className="space-y-6">
                                    {/* HTTPS Clone */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            HTTPS (Recommended)
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={repo.clone_url}
                                                readOnly
                                                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 font-mono"
                                            />
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        repo.clone_url,
                                                        "HTTPS URL"
                                                    )
                                                }
                                                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                                                title="Copy HTTPS URL"
                                            >
                                                <ContentCopy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    cloneCommands.https,
                                                    "HTTPS clone command"
                                                )
                                            }
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <Terminal className="w-5 h-5 mr-3 text-blue-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    Copy clone command
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                                                    {cloneCommands.https}
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* SSH Clone */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            SSH
                                        </label>
                                        <div className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                value={repo.ssh_url}
                                                readOnly
                                                className="flex-1 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-900 dark:text-gray-100 font-mono"
                                            />
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        repo.ssh_url,
                                                        "SSH URL"
                                                    )
                                                }
                                                className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                                                title="Copy SSH URL"
                                            >
                                                <ContentCopy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    cloneCommands.ssh,
                                                    "SSH clone command"
                                                )
                                            }
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <Terminal className="w-5 h-5 mr-3 text-purple-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    Copy SSH clone command
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                                                    {cloneCommands.ssh}
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* GitHub CLI */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            GitHub CLI
                                        </label>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    cloneCommands.gh,
                                                    "GitHub CLI command"
                                                )
                                            }
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <Terminal className="w-5 h-5 mr-3 text-green-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    Copy GitHub CLI command
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                                                    {cloneCommands.gh}
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Degit (for templates) */}
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Degit (Template Mode)
                                        </label>
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    cloneCommands.degit,
                                                    "Degit command"
                                                )
                                            }
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <Terminal className="w-5 h-5 mr-3 text-orange-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    Copy degit command
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                                                    {cloneCommands.degit}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Download Tab */}
                            {activeTab === "download" && (
                                <div className="space-y-6">
                                    {/* ZIP Download */}
                                    <div className="space-y-3">
                                        <button
                                            onClick={downloadZip}
                                            disabled={downloading}
                                            className="w-full flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 shadow-md"
                                        >
                                            <FolderZip className="w-6 h-6 mr-3" />
                                            <div className="flex-1 text-left">
                                                <div className="font-medium text-lg">
                                                    Download ZIP
                                                </div>
                                                <div className="text-sm opacity-90">
                                                    Source code as compressed
                                                    file
                                                </div>
                                            </div>
                                            <GetApp className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Command Line Downloads */}
                                    <div className="space-y-4">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                                            Command Line Downloads
                                        </div>

                                        {/* cURL */}
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    downloadCommands.curl,
                                                    "cURL download command"
                                                )
                                            }
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <Terminal className="w-5 h-5 mr-3 text-green-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    cURL command
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all mt-1">
                                                    {downloadCommands.curl}
                                                </div>
                                            </div>
                                        </button>

                                        {/* wget */}
                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    downloadCommands.wget,
                                                    "wget download command"
                                                )
                                            }
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <Terminal className="w-5 h-5 mr-3 text-blue-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    wget command
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all mt-1">
                                                    {downloadCommands.wget}
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Direct Links */}
                                    <div className="space-y-4">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600 pb-2">
                                            Direct Links
                                        </div>

                                        <a
                                            href={`${
                                                repo.html_url
                                            }/archive/refs/heads/${
                                                repo.default_branch || "main"
                                            }.zip`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <OpenInNew className="w-5 h-5 mr-3 text-indigo-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    Open ZIP download link
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    Direct browser download
                                                </div>
                                            </div>
                                        </a>

                                        <button
                                            onClick={() =>
                                                copyToClipboard(
                                                    `${
                                                        repo.html_url
                                                    }/archive/refs/heads/${
                                                        repo.default_branch ||
                                                        "main"
                                                    }.zip`,
                                                    "Download URL"
                                                )
                                            }
                                            className="w-full flex items-center px-4 py-3 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600"
                                        >
                                            <FileCopy className="w-5 h-5 mr-3 text-orange-500" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    Copy download URL
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 break-all mt-1">
                                                    {`${
                                                        repo.html_url
                                                    }/archive/refs/heads/${
                                                        repo.default_branch ||
                                                        "main"
                                                    }.zip`}
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 dark:border-gray-600 px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <span className="font-medium">
                                            Branch:
                                        </span>
                                        <div>
                                            {repo.default_branch || "main"}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Size:
                                        </span>
                                        <div>
                                            {repo.size
                                                ? `${(repo.size / 1024).toFixed(
                                                      1
                                                  )} MB`
                                                : "Unknown"}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Language:
                                        </span>
                                        <div>
                                            {repo.language || "Not specified"}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Updated:
                                        </span>
                                        <div>
                                            {new Date(
                                                repo.updated_at
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default RepositoryCloneHelper;
