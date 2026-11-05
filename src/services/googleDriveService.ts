/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAccessToken } from './googleDriveAuth';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  iconLink?: string;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  shared?: boolean;
}

const DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';

/**
 * Fetch files from Google Drive
 */
export const listDriveFiles = async (options?: {
  pageSize?: number;
  query?: string;
  folderId?: string;
}): Promise<{ files: DriveFileItem[]; nextPageToken?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  const params = new URLSearchParams({
    pageSize: String(options?.pageSize || 30),
    fields: 'nextPageToken, files(id, name, mimeType, size, iconLink, thumbnailLink, webViewLink, webContentLink, createdTime, modifiedTime, shared)',
    orderBy: 'modifiedTime desc',
  });

  let q = 'trashed = false';
  if (options?.folderId) {
    q += ` and '${options.folderId}' in parents`;
  }
  if (options?.query) {
    q += ` and (${options.query})`;
  }
  params.append('q', q);

  const res = await fetch(`${DRIVE_API_URL}/files?${params.toString()}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Lỗi tải tệp Google Drive (${res.status})`);
  }

  const data = await res.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
};

/**
 * Search Drive files by name or mimeType
 */
export const searchDriveFiles = async (keyword: string, fileType?: 'image' | 'folder' | 'document' | 'all'): Promise<DriveFileItem[]> => {
  let queryParts: string[] = [];
  
  if (keyword.trim()) {
    queryParts.push(`name contains '${keyword.replace(/'/g, "\\'")}'`);
  }

  if (fileType === 'image') {
    queryParts.push("mimeType contains 'image/'");
  } else if (fileType === 'folder') {
    queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
  } else if (fileType === 'document') {
    queryParts.push("(mimeType contains 'document' or mimeType contains 'spreadsheet' or mimeType = 'application/pdf' or mimeType contains 'text/')");
  }

  const query = queryParts.length > 0 ? queryParts.join(' and ') : undefined;
  const res = await listDriveFiles({ query, pageSize: 40 });
  return res.files;
};

/**
 * Upload a file (JSON, text, CSV, or Blob) to Google Drive
 */
export const uploadFileToDrive = async (params: {
  name: string;
  mimeType: string;
  content: string | Blob;
  folderId?: string;
  description?: string;
}): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  const metadata: Record<string, any> = {
    name: params.name,
    mimeType: params.mimeType,
  };

  if (params.folderId) {
    metadata.parents = [params.folderId];
  }
  if (params.description) {
    metadata.description = params.description;
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const textContent = typeof params.content === 'string' 
    ? params.content 
    : await params.content.text();

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${params.mimeType}\r\n\r\n` +
    textContent +
    closeDelimiter;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,webContentLink,createdTime', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Lỗi tải tệp lên Google Drive (${res.status})`);
  }

  return await res.json();
};

/**
 * Create a new folder on Google Drive
 */
export const createDriveFolder = async (folderName: string, parentFolderId?: string): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  const metadata: Record<string, any> = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch(`${DRIVE_API_URL}/files?fields=id,name,mimeType,webViewLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Lỗi tạo thư mục trên Google Drive (${res.status})`);
  }

  return await res.json();
};

/**
 * Permanently delete a file from Google Drive
 * IMPORTANT: MUST be preceded by explicit user confirmation in the UI.
 */
export const deleteDriveFile = async (fileId: string): Promise<boolean> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Chưa đăng nhập Google hoặc phiên làm việc đã hết hạn.');
  }

  const res = await fetch(`${DRIVE_API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error?.message || `Lỗi xóa tệp trên Google Drive (${res.status})`);
  }

  return true;
};
