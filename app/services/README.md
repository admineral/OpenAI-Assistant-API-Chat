
#### `ChatManager` Class
- **Singleton Pattern**: Ensures a single instance of `ChatManager`.
- **Constructor**: Initializes the chat state.
- **Methods**:
  - `getCurrentMessages`: Returns current messages.
  - `getInstance`: Retrieves the singleton instance of `ChatManager`.
  - `startAssistant`: Initiates the assistant with necessary details.
  - `sendMessage`: Handles sending and processing of user messages.
  - `getChatState`: Provides access to the chat's current state.
- **Error Handling**: Incorporates error handling in various methods.

### Usage
- `api.js` is used for direct interactions with the backend APIs, handling various functionalities like file uploads, assistant management, and message handling.
- `ChatManager.ts` manages the chat's internal state and operations, providing an interface to interact with the chat functionalities.

## Conclusion
Both `api.js` and `ChatManager.ts` are integral to the chat application's functioning, offering a structured approach to managing API interactions and chat state. Understanding and utilizing these modules effectively is crucial for developers working on the chat application.



--------------------------------------------







--------------------------------------------

# Code Explanation: API Functions in `api.js`

This section of the README is dedicated to explaining the various API functions defined in the `api.js` file. Each function serves a specific purpose in interacting with the server's API for various operations, like uploading images, creating threads, and managing assistants. The file is designed for developers with an intermediate level of JavaScript and API interaction knowledge.

## Overview of Functions

### `uploadImageAndGetDescription(base64Image)`

```javascript
export const uploadImageAndGetDescription = async (base64Image) => {
  // ...
};
```

- **Purpose**: Uploads a Base64 encoded image to the server and retrieves a description of the image.
- **Parameters**: `base64Image` - a string representing the image in Base64 format.
- **Process**:
  - Makes a POST request to `/api/upload_gpt4v`.
  - Sends the image in the request body.
  - Handles errors and successful uploads with console logs.
- **Returns**: A promise resolving to the JSON response containing the image description.

### `uploadFile(file)`

```javascript
export const uploadFile = async (file) => {
  // ...
};
```

- **Purpose**: Uploads a file to the server.
- **Parameters**: `file` - the file to be uploaded.
- **Process**:
  - Uses `FormData` to append the file for uploading.
  - Makes a POST request to `/api/upload`.
  - Handles errors and successful uploads with console logs.
- **Returns**: A promise resolving to the JSON response after file upload.

### `createAssistant(assistantName, assistantModel, assistantDescription, fileId)`

```javascript
export const createAssistant = async (assistantName, assistantModel, assistantDescription, fileId) => {
  // ...
};
```

- **Purpose**: Creates a new assistant entity on the server.
- **Parameters**:
  - `assistantName`: Name of the assistant.
  - `assistantModel`: Model type of the assistant.
  - `assistantDescription`: Description of the assistant.
  - `fileId`: Identifier for any associated file.
- **Process**:
  - Makes a POST request to `/api/createAssistant`.
  - Sends the assistant details in the request body.
  - Handles errors and success with console logs.
- **Returns**: A promise resolving to the JSON response containing assistant details.

### `createThread(inputmessage)`

```javascript
export const createThread = async (inputmessage) => {
  // ...
};
```

- **Purpose**: Initiates a new thread for conversation or processing.
- **Parameters**: `inputmessage` - the initial message to start the thread.
- **Process**:
  - Makes a POST request to `/api/createThread`.
  - Sends the initial message in the request body.
  - Handles errors and success with console logs.
- **Returns**: A promise resolving to the JSON response containing thread details.

### `runAssistant(assistantId, threadId)`

```javascript
export const runAssistant = async (assistantId, threadId) => {
  // ...
};
```

- **Purpose**: Executes the assistant with a given ID in a specific thread.
- **Parameters**:
  - `assistantId`: Identifier of the assistant.
  - `threadId`: Identifier of the thread in which the assistant runs.
- **Process**:
  - Makes a POST request to `/api/runAssistant`.
  - Sends the assistant and thread IDs in the request body.
  - Handles errors and success with console logs.
- **Returns**: A promise resolving to the JSON response containing the run ID and other details.

### `checkRunStatus(threadId, runId)`

```javascript
export const checkRunStatus = async (threadId, runId) => {
  // ...
};
```

- **Purpose**: Checks the status of a specific run for a thread.
- **Parameters**:
  - `threadId`: Identifier of the thread.
  - `runId`: Identifier of the run.
- **Process**:
  - Makes a POST request to `/api/checkRunStatus`.
  - Sends the thread and run IDs in the request body.
  - Handles errors and success with console logs.
- **Returns**: A promise resolving to the JSON response with the status details.

### `listMessages(threadId, runId)`

```javascript
export const listMessages = async (threadId, runId) => {
  // ...
};
```

- **Purpose**: Retrieves all messages associated with a specific thread and run.
- **Parameters**:
  - `threadId`: Identifier of the thread.
  - `runId`: Identifier of the run.
- **Process**:
  - Makes a POST request to `/api/listMessages`.
  - Sends the thread and run IDs in the request body.
  - Handles errors and success with console logs.
- **Returns**: A promise resolving to the JSON response containing a list of messages.

### `addMessage(data)`

```javascript


export const addMessage = async (data) => {
  // ...
};
```

- **Purpose**: Adds a new message to a thread.
- **Parameters**: `data` - the message data to be added.
- **Process**:
  - Makes a POST request to `/api/addMessage`.
  - Sends the message data in the request body.
  - Handles errors and success with console logs.
- **Returns**: A promise resolving to the JSON response after adding the message.

## Summary

The functions in `api.js` are essential for interacting with the backend API, providing a straightforward and async/await-based approach to handling various tasks like file uploads, assistant management, and message processing. Each function is designed to be modular and reusable, simplifying the integration of these functionalities into a broader application context.








