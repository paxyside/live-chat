import React from "react";

const API_URL: string = import.meta.env.VITE_APP_API_URL || "";
const AUTH_TOKEN: string = import.meta.env.VITE_APP_API_AUTH_TOKEN || "";

export const handleFileChange = async (
  eOrFile: React.ChangeEvent<HTMLInputElement> | File
): Promise<{ file_url: string; filename: string; mediaType: string } | null> => {
  let file: File | null = null;

  console.log('[handleFileChange] Input:', eOrFile);

  if (eOrFile instanceof File) {
    file = eOrFile;
  } else {
    file = eOrFile.target.files?.[0] || null;
  }

  console.log('[handleFileChange] Selected file:', file);

  if (!file) {
    console.warn('[handleFileChange] No file selected');
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${API_URL}/api/upload-file`, {
      method: "POST",
      headers: {
        "X-Authorization": `Bearer ${AUTH_TOKEN}`,
      },
      body: formData,
    });

    console.log('[handleFileChange] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[handleFileChange] Upload failed:', errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('[handleFileChange] Success data:', data);

    return {
      file_url: data.url,
      filename: data.filename,
      mediaType: file.type,
    };
  } catch (error) {
    console.error('[handleFileChange] Error:', error);
    alert("File upload failed. Please try again.");
    return null;
  }
};