export const AVATAR_STORAGE_KEY = "nezuko_avatar";

export const AVATAR_STALE_MS = 24 * 60 * 60 * 1000;

export function readAvatarFromStorage(): { base64: string | null; updatedAt: number | null } {
  if (typeof window === "undefined") return { base64: null, updatedAt: null };
  try {
    const raw = localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return { base64: null, updatedAt: null };
    const parsed = JSON.parse(raw);
    return {
      base64: parsed.base64 ?? null,
      updatedAt: parsed.updatedAt ?? null,
    };
  } catch {
    return { base64: null, updatedAt: null };
  }
}

export function writeAvatarToStorage(base64: string): void {
  localStorage.setItem(
    AVATAR_STORAGE_KEY,
    JSON.stringify({ base64, updatedAt: Date.now() })
  );
}

export function removeAvatarFromStorage(): void {
  localStorage.removeItem(AVATAR_STORAGE_KEY);
}

export function isAvatarStale(updatedAt: number | null): boolean {
  if (!updatedAt) return true;
  return Date.now() - updatedAt > AVATAR_STALE_MS;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch image");
  const blob = await response.blob();
  return fileToBase64(new File([blob], "avatar", { type: blob.type }));
}
