import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import CourseForm from "./pages/CourseForm";
import CourseDetail from "./pages/CourseDetail";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Nested Courses Routes */}
        <Route path="/courses">
          <Route index element={<Courses />} />
          <Route path="new" element={<CourseForm />} />
          <Route path=":id" element={<CourseDetail />} />
          <Route path=":id/edit" element={<CourseForm />} />
        </Route>

        <Route path="/attendance" element={<Attendance />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MainLayout>
  );
}
