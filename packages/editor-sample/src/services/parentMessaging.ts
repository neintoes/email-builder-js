import { resetDocument, setApiTemplates } from '../documents/editor/EditorContext';
import type { TEditorConfiguration } from '../documents/editor/core';
import type { HtmlContentDto } from '../types/api';
import { transformApiTemplate } from './transformApiTemplate';
import { fetchTemplates } from './templateApi';

// Message types received from parent (Blazor)
type IncomingMessage =
  | { type: 'LOAD_TEMPLATE'; templateId: string }
  | { type: 'LOAD_TEMPLATE_JSON'; json: string }
  | { type: 'GET_TEMPLATES' };

// Message types sent to parent (Blazor)
type OutgoingMessage =
  | { type: 'EDITOR_READY' }
  | { type: 'TEMPLATE_LOADED'; templateId: string }
  | { type: 'TEMPLATE_SAVED'; templateId: string; success: boolean }
  | { type: 'TEMPLATES_LIST'; templates: HtmlContentDto[] }
  | { type: 'ERROR'; message: string };

let templatesCache: HtmlContentDto[] = [];

function sendMessageToParent(message: OutgoingMessage) {
  if (window.parent !== window) {
    window.parent.postMessage(message, '*');
  }
}

async function handleLoadTemplate(templateId: string) {
  try {
    // Ensure we have templates loaded
    if (templatesCache.length === 0) {
      templatesCache = await fetchTemplates();
      setApiTemplates(templatesCache);
    }

    const template = templatesCache.find((t) => t.id === templateId);
    if (!template) {
      sendMessageToParent({ type: 'ERROR', message: `Template not found: ${templateId}` });
      return;
    }

    const config = transformApiTemplate(template);
    resetDocument(config, templateId);
    sendMessageToParent({ type: 'TEMPLATE_LOADED', templateId });
  } catch (error) {
    sendMessageToParent({ type: 'ERROR', message: `Failed to load template: ${error}` });
  }
}

function handleLoadTemplateJson(json: string) {
  try {
    const config: TEditorConfiguration = JSON.parse(json);
    resetDocument(config, null);
    sendMessageToParent({ type: 'TEMPLATE_LOADED', templateId: 'custom' });
  } catch (error) {
    sendMessageToParent({ type: 'ERROR', message: `Failed to parse template JSON: ${error}` });
  }
}

async function handleGetTemplates() {
  try {
    if (templatesCache.length === 0) {
      templatesCache = await fetchTemplates();
      setApiTemplates(templatesCache);
    }
    sendMessageToParent({ type: 'TEMPLATES_LIST', templates: templatesCache });
  } catch (error) {
    sendMessageToParent({ type: 'ERROR', message: `Failed to fetch templates: ${error}` });
  }
}

function handleMessage(event: MessageEvent) {
  // Only accept messages from parent window
  if (event.source !== window.parent) {
    return;
  }

  const message = event.data as IncomingMessage;
  if (!message || typeof message.type !== 'string') {
    return;
  }

  switch (message.type) {
    case 'LOAD_TEMPLATE':
      handleLoadTemplate(message.templateId);
      break;
    case 'LOAD_TEMPLATE_JSON':
      handleLoadTemplateJson(message.json);
      break;
    case 'GET_TEMPLATES':
      handleGetTemplates();
      break;
  }
}

export function initializeParentMessaging() {
  // Only initialize if running in an iframe
  if (window.parent === window) {
    console.log('Not running in iframe, parent messaging disabled');
    return;
  }

  window.addEventListener('message', handleMessage);
  sendMessageToParent({ type: 'EDITOR_READY' });
  console.log('Parent messaging initialized');
}

export function notifyTemplateSaved(templateId: string, success: boolean) {
  sendMessageToParent({ type: 'TEMPLATE_SAVED', templateId, success });
}

export function updateTemplatesCache(templates: HtmlContentDto[]) {
  templatesCache = templates;
}
