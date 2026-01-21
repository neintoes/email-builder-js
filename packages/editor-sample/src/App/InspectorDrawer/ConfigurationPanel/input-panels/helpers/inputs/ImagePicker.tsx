import React, { useState, useEffect, useRef } from 'react';

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, Collections as CollectionsIcon, CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { fetchAdminImages, uploadImage, deleteImage } from '../../../../../../services/templateApi';
import type { AdminFileDto } from '../../../../../../types/api';

type Props = {
  label: string;
  onSelect: (url: string) => void;
};

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export default function ImagePicker({ label, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<AdminFileDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && images.length === 0) {
      loadImages();
    }
  }, [open]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedImages = await fetchAdminImages();
      setImages(fetchedImages);
    } catch (err) {
      setError('Failed to load images');
      console.error('Error loading images:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (image: AdminFileDto) => {
    if (image.url) {
      onSelect(image.url);
      setOpen(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset the input so the same file can be selected again
    event.target.value = '';

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Only PNG, JPEG, and WebP images are allowed.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const result = await uploadImage(file);
      // Reload images to include the newly uploaded one
      await loadImages();
      // Optionally auto-select the uploaded image
      onSelect(result.url);
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(message);
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (event: React.MouseEvent, imageId: string) => {
    event.stopPropagation(); // Prevent image selection when clicking delete

    setDeletingId(imageId);
    setError(null);

    try {
      await deleteImage(imageId);
      // Remove the deleted image from state
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete image';
      setError(message);
      console.error('Error deleting image:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<CollectionsIcon />}
        onClick={() => setOpen(true)}
        fullWidth
        sx={{ mt: 1 }}
      >
        {label}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Select an Image</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="contained"
              startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <CloudUploadIcon />}
              onClick={handleUploadClick}
              disabled={uploading || loading}
              size="small"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg,image/webp"
            style={{ display: 'none' }}
          />
        </DialogTitle>
        <DialogContent>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="error">{error}</Typography>
              <Button onClick={loadImages} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          )}

          {!loading && !error && images.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">No images available</Typography>
            </Box>
          )}

          {!loading && !error && images.length > 0 && (
            <ImageList cols={3} gap={12}>
              {images.map((image) => (
                <ImageListItem
                  key={image.id}
                  sx={{
                    cursor: 'pointer',
                    border: '2px solid transparent',
                    borderRadius: 1,
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: 'primary.main',
                    },
                  }}
                  onClick={() => handleSelect(image)}
                >
                  <img
                    src={image.url ?? undefined}
                    alt={image.name}
                    loading="lazy"
                    style={{
                      height: 140,
                      objectFit: 'cover',
                    }}
                  />
                  <ImageListItemBar
                    title={image.name}
                    sx={{
                      '& .MuiImageListItemBar-title': {
                        fontSize: '0.75rem',
                      },
                    }}
                    actionIcon={
                      <IconButton
                        sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'error.main' } }}
                        onClick={(e) => handleDelete(e, image.id)}
                        disabled={deletingId === image.id}
                        size="small"
                      >
                        {deletingId === image.id ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    }
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
