import React from "react";
import { get, post, put, del } from "../api";
import { useGoogleAuth } from "./GoogleAuthProvider";

const DataContext = React.createContext(null);

export function useData() {
  return React.useContext(DataContext);
}

export default function DataProvider({ children }) {
  const [courses, setCourses] = React.useState([]);
  const [searchedCourses, setSearchedCourses] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const { user } = useGoogleAuth();

  const load = React.useCallback(async () => {
    console.log("Loading courses for user:", user);
    if (!user) return [];
    setLoading(true);
    setError(null);
    try {
      // Backend expects /attendance/:userId
      const res = await get(`/attendance/${user.id}`);
      const list = res?.data || [];
      setCourses(list);
      return list;
    } catch (e) {
      setError(e.message || "Failed to load");
      return [];
    } finally {
      setLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    if (user) load();
  }, [load, user]);

  // TODO : debounce for searching

  function changeSearch(query) {
    console.log(searchedCourses, "->", query);
    setSearchedCourses(query);
  }

  async function createCourse(payload) {
    if (!payload || typeof payload !== "object") {
      throw new Error("Invalid payload for creating course");
    } else if (courses.some((c) => c.IndivCourse === payload.IndivCourse))
      throw new Error("Course with the same name already exists");
    try {
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
      // Backend expects /attendance/:userId/:courseId
      const res = await put(`/attendance/${user.id}/${id}`, payload);
      console.log(payload, res);
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
      // Backend expects /attendance/:userId/:courseId
      await del(`/attendance/${user.id}/${id}`);
      setCourses((c) => c.filter((x) => x.id !== id));
      return true;
    } catch (e) {
      throw e;
    }
  }

  async function deleteAll() {
    try {
      // Backend expects /attendance/:userId
      await del(`/attendance/${user.id}`);
      setCourses([]);
      return true;
    } catch (e) {
      throw e;
    }
  }

  async function resetAllStats() {
    try {
      // Backend expects /attendance/:userId/reset
      await post(`/attendance/${user.id}/reset`, {});
      // Reset stats locally
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
      // Backend expects /attendance/:userId/:courseId
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
      // Backend expects /attendance/:userId/:courseId/reset
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

  const value = React.useMemo(
    () => ({
      courses,
      loading,
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
    [courses, loading, error, load, searchedCourses]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
