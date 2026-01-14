import type { TEditorConfiguration } from '../documents/editor/core';
import type { HtmlContentDto } from '../types/api';

export function transformApiTemplate(htmlContent: HtmlContentDto): TEditorConfiguration {
  // If builderJson exists, use it to restore the full editable structure
  if (htmlContent.builderJson) {
    try {
      return JSON.parse(htmlContent.builderJson);
    } catch (error) {
      console.error('Failed to parse builderJson, falling back to description:', error);
    }
  }

  // Fallback: wrap the HTML description in a single Html block
  const htmlBlockId = `api-html-block-${Date.now()}`;

  return {
    root: {
      type: 'EmailLayout',
      data: {
        backdropColor: '#F5F5F5',
        canvasColor: '#FFFFFF',
        textColor: '#262626',
        fontFamily: 'MODERN_SANS',
        childrenIds: [htmlBlockId],
      },
    },
    [htmlBlockId]: {
      type: 'Html',
      data: {
        style: {
          padding: {
            top: 16,
            bottom: 16,
            right: 16,
            left: 16,
          },
        },
        props: {
          contents: htmlContent.description,
        },
      },
    },
  };
}
