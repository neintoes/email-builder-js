import React, { useState, useEffect } from 'react';

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
import { Close as CloseIcon, Collections as CollectionsIcon } from '@mui/icons-material';

import { fetchAdminImages } from '../../../../../../services/templateApi';
import type { AdminFileDto } from '../../../../../../types/api';

type Props = {
  label: string;
  onSelect: (url: string) => void;
};

export default function ImagePicker({ label, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<AdminFileDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
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
