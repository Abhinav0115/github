"use client";
import React, { useState } from "react";
import {
    Paper,
    Tabs,
    Tab,
    Box,
    Typography,
    Container,
    Fade,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Folder as RepositoriesIcon,
    Assessment as AnalyticsIcon,
    GitHub,
    TrendingUp,
} from "@mui/icons-material";
import Repo from "@/components/Repo/Repo";
import RepositoryAnalytics from "@/components/Analytics/RepositoryAnalytics";
import AnalyticsDashboard from "@/components/Analytics/AnalyticsDashboard";
import { styled } from "@mui/material/styles";

// Styled components for better visual appeal
const StyledPaper = styled(Paper, {
    shouldForwardProp: (prop) => prop !== "isDark",
})(({ theme, isDark }) => ({
    borderRadius: theme.spacing(2),
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    background: isDark
        ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important"
        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important",
    backgroundColor: isDark ? "#1e293b !important" : "#ffffff !important",
    border: isDark
        ? "1px solid rgba(255, 255, 255, 0.1)"
        : "1px solid rgba(0, 0, 0, 0.05)",
    // Force styles with higher specificity
    "&.MuiPaper-root": {
        background: isDark
            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important"
            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important",
        backgroundColor: isDark ? "#1e293b !important" : "#ffffff !important",
    },
}));

const StyledTabs = styled(Tabs, {
    shouldForwardProp: (prop) => prop !== "isDark",
})(({ theme, isDark }) => ({
    borderBottom: `1px solid ${
        isDark ? "rgba(255, 255, 255, 0.1)" : theme.palette.divider
    }`,
    background: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(248, 250, 252, 0.8)",
    backdropFilter: "blur(10px)",
    "& .MuiTabs-indicator": {
        height: 3,
        borderRadius: "3px 3px 0 0",
        background: "linear-gradient(45deg, #3b82f6, #2563eb)",
        boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
    },
}));

const StyledTab = styled(Tab, {
    shouldForwardProp: (prop) => prop !== "isDark",
})(({ theme, isDark }) => ({
    textTransform: "none",
    fontWeight: 600,
    fontSize: "16px",
    minHeight: 64,
    padding: theme.spacing(2, 3),
    color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
    "&.Mui-selected": {
        color: isDark ? "#3b82f6" : "#2563eb",
        fontWeight: 700,
    },
    "&:hover": {
        color: isDark ? "#60a5fa" : "#1d4ed8",
        background: isDark
            ? "rgba(59, 130, 246, 0.08)"
            : "rgba(37, 99, 235, 0.04)",
        transition: "all 0.2s ease-in-out",
    },
    "& .MuiTab-iconWrapper": {
        marginBottom: theme.spacing(0.5),
    },
}));

