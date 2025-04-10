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
const MESSAGE_DURATION = 5000; // Time a message remains visible before fading out

// Add a new message to the store
export const addMessage = (message, type = messageTypes.information) => {
  if (!Object.values(messageTypes).includes(type)) {
    console.warn(`Invalid message type: ${type}`);
    type = messageTypes.information;
  }

  const id = Date.now(); // Unique ID for each message

  messages.update((currentMessages) => {
    // Add new message to the end of the array
    const updatedMessages = [...currentMessages, { id, message, type }];
    // Keep only the last MAX_MESSAGES messages
    return updatedMessages.slice(-MAX_MESSAGES);
  });

  // Automatically remove the message after MESSAGE_DURATION
  setTimeout(() => {
    messages.update((currentMessages) =>
      currentMessages.filter((msg) => msg.id !== id)
    );
  }, MESSAGE_DURATION);
};

// Clear all messages from the store
export const clearMessages = () => {
  messages.set([]);
};