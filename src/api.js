export const apiUrl = import.meta.env.VITE_API_URL || "";

// Helper function to handle fetch with common options and error handling
export async function fetchWithError(url, options = {}) {
  // CRITICAL: Always include credentials to send cookies (sessionToken) cross-origin
  const finalOptions = {
    ...options,
    credentials: "include", 
    headers: {
      ...options.headers,
      "Accept": "application/json",
    },
  };

  const res = await fetch(url, finalOptions);
  
  let text;
  try {
    text = await res.text();
  } catch (e) {
    text = "";
  }

  // Try parsing JSON
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = null;
    }
  }

  if (!res.ok) {
    const bodyMsg =
      data && (data.error || data.message)
        ? data.error || data.message
        : text
          ? text
          : "No response body";
    
    // Log 401 errors for debugging
    if (res.status === 401) {
        console.error("API 401 Unauthorized - Cookie likely missing or blocked by browser privacy settings.");
    }

    throw new Error(
      `Request failed ${res.status} ${res.statusText}: ${bodyMsg}`
    );
  }

  // Successful response
  if (data !== null) return data;
  return text;
}

// --- EXPORTED API METHODS ---

export async function get(path) {
  const base = apiUrl;
  const url = base ? `${base}${path}` : path;
  // Pass credentials: "include" explicitly, though fetchWithError handles it
  return fetchWithError(url, { method: "GET", credentials: "include" });
}

export async function post(path, body) {
  const base = apiUrl;
  const url = base ? `${base}${path}` : path;
  return fetchWithError(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include" 
    }
  );
}

export async function put(path, body) {
  const base = apiUrl;
  const url = base ? `${base}${path}` : path;
  return fetchWithError(
    url,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include" 
    }
  );
}

export async function del(path) {
  const base = apiUrl;
  const url = base ? `${base}${path}` : path;
  return fetchWithError(url, { 
    method: "DELETE", 
    credentials: "include" 
  });
}