const TabPanel = ({ children, value, index, ...other }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`repository-tabpanel-${index}`}
            aria-labelledby={`repository-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Fade in={true} timeout={300}>
                    <Box>{children}</Box>
                </Fade>
            )}
        </div>
    );
};

const RepositoryDashboard = ({ repos_url, userName }) => {
    const [tabValue, setTabValue] = useState(0);
    const [repositoriesData, setRepositoriesData] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [renderKey, setRenderKey] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    // Detect dark mode from document class and localStorage (synced with Navbar)
    React.useEffect(() => {
        const checkDarkMode = () => {
            // Simple check: just look at the dark class on html element
            const isDark = document.documentElement.classList.contains("dark");

            // Only update if the value actually changed
            setIsDarkMode((prevMode) => {
                if (prevMode !== isDark) {
                   
                    setRenderKey((prev) => prev + 1); // Force re-render
                    return isDark;
                }
                return prevMode;
            });
        };

        // Initial check
        checkDarkMode();

        // Use MutationObserver to watch for class changes on html element
        const observer = new MutationObserver(() => {
            checkDarkMode();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleRepositoriesData = (data) => {
        setRepositoriesData(data);
    };

    const tabProps = (index) => ({
        id: `repository-tab-${index}`,
        "aria-controls": `repository-tabpanel-${index}`,
    });

    return (
        <div
            className="max-w-7xl mx-auto py-6 pb-2 px-1"
            style={{
                backgroundColor: "transparent",
                background: "transparent",
            }}
        >
            <StyledPaper
                elevation={0}
                isDark={isDarkMode}
                key={`dashboard-${isDarkMode}-${renderKey}`}
                sx={{
                    backgroundColor: isDarkMode
                        ? "#1e293b !important"
                        : "#ffffff !important",
                    background: isDarkMode
                        ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important"
                        : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important",
                    // Additional CSS specificity overrides
                    "&.MuiPaper-root": {
                        backgroundColor: isDarkMode
                            ? "#1e293b !important"
                            : "#ffffff !important",
                        background: isDarkMode
                            ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important"
                            : "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important",
                    },
                }}
            >
                {/* Header Section */}
                <Box
                    sx={{
                        p: 3,
                        paddingY: 1.5,
                        background: isDarkMode
                            ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)"
                            : "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)",
                        borderBottom: `1px solid ${
                            isDarkMode ? "rgba(255, 255, 255, 0.1)" : "#e5e7eb"
                        }`,
                        color: isDarkMode ? "#ffffff" : "#000000",
                    }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb={2}
                    >
                        <Box
                            sx={{
                                p: 1.5,
                                borderRadius: 2,
                                background:
                                    "linear-gradient(45deg, #3b82f6, #2563eb)",
                                color: "white",
                                mr: 2,
                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                            }}
                        >
                            <GitHub sx={{ fontSize: 28 }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    fontWeight: 700,
                                    background:
                                        "linear-gradient(45deg, #3b82f6, #2563eb)",
                                    backgroundClip: "text",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    mb: 0.5,
                                }}
                            >
                                Repository Dashboard
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    fontWeight: 500,
                                    color: isDarkMode
                                        ? "rgba(255, 255, 255, 0.7)"
                                        : "rgba(0, 0, 0, 0.7)",
                                }}
                            >
                                {userName
                                    ? `${userName}'s repositories`
                                    : "Explore repositories"}{" "}
                                with advanced analytics and insights
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Tabs Navigation */}
                <StyledTabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant={isMobile ? "fullWidth" : "standard"}
                    centered={!isMobile}
                    allowScrollButtonsMobile
                    isDark={isDarkMode}
                >
                    <StyledTab
                        icon={<RepositoriesIcon />}
                        iconPosition="top"
                        label="Repositories"
                        {...tabProps(0)}
                        isDark={isDarkMode}
                    />
                    <StyledTab
                        icon={<AnalyticsIcon />}
                        iconPosition="top"
                        label="Repository Analytics & Insights"
                        {...tabProps(1)}
                        isDark={isDarkMode}
                    />
                </StyledTabs>

                {/* Tab Content */}
                <Box
                    sx={{
                        minHeight: "500px",
                        backgroundColor: isDarkMode
                            ? "#0f172a !important"
                            : "#ffffff !important",
                        background: isDarkMode
                            ? "#0f172a !important"
                            : "#ffffff !important",
                    }}
                >
                    {/* Repositories Tab */}
                    <TabPanel value={tabValue} index={0}>
                        <Box sx={{ p: 3 }}>
                            <Box
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    borderRadius: 2,
                                    background: isDarkMode
                                        ? "rgba(30, 41, 59, 0.5)"
                                        : "rgba(248, 250, 252, 0.8)",
                                    border: `1px solid ${
                                        isDarkMode
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "#e5e7eb"
                                    }`,
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={1}>
                                    <RepositoriesIcon
                                        sx={{
                                            mr: 1,
                                            color: "primary.main",
                                            fontSize: 20,
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: isDarkMode
                                                ? "#ffffff"
                                                : "#000000",
                                        }}
                                    >
                                        Repository Explorer
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1.6,
                                        color: isDarkMode
                                            ? "rgba(255, 255, 255, 0.7)"
                                            : "rgba(0, 0, 0, 0.7)",
                                    }}
                                >
                                    Browse through repositories with advanced
                                    filtering, sorting, and search capabilities.
                                    Click the heart icon to add repositories to
                                    your favorites for quick access.
                                </Typography>
                            </Box>

                            <Repo
                                repos_url={repos_url}
                                onRepositoriesData={handleRepositoriesData}
                            />
                        </Box>
                    </TabPanel>

                    {/* Analytics Tab */}
                    <TabPanel value={tabValue} index={1}>
                        <Box sx={{ p: 3 }}>
                            <Box
                                sx={{
                                    mb: 3,
                                    p: 2,
                                    borderRadius: 2,
                                    background: isDarkMode
                                        ? "rgba(30, 41, 59, 0.5)"
                                        : "rgba(248, 250, 252, 0.8)",
                                    border: `1px solid ${
                                        isDarkMode
                                            ? "rgba(255, 255, 255, 0.1)"
                                            : "#e5e7eb"
                                    }`,
                                }}
                            >
                                <Box display="flex" alignItems="center" mb={1}>
                                    <TrendingUp
                                        sx={{
                                            mr: 1,
                                            color: "success.main",
                                            fontSize: 20,
                                        }}
                                    />
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 600,
                                            color: isDarkMode
                                                ? "#ffffff"
                                                : "#000000",
                                        }}
                                    >
                                        Repository Analytics & Insights
                                    </Typography>
                                </Box>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        lineHeight: 1.6,
                                        color: isDarkMode
                                            ? "rgba(255, 255, 255, 0.7)"
                                            : "rgba(0, 0, 0, 0.7)",
                                    }}
                                >
                                    Comprehensive analytics dashboard with
                                    interactive charts, insights, and
                                    performance metrics. Analyze language
                                    distribution, star trends, and repository
                                    activity patterns.
                                </Typography>
                            </Box>

                            {repositoriesData.length > 0 ? (
                                <Box sx={{ mt: 3 }}>
                                    {/* Analytics Dashboard */}
                                    <Box sx={{ mb: 4 }}>
                                        <AnalyticsDashboard
                                            repositories={repositoriesData}
                                        />
                                    </Box>

                                    {/* Detailed Analytics Charts */}
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            background: isDarkMode
                                                ? "rgba(15, 23, 42, 0.6)"
                                                : "rgba(255, 255, 255, 0.8)",
                                            border: `1px solid ${
                                                isDarkMode
                                                    ? "rgba(255, 255, 255, 0.1)"
                                                    : "#e5e7eb"
                                            }`,
                                            boxShadow:
                                                "0 2px 8px rgba(0, 0, 0, 0.04)",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                mb: 3,
                                                fontWeight: 600,
                                                display: "flex",
                                                alignItems: "center",
                                                color: isDarkMode
                                                    ? "#ffffff"
                                                    : "#000000",
                                            }}
                                        >
                                            <AnalyticsIcon
                                                sx={{
                                                    mr: 1,
                                                    color: "primary.main",
                                                }}
                                            />
                                            Detailed Analytics
                                        </Typography>
                                        <RepositoryAnalytics
                                            repositories={repositoriesData}
                                        />
                                    </Box>
                                </Box>
                            ) : (
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: 8,
                                        px: 4,
                                        borderRadius: 2,
                                        background: isDarkMode
                                            ? "rgba(30, 41, 59, 0.3)"
                                            : "rgba(248, 250, 252, 0.5)",
                                        border: `2px dashed ${
                                            isDarkMode
                                                ? "rgba(255, 255, 255, 0.2)"
                                                : "#e5e7eb"
                                        }`,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: "50%",
                                            background:
                                                "linear-gradient(45deg, #3b82f6, #2563eb)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            mx: "auto",
                                            mb: 3,
                                            boxShadow:
                                                "0 4px 20px rgba(59, 130, 246, 0.3)",
                                        }}
                                    >
                                        <AnalyticsIcon
                                            sx={{
                                                fontSize: 40,
                                                color: "white",
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            mb: 2,
                                            fontWeight: 600,
                                            color: isDarkMode
                                                ? "#ffffff"
                                                : "#000000",
                                        }}
                                    >
                                        No Repository Data Available
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 3,
                                            maxWidth: 400,
                                            mx: "auto",
                                            lineHeight: 1.6,
                                            color: isDarkMode
                                                ? "rgba(255, 255, 255, 0.7)"
                                                : "rgba(0, 0, 0, 0.7)",
                                        }}
                                    >
                                        Switch to the &quot;Repositories&quot; tab to load
                                        repository data, then return here to
                                        view comprehensive analytics and
                                        insights.
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            px: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            background: isDarkMode
                                                ? "rgba(59, 130, 246, 0.1)"
                                                : "rgba(59, 130, 246, 0.05)",
                                            border: `1px solid ${
                                                isDarkMode
                                                    ? "rgba(59, 130, 246, 0.3)"
                                                    : "rgba(59, 130, 246, 0.2)"
                                            }`,
                                        }}
                                    >
                                        <RepositoriesIcon
                                            sx={{
                                                mr: 1,
                                                color: "primary.main",
                                                fontSize: 18,
                                            }}
                                        />
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "primary.main",
                                                fontWeight: 500,
                                            }}
                                        >
                                            Load repositories first
                                        </Typography>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                    </TabPanel>
                </Box>
            </StyledPaper>
        </div>
    );
};

export default RepositoryDashboard;
