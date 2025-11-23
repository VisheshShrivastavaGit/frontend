import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { get, post, put, del } from "../api";
import { useDemo } from "./DemoProvider";

const AppContext = createContext(null);

export function useApp() {
    return useContext(AppContext);
}

// Separate hook for auth-specific functionality
export function useAuth() {
    const context = useContext(AppContext);
    return {
        user: context.user,
        loading: context.loading,
        handleLogout: context.handleLogout,
        isDemoMode: context.isDemoMode,
    };
}

// Separate hook for data-specific functionality  
export function useData() {
    const context = useContext(AppContext);
    return {
        courses: context.courses,
        loading: context.dataLoading,
        error: context.error,
        load: context.load,
        createCourse: context.createCourse,
        updateCourse: context.updateCourse,
        deleteCourse: context.deleteCourse,
        deleteAll: context.deleteAll,
        resetAllStats: context.resetAllStats,
        getCourse: context.getCourse,
        resetCourse: context.resetCourse,
        searchedCourses: context.searchedCourses,
        changeSearch: context.changeSearch,
    };
}

function LoginButton({ onSuccess }) {
    const login = useGoogleLogin({
        onSuccess: onSuccess,
        flow: "auth-code",
        scope: "openid email profile https://www.googleapis.com/auth/calendar",
        onError: () => console.log("Login Failed"),
    });

    return (
        <button
            onClick={() => login()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
            Sign in with Google
        </button>
    );
}

function AppProviderInner({ children }) {
    // Auth state
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Data state
    const [courses, setCourses] = useState([]);
    const [searchedCourses, setSearchedCourses] = useState("");
    const [dataLoading, setDataLoading] = useState(false);
    const [error, setError] = useState(null);

    const demo = useDemo();
    const backendUrl = import.meta.env.VITE_API_URL || "";
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

    // Check if user is already logged in
    React.useEffect(() => {
        // If demo mode is active, use demo user
        if (demo?.isDemoMode) {
            setUser(demo.getDemoUser());
            setLoading(false);
            return;
        }

        // Check if user is already logged in by calling a protected endpoint
        fetch(backendUrl + "/auth/me", {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.ok && data.user) {
                    setUser(data.user);
                }
            })
            .catch(() => {
                // Not logged in or error
            })
            .finally(() => {
                setLoading(false);
            });
    }, [backendUrl, demo?.isDemoMode]);

    // Load courses when user changes
    const load = useCallback(async () => {
        if (!user) return [];
        setDataLoading(true);
        setError(null);
        try {
            // If in demo mode, load from localStorage
            if (demo?.isDemoMode) {
                const demoCourses = demo.getDemoCourses();
                setCourses(demoCourses);
                return demoCourses;
            }

            const res = await get(`/attendance/${user.id}`);
            const list = res?.data || [];
            setCourses(list);
            return list;
        } catch (e) {
            setError(e.message || "Failed to load");
            return [];
        } finally {
            setDataLoading(false);
        }
    }, [user, demo?.isDemoMode, demo]);

    React.useEffect(() => {
        if (user) load();
    }, [load, user]);

    // Auth handlers
    async function handleLoginSuccess(codeResponse) {
        setLoading(true);
        const { code } = codeResponse;
        try {
            const res = await fetch(backendUrl + "/auth/google", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ code }),
            });
            const data = await res.json();
            if (data.ok && data.user) {
                setUser(data.user);
            } else {
                console.error("Login failed:", data.error);
            }
        } catch (e) {
            console.error("Login error:", e);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function handleLogout() {
        if (demo?.isDemoMode) {
            demo.exitDemo();
            return;
        }

        try {
            await fetch(backendUrl + "/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } catch (e) {
            console.error("Logout error:", e);
        }
        setUser(null);
    }

    function handleDemoLogin() {
        demo.enterDemo();
        setUser(demo.getDemoUser());
    }

    // Data handlers
    function changeSearch(query) {
        setSearchedCourses(query);
    }

    async function createCourse(payload) {
        if (!payload || typeof payload !== "object") {
            throw new Error("Invalid payload for creating course");
        } else if (courses.some((c) => c.IndivCourse === payload.IndivCourse))
            throw new Error("Course with the same name already exists");

        try {
            if (demo?.isDemoMode) {
                const created = demo.addDemoCourse(payload);
                setCourses((c) => [created, ...c]);
                return created;
            }

            const res = await post(`/attendance/${user.id}`, payload);
            const created = res?.data;
            if (created) setCourses((c) => [created, ...c]);
            return created;
        } catch (e) {
            setError(e?.message || "Failed to create course");
            throw e;
        }
    }

    async function updateCourse(id, payload) {
        try {
            if (demo?.isDemoMode) {
                const updated = demo.updateDemoCourse(id, payload);
                setCourses((c) => c.map((x) => (x.id === updated.id ? updated : x)));
                return updated;
            }

            const res = await put(`/attendance/${user.id}/${id}`, payload);
            const updated = res?.data;
            if (updated)
                setCourses((c) => c.map((x) => (x.id === updated.id ? updated : x)));
            return updated;
        } catch (e) {
            throw e;
        }
    }

    async function deleteCourse(id) {
        try {
            if (demo?.isDemoMode) {
                demo.deleteDemoCourse(id);
                setCourses((c) => c.filter((x) => x.id !== id));
                return true;
            }

            await del(`/attendance/${user.id}/${id}`);
            setCourses((c) => c.filter((x) => x.id !== id));
            return true;
        } catch (e) {
            throw e;
        }
    }

    async function deleteAll() {
        try {
            if (demo?.isDemoMode) {
                demo.deleteAllDemoCourses();
                setCourses([]);
                return true;
            }

            await del(`/attendance/${user.id}`);
            setCourses([]);
            return true;
        } catch (e) {
            throw e;
        }
    }

    async function resetAllStats() {
        try {
            if (demo?.isDemoMode) {
                demo.resetAllDemoStats();
                setCourses((prev) =>
                    prev.map((c) => ({ ...c, present: 0, absent: 0, cancelled: 0 }))
                );
                return true;
            }

            await post(`/attendance/${user.id}/reset`, {});
            setCourses((prev) =>
                prev.map((c) => ({ ...c, present: 0, absent: 0, cancelled: 0 }))
            );
            return true;
        } catch (e) {
            throw e;
        }
    }

    async function getCourse(id) {
        try {
            const found = courses.find((c) => Number(c.id) === Number(id));
            if (found) return found;

            if (demo?.isDemoMode) {
                return null;
            }

            const res = await get(`/attendance/${user.id}/${id}`);
            const data = res?.data;
            if (data) setCourses((c) => [data, ...c]);
            return data;
        } catch (e) {
            throw e;
        }
    }

    async function resetCourse(id) {
        try {
            if (demo?.isDemoMode) {
                const updated = demo.resetDemoCourseStats(id);
                setCourses((c) => c.map((x) => (x.id === updated.id ? updated : x)));
                return updated;
            }

            const res = await post(`/attendance/${user.id}/${id}/reset`, {});
            const updated = res?.data;
            if (updated) {
                setCourses((c) => c.map((x) => (x.id === updated.id ? updated : x)));
            }
            return updated;
        } catch (e) {
            throw e;
        }
    }

    const value = useMemo(
        () => ({
            // Auth
            user,
            loading,
            handleLogout,
            isDemoMode: demo?.isDemoMode,
            // Data
            courses,
            dataLoading,
            error,
            load,
            createCourse,
            updateCourse,
            deleteCourse,
            deleteAll,
            resetAllStats,
            getCourse,
            resetCourse,
            searchedCourses,
            changeSearch,
        }),
        [user, loading, courses, dataLoading, error, searchedCourses, demo?.isDemoMode, load]
    );

    return (
        <AppContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
                    Loading...
                </div>
            ) : user ? (
                children
            ) : (
                <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 bg-gray-900">
                    <div className="text-center mb-4">
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Attendance Tracker
                        </h1>
                        <p className="text-gray-300">
                            Track your attendance with ease
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-xs">
                        <LoginButton onSuccess={handleLoginSuccess} />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-900 text-gray-500">
                                    or
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleDemoLogin}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <span>🎯</span>
                            Try Demo Mode
                        </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-4 text-center max-w-xs">
                        Demo mode lets you explore the app without signing in. Your data
                        will be stored locally in your browser.
                    </p>
                </div>
            )}
        </AppContext.Provider>
    );
}

export default function AppProvider({ children }) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <AppProviderInner>{children}</AppProviderInner>
        </GoogleOAuthProvider>
    );
}
