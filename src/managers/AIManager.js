/**
 * @fileoverview AI Manager - Handles AI API integration for chat rewriting
 * @module managers/AIManager
 *
 * This manager handles:
 * - AI provider selection (OpenAI, Ollama)
 * - API key/endpoint management
 * - Chat message rewriting via GPT-4o-mini or Ollama models
 * - API request/response handling
 * - Error handling and validation
 *
 * Security features:
 * - API key/endpoint stored in memory only (not localStorage)
 * - Message length validation
 * - Error handling for unauthorized responses
 * - Token limits on API requests
 */

import {
  OPENAI_MODEL,
  OLLAMA_MODEL,
  OLLAMA_DEFAULT_ENDPOINT,
  AI_PROVIDERS,
  MAX_MESSAGE_LENGTH,
  AI_PREFERENCE_STORAGE_KEY,
  AI_PROVIDER_STORAGE_KEY
} from '../core/constants.js';

/**
 * Gets the appropriate API endpoint and model based on provider
 * @param {string} provider - AI provider (openai or ollama)
 * @param {string} ollamaEndpoint - Custom Ollama endpoint (optional)
 * @returns {Object} Configuration object with endpoint and model
 */
function getApiConfig(provider, ollamaEndpoint = '') {
  if (provider === AI_PROVIDERS.OLLAMA) {
    const endpoint = ollamaEndpoint.trim() || OLLAMA_DEFAULT_ENDPOINT;
    // Ensure endpoint ends with /v1/chat/completions
    const baseUrl = endpoint.replace(/\/+$/, '');
    const fullEndpoint = baseUrl.includes('/v1/chat/completions')
      ? baseUrl
      : `${baseUrl}/v1/chat/completions`;

    return {
      endpoint: fullEndpoint,
      model: OLLAMA_MODEL,
      requiresAuth: false
    };
  }

  // Default to OpenAI
  return {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: OPENAI_MODEL,
    requiresAuth: true
  };
}

/**
 * Creates a factory for AI operations
 * @param {Object} deps - Dependencies object
 * @param {Function} deps.setIsAiBusy - AI busy state setter
 * @param {Function} deps.setAiStatus - AI status setter
 * @param {Function} deps.setAiError - AI error setter
 * @param {Function} deps.setInputText - Input text setter
 * @param {Function} deps.setApiKeyInput - API key input setter
 * @param {Function} deps.setApiKeyError - API key error setter
 * @param {Function} deps.setIsApiKeyModalOpen - API modal state setter
 * @param {Function} deps.setIsAboutOpen - About dialog state setter
 * @param {Function} deps.appendSystemMessage - System message appender
 * @param {Object} deps.t - Translation object
 * @returns {Object} AI operations
 * @export
 */
