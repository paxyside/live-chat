import React from "react";

const API_URL: string = import.meta.env.VITE_APP_API_URL || "";

export const handleFileChange = async (
  eOrFile: React.ChangeEvent<HTMLInputElement> | File
): Promise<{ file_url: string; filename: string; mediaType: string } | null> => {
  let file: File | null = null;

  if (eOrFile instanceof File) {
    file = eOrFile;
  } else {
    file = eOrFile.target.files?.[0] || null;
  }

  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/api/upload-file`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();

    return {
      file_url: data.url,
      filename: data.filename,
      mediaType: file.type,
    };
  } catch (error) {
    console.error("File upload error:", error);
    alert("File upload failed. Please try again.");
    return null;
  }
};