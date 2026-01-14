import React from 'react';

import { Button } from '@mui/material';

import { resetDocument, useApiTemplates } from '../../documents/editor/EditorContext';
import getConfiguration from '../../getConfiguration';

export default function SidebarButton({ href, children }: { href: string; children: JSX.Element | string }) {
  const apiTemplates = useApiTemplates();

  const handleClick = () => {
    let templateId: string | null = null;

    if (href.startsWith('#api/')) {
      const subject = decodeURIComponent(href.replace('#api/', ''));
      const found = apiTemplates.find((t) => t.subject === subject);
      if (found) {
        templateId = found.id;
      }
    }

    resetDocument(getConfiguration(href, apiTemplates), templateId);
  };
  return (
    <Button size="small" href={href} onClick={handleClick}>
      {children}
    </Button>
  );
}