export function createAIManager(deps) {
  const {
    setIsAiBusy,
    setAiStatus,
    setAiError,
    setInputText,
    setApiKeyInput,
    setApiKeyError,
    setIsApiKeyModalOpen,
    setIsAboutOpen,
    appendSystemMessage,
    t
  } = deps;

  /**
   * Opens the API key configuration modal
   * @param {string} currentKey - Current API key value
   * @returns {void}
   */
  function openApiKeyModal(currentKey) {
    setApiKeyInput(currentKey);
    setApiKeyError('');
    setIsApiKeyModalOpen(true);
    setIsAboutOpen(false);
  }

  /**
   * Closes the API key modal
   * @returns {void}
   */
  function closeApiKeyModal() {
    setIsApiKeyModalOpen(false);
    setApiKeyError('');
    setApiKeyInput('');
  }

  /**
   * Saves the API key and closes modal
   * @param {string} apiKeyInput - API key from input field
   * @param {Function} setOpenAiKey - API key state setter
   * @returns {void}
   */
  function saveApiKey(apiKeyInput, setOpenAiKey) {
    const trimmed = apiKeyInput.trim();
    if (!trimmed) {
      setApiKeyError(t.aiErrors.emptyKey);
      return;
    }

    setOpenAiKey(trimmed);
    setAiStatus(t.systemMessages.aiReady);
    setAiError('');
    appendSystemMessage(t.systemMessages.apiKeyStored);
    closeApiKeyModal();
  }

  /**
   * Disables AI by removing the API key
   * @param {Function} setOpenAiKey - API key state setter
   * @returns {void}
   */
  function disableAi(setOpenAiKey) {
    setOpenAiKey('');
    setAiStatus('');
    setAiError('');
    appendSystemMessage(t.systemMessages.aiDisabled);
    closeApiKeyModal();
  }

  /**
   * Continues without AI setup and saves preference to localStorage
   * @returns {void}
   */
  function continueWithoutAi() {
    closeApiKeyModal();
    setAiStatus('');
    setAiError('');
    appendSystemMessage(t.systemMessages.continueWithoutAi);

    // Save preference to localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(AI_PREFERENCE_STORAGE_KEY, 'dismissed');
      }
    } catch (error) {
      console.warn('AI preference could not be saved to localStorage.', error);
    }
  }

  /**
   * Rewrites the current input text using the selected AI provider
   * @param {string} inputText - Current input text
   * @param {string} openAiKey - OpenAI API key or Ollama endpoint
   * @param {string} aiProvider - Selected AI provider
   * @param {string} ollamaEndpoint - Custom Ollama endpoint (optional)
   * @returns {Promise<void>}
   */
  async function rewriteMessage(inputText, openAiKey, aiProvider = AI_PROVIDERS.OPENAI, ollamaEndpoint = '') {
    const draft = inputText.trim();

    if (!draft) {
      return;
    }

    // Check if credentials are set based on provider
    const needsKey = aiProvider === AI_PROVIDERS.OPENAI;
    if (needsKey && !openAiKey) {
      setApiKeyInput(openAiKey);
      setApiKeyError(t.aiErrors.emptyKey);
      setIsApiKeyModalOpen(true);
      setIsAboutOpen(false);
      return;
    }

    // Validate message length
    if (draft.length > MAX_MESSAGE_LENGTH) {
      appendSystemMessage(t.systemMessages.aiRewriteNotAttempted(MAX_MESSAGE_LENGTH));
      return;
    }

    setIsAiBusy(true);
    setAiStatus(t.systemMessages.aiReady);
    setAiError('');

    try {
      const config = getApiConfig(aiProvider, ollamaEndpoint);

      // Build headers
      const headers = {
        'Content-Type': 'application/json'
      };

      if (config.requiresAuth && openAiKey) {
        headers['Authorization'] = `Bearer ${openAiKey}`;
      }

      // Call AI API
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [
            {
              role: 'system',
              content:
                'You rewrite chat drafts to stay concise, friendly, and clear. Preserve intent, remove sensitive data, and return only the revised message.'
            },
            {
              role: 'user',
              content: draft
            }
          ],
          temperature: 0.7,
          max_tokens: 256
        })
      });

      // Handle HTTP errors
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error(t.aiErrors.unauthorized);
        }
        throw new Error(t.aiErrors.requestFailed(response.status));
      }

      // Parse response
      const data = await response.json();
      const aiText =
        data &&
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content;

      if (!aiText) {
        throw new Error(t.aiErrors.missingContent);
      }

      const cleaned = aiText.trim();
      if (!cleaned) {
        throw new Error(t.aiErrors.emptySuggestion);
      }

      // Apply rewritten text
      if (cleaned.length > MAX_MESSAGE_LENGTH) {
        setInputText(cleaned.slice(0, MAX_MESSAGE_LENGTH));
        appendSystemMessage(t.systemMessages.aiTruncated);
      } else {
        setInputText(cleaned);
      }

      setAiStatus(t.systemMessages.aiSuggestionApplied);
      setAiError('');
    } catch (error) {
      console.error('AI rewrite failed', error);
      setAiStatus('');
      setAiError(error.message || t.aiErrors.requestFailed('unknown'));
      appendSystemMessage(t.systemMessages.aiRewriteFailed(error.message || ''));
    } finally {
      setIsAiBusy(false);
    }
  }

  /**
   * Generates AI summaries for an array of issues
   * @param {Array} issues - Array of issue objects
   * @param {string} openAiKey - OpenAI API key
   * @param {string} aiProvider - Selected AI provider
   * @param {string} ollamaEndpoint - Custom Ollama endpoint (optional)
   * @returns {Promise<Array>} Issues with AI summaries added
   */
  async function generateSummaries(issues, openAiKey, aiProvider = AI_PROVIDERS.OPENAI, ollamaEndpoint = '') {
    if (!Array.isArray(issues) || issues.length === 0) {
      return issues;
    }

    // For OpenAI, we need a key. For Ollama, we don't
    const needsKey = aiProvider === AI_PROVIDERS.OPENAI;
    if (needsKey && !openAiKey) {
      return issues;
    }

    const config = getApiConfig(aiProvider, ollamaEndpoint);

    const summariesPromises = issues.map(async (issue) => {
      try {
        const prompt = `Summarize this GitHub issue in 1-2 concise sentences:\nTitle: ${issue.title}\nBody: ${issue.body || 'No description'}`;

        // Build headers
        const headers = {
          'Content-Type': 'application/json'
        };

        if (config.requiresAuth && openAiKey) {
          headers['Authorization'] = `Bearer ${openAiKey}`;
        }

        const response = await fetch(config.endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: config.model,
            messages: [
              {
                role: 'system',
                content: 'You summarize GitHub issues concisely and clearly.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.5,
            max_tokens: 128
          })
        });

        if (!response.ok) {
          return { ...issue, aiSummary: null };
        }

        const data = await response.json();
        const summary =
          data &&
          data.choices &&
          data.choices[0] &&
          data.choices[0].message &&
          data.choices[0].message.content;

        return { ...issue, aiSummary: summary ? summary.trim() : null };
      } catch (error) {
        console.error('Failed to generate summary for issue', issue.number, error);
        return { ...issue, aiSummary: null };
      }
    });

    return Promise.all(summariesPromises);
  }

  return {
    openApiKeyModal,
    closeApiKeyModal,
    saveApiKey,
    disableAi,
    continueWithoutAi,
    rewriteMessage,
    generateSummaries
  };
}
