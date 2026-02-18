// src/components/ImageUploader.jsx
import React, { useState } from "react";
import axios from "axios";
import { Upload, X, Loader2, CheckCircle } from "lucide-react";

const ImageUploader = ({
  onUploadComplete,
  currentImage = "",
  className = "",
  buttonText = "Upload Image",
  folder = "general",
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload file
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    setUploading(true);
    setError("");
    setProgress(0);
    setSuccess(false);

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
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          },
        },
      );

      if (response.data.success) {
        setSuccess(true);
        onUploadComplete?.(response.data.imageUrl);
        setTimeout(() => {
          setUploading(false);
          setProgress(0);
        }, 1000);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Upload failed");
      setUploading(false);
    }
  };

  const clearImage = () => {
    setPreview("");
    setSuccess(false);
    onUploadComplete?.("");
  };

  return (
    <div className={`w-full ${className}`}>
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="mb-1 text-sm text-gray-500">
              <span className="font-semibold">{buttonText}</span>
            </p>
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      ) : (
        <div className="relative rounded-lg overflow-hidden border border-gray-200">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <button
            onClick={clearImage}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            disabled={uploading}
            type="button"
          >
            <X className="w-4 h-4" />
          </button>

          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-white text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm">{progress}%</p>
              </div>
            </div>
          )}

          {success && !uploading && (
            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Uploaded
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
