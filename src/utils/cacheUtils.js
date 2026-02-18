// Helper to handle cached data
export const getCachedData = (key, maxAge = 5 * 60 * 1000) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const { data, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > maxAge) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
  } catch (error) {
    console.error("Cache set error:", error);
  }
};

// Usage in components:
// const cachedCategories = getCachedData('categories');
// if (cachedCategories) {
//   setCategories(cachedCategories);
// } else {
//   fetchCategories().then(data => {
//     setCachedData('categories', data);
//     setCategories(data);
//   });
// }
