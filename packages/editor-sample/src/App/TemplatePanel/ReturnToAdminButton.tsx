import React from 'react';

import { ArrowBackOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';

import { isRunningInIframe, requestNavigateBack } from '../../services/parentMessaging';

export default function ReturnToAdminButton() {
  const onClick = () => {
    if (isRunningInIframe()) {
      // Let the parent (Blazor) handle navigation
      requestNavigateBack();
    } else {
      // Standalone mode - navigate directly
      window.location.href = 'http://thecode.zone/admin/dashboard';
    }
  };

  return (
    <Button
      variant="contained"
      onClick={onClick}
      startIcon={<ArrowBackOutlined />}
      sx={{
        backgroundColor: '#17a2b8',
        '&:hover': {
          backgroundColor: '#138496',
        },
        whiteSpace: 'nowrap',
      }}
    >
      Return to Admin
    </Button>
  );
}
