// src/utils/imageHelper.js
export const getSafeImageUrl = (url, type = "food") => {
  const DEFAULT_IMAGES = {
    food: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
    restaurant: "https://cdn-icons-png.flaticon.com/512/2255/2255671.png",
    profile: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    category: "https://cdn-icons-png.flaticon.com/512/1046/1046784.png",
    placeholder: "https://cdn-icons-png.flaticon.com/512/135/135728.png",
  };

  // Return null for empty strings to fix React warning
  if (!url || url.trim() === "" || url === '""') {
    return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.placeholder;
  }

  // Check if URL is valid
  try {
    new URL(url);
    return url;
  } catch {
    return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.placeholder;
  }
};

export const ImageComponent = ({
  src,
  alt,
  className,
  type = "food",
  ...props
}) => {
  const safeSrc = getSafeImageUrl(src, type);

  // Don't render img if no src
  if (!safeSrc) return null;

  return (
    <img
      src={safeSrc}
      alt={alt || "Image"}
      className={className}
      onError={(e) => {
        e.target.src = getSafeImageUrl(null, type);
      }}
      {...props}
    />
  );
};
