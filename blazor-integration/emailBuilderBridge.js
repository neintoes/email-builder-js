/**
 * Email Builder Bridge for Blazor
 *
 * Copy this file to: wwwroot/js/emailBuilderBridge.js
 * Reference in _Host.cshtml or index.html: <script src="js/emailBuilderBridge.js"></script>
 */

window.emailBuilderBridge = {
    iframe: null,
    dotNetRef: null,
    isReady: false,
    pendingCommands: [],

    /**
     * Initialize the bridge with the iframe element and Blazor component reference
     */
    initialize: function (iframeElement, dotNetReference) {
        this.iframe = iframeElement;
        this.dotNetRef = dotNetReference;
        this.isReady = false;
        this.pendingCommands = [];

        // Listen for messages from the iframe
        window.addEventListener('message', this.handleMessage.bind(this));

        console.log('Email Builder Bridge initialized');
    },

    /**
     * Handle messages received from the email builder iframe
     */
    handleMessage: function (event) {
        // Security: verify the message is from our iframe
        if (!this.iframe || event.source !== this.iframe.contentWindow) {
            return;
        }

        const message = event.data;
        if (!message || typeof message.type !== 'string') {
            return;
        }

        console.log('Message from email builder:', message);

        // Handle EDITOR_READY specially to flush pending commands
        if (message.type === 'EDITOR_READY') {
            this.isReady = true;
            this.flushPendingCommands();
        }

        // Forward all messages to Blazor
        if (this.dotNetRef) {
            this.dotNetRef.invokeMethodAsync('OnMessageFromEditor', JSON.stringify(message));
        }
    },

    /**
     * Send a message to the email builder iframe
     */
    sendMessage: function (message) {
        if (!this.iframe || !this.iframe.contentWindow) {
            console.warn('Email builder iframe not available');
            return false;
        }

        // Queue commands if editor isn't ready yet
        if (!this.isReady && message.type !== 'EDITOR_READY') {
            this.pendingCommands.push(message);
            console.log('Queued command (editor not ready):', message);
            return true;
        }

        this.iframe.contentWindow.postMessage(message, '*');
        return true;
    },

    /**
     * Flush any commands that were queued before the editor was ready
     */
    flushPendingCommands: function () {
        while (this.pendingCommands.length > 0) {
            const command = this.pendingCommands.shift();
            console.log('Executing queued command:', command);
            this.iframe.contentWindow.postMessage(command, '*');
        }
    },

    /**
     * Load a template by its ID
     */
    loadTemplate: function (templateId) {
        return this.sendMessage({ type: 'LOAD_TEMPLATE', templateId: templateId });
    },

    /**
     * Load a template from raw JSON
     */
    loadTemplateJson: function (json) {
        return this.sendMessage({ type: 'LOAD_TEMPLATE_JSON', json: json });
    },

    /**
     * Request the list of available templates
     */
    getTemplates: function () {
        return this.sendMessage({ type: 'GET_TEMPLATES' });
    },

    /**
     * Clean up when the component is disposed
     */
    dispose: function () {
        window.removeEventListener('message', this.handleMessage.bind(this));
        this.iframe = null;
        this.dotNetRef = null;
        this.isReady = false;
        this.pendingCommands = [];
        console.log('Email Builder Bridge disposed');
    }
};
