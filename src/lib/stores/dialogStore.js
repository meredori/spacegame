import { writable } from "svelte/store";
import dialogData from "$lib/data/dialogs.json"; // Import dialog data from JSON

export const dialogState = writable({
    currentDialogId: null, // Tracks the current dialog ID
    showDialog: false, // Whether the dialog box is visible
    dialogs: dialogData // Load dialogs from JSON
});

// Function to start a new dialog sequence from a specific ID
export const startDialog = (id) => {
    dialogState.update((state) => {
        const dialog = state.dialogs.find((d) => d.id === id);
        if (dialog) {
            if (dialog.show) {
                state.currentDialogId = id;
                state.showDialog = true;
            } else {
                console.warn(`Dialog with ID "${id}" is hidden and cannot be started.`);
            }
        } else {
            console.warn(`Dialog with ID "${id}" not found.`);
        }
        return state;
    });
};

// Function to trigger the next dialog step
export const triggerDialog = () => {
    dialogState.update((state) => {
        const currentDialog = state.dialogs.find((d) => d.id === state.currentDialogId);
        if (currentDialog) {
            // Mark the current dialog as shown
            currentDialog.show = false;

            const nextId = currentDialog.nextLine;
            if (nextId) {
                const nextDialog = state.dialogs.find((d) => d.id === nextId && d.show);
                if (nextDialog) {
                    state.currentDialogId = nextId;
                } else {
                    console.warn(`Next dialog with ID "${nextId}" not found or is hidden.`);
                    state.showDialog = false; // Close the dialog box
                }
            } else {
                state.showDialog = false; // Close the dialog box if nextLine is null
            }
        }
        return state;
    });
};

// Function to mark a dialog step as shown
export const markDialog = (id) => {
    dialogState.update((state) => {
        const dialog = state.dialogs.find((d) => d.id === id);
        if (dialog) {
            dialog.show = false; // Mark the dialog as shown

            // If the dialog is currently active, trigger the next step
            if (state.currentDialogId === id) {
                triggerDialog();
            }
        }
        return state;
    });
};