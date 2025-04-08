import { writable } from 'svelte/store';

// Create a writable store for messages
export const messages = writable([]);

// Define message types
export const messageTypes = {
  error: 'Error',
  warning: 'Warning',
  information: 'Information',
};

const MAX_MESSAGES = 10;

// Add a new message to the store
export const addMessage = (message, type = messageTypes.error) => {
  if (!Object.values(messageTypes).includes(type)) {
    console.warn(`Invalid message type: ${type}`);
    type = messageTypes.error;
  }

  messages.update((currentMessages) => {
    const updatedMessages = [...currentMessages, { message, type }];
    return updatedMessages.slice(-MAX_MESSAGES); // Keep only the last 10 messages
  });
};

// Clear all messages from the store
export const clearMessages = () => {
  messages.set([]);
};