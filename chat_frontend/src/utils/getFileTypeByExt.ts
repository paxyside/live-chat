export const FileTypes = {
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  OTHER: "other"
} as const;

export type FileTypes = typeof FileTypes[keyof typeof FileTypes];

export function getFileTypeByExtension(url: string): FileTypes {
  const ext = url.split('.').pop()?.toLowerCase();
  if (!ext) return FileTypes.OTHER;
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg", "heic"].includes(ext)) return FileTypes.IMAGE;
  if (["mp4", "webm", "ogg", "mov", "avi"].includes(ext)) return FileTypes.VIDEO;
  if (["mp3", "wav", "ogg", "aac", "flac"].includes(ext)) return FileTypes.AUDIO;
  return FileTypes.OTHER;
}