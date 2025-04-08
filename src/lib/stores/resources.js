import { writable } from 'svelte/store';
import { addMessage, messageTypes } from './messages.js';

// Helper function to safely access localStorage
const isLocalStorageAvailable = () => typeof localStorage !== 'undefined';

const loadFromLocalStorage = (key, defaultValue) => {
  if (isLocalStorageAvailable()) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  }
  return defaultValue;
};

const mineralsKey = 'minerals';

// Create a writable store for minerals
export const minerals = writable(
  loadFromLocalStorage(mineralsKey, { count: 0, multiplier: 1 })
);

// Persist minerals to localStorage
if (isLocalStorageAvailable()) {
  minerals.subscribe((value) => {
    localStorage.setItem(mineralsKey, JSON.stringify(value));
  });
}

// Helper function to update minerals
const updateMinerals = (amount) => {
  minerals.update((current) => ({
    ...current,
    count: current.count + amount,
  }));
};

// Helper function to check if minerals are sufficient
const hasEnoughMinerals = (amount) => {
  let sufficient = false;
  minerals.update((current) => {
    sufficient = current.count >= amount;
    return current;
  });
  return sufficient;
};

// Function to mine minerals
export const mineMinerals = (amount = 1) => {
  updateMinerals(amount);
};

// Function to spend minerals
export const spendMinerals = (amount = 1) => {
  if (!hasEnoughMinerals(amount)) {
    addMessage('Not enough minerals', messageTypes.warning);
    return false;
  }

  updateMinerals(-amount);
  minerals.update((current) => {
    addMessage(
      `You spent ${amount} minerals, you have ${current.count} remaining.`,
      messageTypes.information
    );
    return current;
  });
  return true;
};