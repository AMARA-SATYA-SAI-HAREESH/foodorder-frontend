// src/components/SafeImage.jsx
import React from "react";

const SafeImage = ({
  src,
  alt,
  fallback = "https://cdn-icons-png.flaticon.com/512/135/135728.png",
  className = "",
  ...props
}) => {
  const [imgSrc, setImgSrc] = React.useState(() => {
    // Handle empty strings by returning fallback immediately
    if (!src || src.trim() === "" || src === '""') {
      return fallback;
    }
    return src;
  });

  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;
