import React, { useEffect } from 'react';

import { Box, Button, Divider, Drawer, Link, Stack, Typography } from '@mui/material';

import {
  useSamplesDrawerOpen,
  useApiTemplates,
  useApiTemplatesLoading,
  useApiTemplatesError,
  setApiTemplates,
  setApiTemplatesLoading,
  setApiTemplatesError,
} from '../../documents/editor/EditorContext';
import { fetchTemplates } from '../../services/templateApi';

import SidebarButton from './SidebarButton';
import logo from './waypoint.svg';

export const SAMPLES_DRAWER_WIDTH = 240;

export default function SamplesDrawer() {
  const samplesDrawerOpen = useSamplesDrawerOpen();
  const apiTemplates = useApiTemplates();
  const apiTemplatesLoading = useApiTemplatesLoading();
  const apiTemplatesError = useApiTemplatesError();

  useEffect(() => {
    let cancelled = false;

    async function loadTemplates() {
      setApiTemplatesLoading(true);
      try {
        const templates = await fetchTemplates();
        if (!cancelled) {
          setApiTemplates(templates);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load templates:', error);
          setApiTemplatesError('Failed to load templates');
        }
      }
    }

    loadTemplates();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={samplesDrawerOpen}
      sx={{
        width: samplesDrawerOpen ? SAMPLES_DRAWER_WIDTH : 0,
      }}
    >
      <Stack spacing={3} py={1} px={2} width={SAMPLES_DRAWER_WIDTH} justifyContent="space-between" height="100%">
        <Stack spacing={2} sx={{ '& .MuiButtonBase-root': { width: '100%', justifyContent: 'flex-start' } }}>
          <Typography variant="h6" component="h1" sx={{ p: 0.75 }}>
            EmailBuilder.js
          </Typography>

          <Stack alignItems="flex-start">
            <SidebarButton href="#">Empty</SidebarButton>

            {apiTemplatesLoading && (
              <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                Loading templates...
              </Typography>
            )}

            {apiTemplatesError && (
              <Typography variant="caption" color="error" sx={{ px: 1, py: 0.5 }}>
                {apiTemplatesError}
              </Typography>
            )}

            {!apiTemplatesLoading && !apiTemplatesError && apiTemplates.length === 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ px: 1, py: 0.5 }}>
                No templates available
              </Typography>
            )}

            {apiTemplates.map((template) => (
              <SidebarButton key={template.id} href={`#api/${encodeURIComponent(template.subject)}`}>
                {template.subject}
              </SidebarButton>
            ))}
          </Stack>

          <Divider />

          <Stack>
            <Button size="small" href="https://www.usewaypoint.com/open-source/emailbuilderjs" target="_blank">
              Learn more
            </Button>
            <Button size="small" href="https://github.com/usewaypoint/email-builder-js" target="_blank">
              View on GitHub
            </Button>
          </Stack>
        </Stack>
        <Stack spacing={2} px={0.75} py={3}>
          <Link href="https://usewaypoint.com?utm_source=emailbuilderjs" target="_blank" sx={{ lineHeight: 1 }}>
            <Box component="img" src={logo} width={32} />
          </Link>
          <Box>
            <Typography variant="overline" gutterBottom>
              Looking to send emails?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Waypoint is an end-to-end email API with a &apos;pro&apos; version of this template builder with dynamic
              variables, loops, conditionals, drag and drop, layouts, and more.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ justifyContent: 'center' }}
            href="https://usewaypoint.com?utm_source=emailbuilderjs"
            target="_blank"
          >
            Learn more
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
