export const apiUrl = import.meta.env.VITE_API_URL || "";

export async function get(path) {
  const base = apiUrl;
  const url = base ? `${base}${path}` : path;
  return fetchWithError(url, { credentials: "include" });
}

export async function fetchWithError(url, options = {}) {
  // Always include credentials to send cookies
  const finalOptions = {
    ...options,
    credentials: "include", // <--- THIS IS THE CRITICAL FIX
    headers: {
      ...options.headers,
      // Ensure we accept JSON
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

  // Try parse JSON if any
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
    
    // Special handling for 401 to help debug
    if (res.status === 401) {
        console.error("API 401 Unauthorized - Cookie might be missing");
    }

    throw new Error(
      `Request failed ${res.status} ${res.statusText}: ${bodyMsg}`
    );
  }

  // Successful response
  if (data !== null) return data;
  // If no JSON, return raw text
  return text;
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
  return fetchWithError(url, { method: "DELETE", credentials: "include" });
}