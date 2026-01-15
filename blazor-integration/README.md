# Blazor Integration Guide

This folder contains everything needed to embed the Email Builder in your Blazor/.NET application.

## Setup Steps

### 1. Copy the built React app

```bash
# From the email-builder-js root
cd packages/editor-sample
npm run build

# Copy dist/ contents to your .NET project
# Copy to: wwwroot/email-builder/
```

Your wwwroot should look like:
```
wwwroot/
  email-builder/
    index.html
    assets/
      index-xxxxx.js
      index-xxxxx.css
      ...
```

### 2. Copy the JavaScript bridge

Copy `emailBuilderBridge.js` to `wwwroot/js/emailBuilderBridge.js`

### 3. Reference the script

Add to your `_Host.cshtml`, `_Layout.cshtml`, or `index.html`:

```html
<script src="js/emailBuilderBridge.js"></script>
```

### 4. Copy the Blazor component

Copy these files to your project:
- `EmailBuilderEditor.razor` → `Components/EmailBuilderEditor.razor` (or Shared/)
- `TemplateSavedEventArgs.cs` → `Components/TemplateSavedEventArgs.cs`

Update the namespace in `TemplateSavedEventArgs.cs` to match your project.

### 5. Ensure static files are served

In `Program.cs`:
```csharp
app.UseStaticFiles();
```

## Usage Example

```razor
@page "/email-templates/edit/{TemplateId}"

<h1>Edit Email Template</h1>

<EmailBuilderEditor @ref="editorRef"
                    TemplateId="@TemplateId"
                    Height="calc(100vh - 150px)"
                    OnEditorReady="HandleEditorReady"
                    OnTemplateSaved="HandleTemplateSaved"
                    OnError="HandleError" />

@if (!string.IsNullOrEmpty(statusMessage))
{
    <div class="alert @statusClass mt-3">@statusMessage</div>
}

@code {
    [Parameter]
    public string? TemplateId { get; set; }

    private EmailBuilderEditor? editorRef;
    private string? statusMessage;
    private string statusClass = "alert-info";

    private void HandleEditorReady()
    {
        statusMessage = "Editor ready";
        statusClass = "alert-info";
    }

    private void HandleTemplateSaved(TemplateSavedEventArgs args)
    {
        if (args.Success)
        {
            statusMessage = "Template saved successfully!";
            statusClass = "alert-success";
        }
        else
        {
            statusMessage = "Failed to save template.";
            statusClass = "alert-danger";
        }
        StateHasChanged();
    }

    private void HandleError(string error)
    {
        statusMessage = $"Error: {error}";
        statusClass = "alert-danger";
        StateHasChanged();
    }
}
```

## Configuration

### Environment Variables (React app)

Create a `.env` file in `packages/editor-sample/` before building:

```env
# API URL - set this to your production API
VITE_API_BASE_URL=https://yourapi.com

# Base path - must match where you serve the app
VITE_BASE_PATH=/email-builder/
```

### API Endpoints

The email builder expects these endpoints:

- `GET /api/admin/automated-emails` - List templates
- `PATCH /api/admin/automated-emails/{id}/template` - Save template
  - Body: `{ "description": "<html>...", "builderJson": "{...}" }`

## Component API

### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `TemplateId` | string? | null | Template ID to auto-load when ready |
| `Height` | string | "800px" | Height of the editor container |
| `AdditionalStyles` | string? | null | Extra CSS for the container |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `OnEditorReady` | EventCallback | Editor is initialized and ready |
| `OnTemplateSaved` | EventCallback<TemplateSavedEventArgs> | Template was saved |
| `OnTemplateLoaded` | EventCallback<string> | Template was loaded (passes template ID) |
| `OnError` | EventCallback<string> | An error occurred |
| `OnTemplatesReceived` | EventCallback<string> | Template list received (JSON) |

### Methods

| Method | Description |
|--------|-------------|
| `LoadTemplate(string templateId)` | Load a template by ID |
| `LoadTemplateJson(string json)` | Load a template from JSON |
| `GetTemplates()` | Request the template list |
