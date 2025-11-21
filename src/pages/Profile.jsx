import React from "react";
import { useEffect, useState } from "react";
import { get } from "../api";
import { useGoogleAuth } from "../contexts/GoogleAuthProvider";
import { useData } from "../contexts/DataProvider";

export default function Profile() {
  // const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useGoogleAuth();
  const { courses } = useData();

  // useEffect(() => {
  //   setLoading(true);
  //   get(`/auth/${userInfo.email_address}`)
  //     .then((res) => {
  //       setUser(res?.user);
  //       setError(null);
  //     })
  //     .catch((err) => {
  //       setError(err?.message || "Failed to load profile");
  //     })
  //     .finally(() => setLoading(false));
  // }, []);

  if (!user)
    return (
      <div className="mt-6 text-gray-600 dark:text-gray-300">
        No user found.
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <img
          src={
            user.image ||
            "https://ui-avatars.com/api/?name=" +
              (user.name || user.user_name || "User")
          }
          alt="Profile"
          className="h-20 w-20 rounded-full border"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name || user.user_name || "User"}
          </h2>
          <div className="text-gray-500 dark:text-gray-400">
            {user.email_address}
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <ProfilePair title="Email" value={user.email_address} />
        <ProfilePair title="Name" value={user.name} />
        <ProfilePair title="Username" value={user.user_name} />
        <ProfilePair title="Verified" value={user.verified ? "Yes" : "No"} />
      </div>
    </div>
  );
}

function ProfilePair({ title, value }) {
  if (!value) return null;
  return (
    <div className="border w-full rounded-xl p-3 flex gap-5 justify-center items-center">
      <span className="break-words whitespace-nowrap w-1/4 font-semibold text-gray-700 dark:text-gray-300">
        {title}
      </span>
      <span className="w-3/4 text-[0.95rem] md:text-md truncate overflow-hidden text-gray-900 dark:text-white">
        {value}
      </span>
    </div>
  );
}
