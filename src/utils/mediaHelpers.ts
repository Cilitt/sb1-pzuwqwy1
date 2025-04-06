import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ACCEPTED_MEDIA_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav']
};

export const validateFile = (file: File): string | null => {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`;
  }

  // Check file type
  const isValidType = Object.keys(ACCEPTED_MEDIA_TYPES).includes(file.type);
  if (!isValidType) {
    return 'Invalid file type';
  }

  return null;
};

export const generateFilePath = (file: File): string => {
  const date = new Date();
  const year = format(date, 'yyyy');
  const month = format(date, 'MM');
  const fileExtension = file.name.split('.').pop();
  const uniqueId = uuidv4();
  
  return `${year}/${month}/${uniqueId}.${fileExtension}`;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export const getMediaType = (mimeType: string): 'image' | 'audio' | 'unknown' => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('audio/')) return 'audio';
  return 'unknown';
};