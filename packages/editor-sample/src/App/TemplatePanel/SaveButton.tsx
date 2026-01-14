import React, { useMemo, useState } from 'react';

import { SaveOutlined } from '@mui/icons-material';
import { Button, Snackbar } from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';

import { useCurrentTemplateId, useDocument } from '../../documents/editor/EditorContext';
import { saveTemplate } from '../../services/templateApi';

export default function SaveButton() {
  const document = useDocument();
  const currentTemplateId = useCurrentTemplateId();
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const html = useMemo(() => renderToStaticMarkup(document, { rootBlockId: 'root' }), [document]);
  const builderJson = useMemo(() => JSON.stringify(document), [document]);

  const onClick = async () => {
    if (!currentTemplateId) {
      setMessage('No template selected to save.');
      return;
    }

    setSaving(true);
    const success = await saveTemplate(currentTemplateId, html, builderJson);
    setSaving(false);

    if (success) {
      setMessage('Template saved successfully.');
    } else {
      setMessage('Failed to save template. Please try again.');
    }
  };

  const onClose = () => {
    setMessage(null);
  };

  return (
    <>
      <Button
        variant="contained"
        onClick={onClick}
        disabled={saving || !currentTemplateId}
        startIcon={<SaveOutlined />}
        sx={{
          backgroundColor: 'success.main',
          '&:hover': {
            backgroundColor: 'success.dark',
          },
        }}
      >
        {saving ? 'Saving...' : 'Save'}
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message !== null}
        onClose={onClose}
        autoHideDuration={3000}
        message={message}
      />
    </>
  );
}
