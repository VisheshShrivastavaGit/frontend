import React from "react";
import { useAuth, useData } from "../contexts/AppProvider";

export default function Profile() {
  const { user } = useAuth();
  const { courses } = useData();


  if (!user)
    return (
      <div className="mt-6 text-gray-300">
        No user found.
      </div>
    );

  return (
    <div className="max-w-lg mx-auto p-6 rounded-lg bg-gray-800 border border-gray-700 mt-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
          {(user.name || user.user_name || "U")[0].toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {user.name || user.user_name || "User"}
          </h2>
          <div className="text-gray-400">
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
      <span className="break-words whitespace-nowrap w-1/4 font-semibold text-gray-300">
        {title}
      </span>
      <span className="w-3/4 text-[0.95rem] md:text-md truncate overflow-hidden text-white">
        {value}
      </span>
    </div>
  );
}
