// Preview attachments stay in this browser, never in localStorage or public URLs.
const databaseName = "afterburn-dropoff";
export const maxFileBytes = 25 * 1024 * 1024;
export const maxTotalBytes = 50 * 1024 * 1024;
export type SavedAttachment = { id: string; file_name: string; file_size: number; file_type: string; storage: "browser" };
export type SavedDropoff = { submission: { id: string; submitted_at?: string }; attachments: SavedAttachment[]; [key: string]: unknown };

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("submissions", { keyPath: "submission.id" });
      request.result.createObjectStore("files");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error("Browser storage is unavailable. Keep your files and try a regular browser window."));
    request.onblocked = () => reject(new Error("Close other AFTERBURN tabs and try saving again."));
  });
}

export function validateFiles(files: File[]): string | null {
  if (files.length > 10) return "Choose up to 10 files per submission.";
  if (files.some((file) => file.size === 0)) return "Empty files cannot be attached.";
  if (files.some((file) => file.size > maxFileBytes)) return "Each file must be 25 MB or smaller.";
  if (files.reduce((total, file) => total + file.size, 0) > maxTotalBytes) return "Keep the total attachment size under 50 MB.";
  return null;
}

export async function saveDropoffFiles(result: SavedDropoff, files: File[]) {
  const validation = validateFiles(files);
  if (validation) throw new Error(validation);
  if (result.attachments.length !== files.length) throw new Error("Attachment list changed. Please submit again.");
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(["submissions", "files"], "readwrite");
      transaction.oncomplete = () => resolve();
      transaction.onabort = () => reject(new Error("Files could not be saved. Browser storage may be full. Your selection is still available; remove a file or free space and retry."));
      transaction.onerror = () => { /* onabort reports the rolled-back transaction */ };
      transaction.objectStore("submissions").put(result);
      files.forEach((file, index) => transaction.objectStore("files").put(file, result.attachments[index].id));
    });
  } finally { db.close(); }
  window.dispatchEvent(new CustomEvent("afterburn-dropoff-updated"));
}

export async function readSavedDropoffs(): Promise<SavedDropoff[]> {
  const db = await openDatabase();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction("submissions").objectStore("submissions").getAll();
      request.onsuccess = () => resolve((request.result as SavedDropoff[]).sort((a, b) => (b.submission.submitted_at ?? "").localeCompare(a.submission.submitted_at ?? "")));
      request.onerror = () => reject(new Error("Saved submissions could not be loaded."));
    });
  } finally { db.close(); }
}

export async function downloadAttachment(attachment: SavedAttachment) {
  const db = await openDatabase();
  let file: Blob;
  try {
    file = await new Promise<Blob>((resolve, reject) => {
      const request = db.transaction("files").objectStore("files").get(attachment.id);
      request.onsuccess = () => request.result instanceof Blob ? resolve(request.result) : reject(new Error("This file is not available in this browser. It may have been saved on another device or browser data was cleared."));
      request.onerror = () => reject(new Error("The saved file could not be opened."));
    });
  } finally { db.close(); }
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = attachment.file_name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
