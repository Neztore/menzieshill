import * as Api from "../../../../../public/js/apiFetch";
import { HttpError } from "../../shared/Types";
import { Folder, File as HttpFile } from "./types";

class HTTPError extends Error {
  http: HttpError;

  constructor (msg: string, error: HttpError) {
    super(msg);
    this.http = error;
  }
}
export const { BaseUrl } = Api;
export async function getFolder (folderId: string|number): Promise<Folder> {
  const folder = await Api.get(`/files/${folderId}`);
  if (folder.error) {
    throw new HTTPError("Failed to get folder", folder);
  }
  return folder;
}
// Only works for text-based files
export async function getFile (fileId: string): Promise<string> {
  const res = await fetch(`${BaseUrl}/files/parent/${fileId}`);
  if (!res.ok) {
    throw new Error(`Failed to get file! ${res.status}`);
  }
  return res.text();
}
export async function getFileInfo (fileId: string|number): Promise<HttpFile> {
  const file = await Api.get(`/files/parent/${fileId}/info`, { noCache: true });
  if (file.error) {
    throw new HTTPError("Failed to get file info", file);
  }
  return file;
}
export async function createFolder (parentId: number, folderName: string): Promise<HttpFile> {
  const folder = await Api.post(`/files/${parentId}`, { body: { name: folderName } });
  if (folder.error) {
    throw new HTTPError("Failed to upload folder", folder);
  }
  return folder;
}
export async function editContentFile (fileId: string, content: string, name: string): Promise<HttpFile> {
  const res = await Api.patch(`/files/par/files/${fileId}/content`, {
    body: {
      content,
      name
    }
  });
  if (res && res.error) {
    throw new HTTPError("Failed to edit file ", res);
  }
  return res;
}
export async function uploadFiles (folderId: number, files: FileList | File[], controller?: AbortController): Promise<void> {
  const fd = new FormData();
  for (let counter = 0; counter < files.length; counter++) {
    fd.append("files", files[counter]);
  }
  const resp = await Api._makeRequest(`/files/${folderId}/files`, {
    method: "POST",
    body: fd,
    credentials: "include",
    signal: controller ? controller.signal : undefined
  });
  if (resp.error) {
    throw new HTTPError("Failed to upload", resp);
  }
}
