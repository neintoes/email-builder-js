import type { HtmlContentDto, AdminFileDto } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export async function saveTemplate(id: string, description: string, builderJson: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/automated-emails/${id}/template`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, builderJson }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Failed to save template:', error);
    return false;
  }
}

export async function fetchTemplates(): Promise<HtmlContentDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/automated-emails`);
    console.log(response)
    console.log("fetched")
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: HtmlContentDto[] = await response.json();
    console.log('All templates from API:', data);

    return data;
  } catch (error) {
    console.error('Failed to fetch templates from API:', error);
    return [];
  }
}

export async function fetchAdminImages(): Promise<AdminFileDto[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/automated-emails/admin-files`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data: AdminFileDto[] = await response.json();
    // Filter to only include files with valid URLs and image content types
    const imageFiles = data.filter(
      (file) => file.url && file.contentType?.startsWith('image/')
    );

    return imageFiles;
  } catch (error) {
    console.error('Failed to fetch admin images from API:', error);
    return [];
  }
}

export interface UploadImageResult {
  filename: string;
  url: string;
}

export async function uploadImage(file: File): Promise<UploadImageResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/admin/automated-emails/images`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
