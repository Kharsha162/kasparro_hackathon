export async function fetcher(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  })

  if (!response.ok) {
    const error = new Error("API request failed")
    throw error
  }

  return response.json()
}
