import React from "react";
import { useData } from "../contexts/AppProvider";
export default function Searchbar() {
  const { searchedCourses, changeSearch } = useData();
  return (
    <input
      type="text"
      value={searchedCourses}
      onChange={(e) => changeSearch(String(e.target.value))}
      placeholder="Search..."
      className="w-full text-sm font-medium text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2"
    />
  );
}
