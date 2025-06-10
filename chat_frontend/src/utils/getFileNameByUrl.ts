export function getFileNameByUrl(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1);
}