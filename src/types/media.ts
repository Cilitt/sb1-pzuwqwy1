export interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  category: string;
  title?: string;
  description?: string;
  tags: string[];
  uploadedAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface MediaCategory {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaTag {
  id: string;
  name: string;
  createdAt: Date;
}