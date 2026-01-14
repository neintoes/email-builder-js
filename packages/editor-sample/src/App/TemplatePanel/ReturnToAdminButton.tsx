import React from 'react';

import { ArrowBackOutlined } from '@mui/icons-material';
import { Button } from '@mui/material';

export default function ReturnToAdminButton() {
  const onClick = () => {
    window.location.href = 'http://www.thecode.zone/admin/dashboard';
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
