import { supabase } from '../lib/supabase';
import { MediaFile, MediaCategory, MediaTag } from '../types/media';
import { generateFilePath } from '../utils/mediaHelpers';

export const uploadMedia = async (
  file: File,
  category?: string,
  metadata?: { title?: string; description?: string; tags?: string[] }
): Promise<MediaFile> => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('User not authenticated');

  // Generate unique file path
  const filePath = generateFilePath(file);

  // Upload file to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('media')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Create media file record
  const { data: mediaFile, error: dbError } = await supabase
    .from('media_files')
    .insert({
      filename: uploadData.path,
      original_name: file.name,
      mime_type: file.type,
      size: file.size,
      path: filePath,
      category_id: category,
      title: metadata?.title,
      description: metadata?.description,
      user_id: user.id
    })
    .select()
    .single();

  if (dbError) {
    // Cleanup uploaded file if database insert fails
    await supabase.storage.from('media').remove([filePath]);
    throw dbError;
  }

  // Add tags if provided
  if (metadata?.tags?.length) {
    const { error: tagsError } = await supabase.from('media_files_tags').insert(
      metadata.tags.map(tag => ({
        file_id: mediaFile.id,
        tag_id: tag
      }))
    );

    if (tagsError) throw tagsError;
  }

  return mediaFile as MediaFile;
};

export const deleteMedia = async (fileId: string): Promise<void> => {
  const { data: file, error: fetchError } = await supabase
    .from('media_files')
    .select('path')
    .eq('id', fileId)
    .single();

  if (fetchError) throw fetchError;

  // Delete file from storage
  const { error: storageError } = await supabase.storage
    .from('media')
    .remove([file.path]);

  if (storageError) throw storageError;

  // Delete database record
  const { error: dbError } = await supabase
    .from('media_files')
    .delete()
    .eq('id', fileId);

  if (dbError) throw dbError;
};

export const updateMediaMetadata = async (
  fileId: string,
  metadata: {
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
  }
): Promise<MediaFile> => {
  // Update basic metadata
  const { data: updatedFile, error: updateError } = await supabase
    .from('media_files')
    .update({
      title: metadata.title,
      description: metadata.description,
      category_id: metadata.category
    })
    .eq('id', fileId)
    .select()
    .single();

  if (updateError) throw updateError;

  // Update tags if provided
  if (metadata.tags) {
    // Remove existing tags
    await supabase
      .from('media_files_tags')
      .delete()
      .eq('file_id', fileId);

    // Add new tags
    if (metadata.tags.length > 0) {
      await supabase.from('media_files_tags').insert(
        metadata.tags.map(tag => ({
          file_id: fileId,
          tag_id: tag
        }))
      );
    }
  }

  return updatedFile as MediaFile;
};

export const getMediaFiles = async (
  options: {
    category?: string;
    tags?: string[];
    type?: string;
    search?: string;
  } = {}
): Promise<MediaFile[]> => {
  let query = supabase
    .from('media_files')
    .select(`
      *,
      category:media_categories(id, name),
      tags:media_files_tags(tag:media_tags(id, name))
    `);

  if (options.category) {
    query = query.eq('category_id', options.category);
  }

  if (options.type) {
    query = query.like('mime_type', `${options.type}%`);
  }

  if (options.search) {
    query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as unknown as MediaFile[];
};

export const createCategory = async (
  name: string,
  description?: string
): Promise<MediaCategory> => {
  const { data, error } = await supabase
    .from('media_categories')
    .insert({ name, description })
    .select()
    .single();

  if (error) throw error;
  return data as MediaCategory;
};

export const createTag = async (name: string): Promise<MediaTag> => {
  const { data, error } = await supabase
    .from('media_tags')
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data as MediaTag;
};