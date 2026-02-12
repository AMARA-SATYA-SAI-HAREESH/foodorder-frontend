// src/components/ImageWithFallback.jsx
import React from "react";
import { IMAGE_URLS } from "../utils/imageUrls";

const ImageWithFallback = ({ src, alt, fallback, className, ...props }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback || IMAGE_URLS.DEFAULT_FOOD);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default ImageWithFallback;
