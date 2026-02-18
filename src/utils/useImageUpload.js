import { useState } from "react";
import axios from "axios";

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadImage = async (file, onSuccess) => {
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("vendorToken") ||
        localStorage.getItem("adminToken");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/upload/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        onSuccess?.(response.data.imageUrl);
        return response.data.imageUrl;
      }
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};

export default useImageUpload;
