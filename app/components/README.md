# README for `components` 

## Overview
The `components` folder contains React components essential for the user interface of our chat application. Each component is designed to fulfill specific roles within the application, enhancing user interaction and experience.

---

## `InputForm`

### Description
`InputForm` is a React component for the chat input field. It allows users to type and send messages to the chatbot.

### Key Features
- Utilizes `Textarea` from `react-textarea-autosize` for a dynamic input field.
- Incorporates a send button with conditional rendering for loading state and disabled state.
- Handles keyboard events for message submission.

### Usage
The component is used in the chat interface to allow users to input and submit their messages.

---

## `LinkBar`

### Description
`LinkBar` provides quick access links (Vercel, GitHub) in the chat application's user interface.

### Key Features
- Contains links to external resources like deployment and repository pages.
- Utilizes custom icons for visual appeal and intuitive navigation.

### Usage
This component is generally placed at the top of the application interface for easy access to relevant external links.

---

## `MessageList` and `Message`

### Description
`MessageList` displays a list of chat messages, each rendered by the `Message` component.

### Key Features
- `MessageList` iterates over an array of messages, passing each message to the `Message` component.
- `Message` displays individual messages, distinguishing between user and assistant messages visually.
- Integrates `ReactMarkdown` for message formatting, supporting markdown syntax.

### Usage
These components are central to displaying the conversation between the user and the AI assistant.

---

## `WelcomeForm`

### Description
`WelcomeForm` is a React component for the initial setup interface of the chatbot, allowing users to customize the assistant's parameters.

### Key Features
- Provides input fields for setting the assistant's name, description, and model.
- Includes a file upload feature with visual feedback.
- Displays a progress bar indicating the initialization status of the chat assistant.

### Usage
This form is presented to the user at the beginning of the chat session to configure the assistant and upload necessary files.

---


## Conclusion
The `components` folder contains essential building blocks of the user interface for our chat application. Proper understanding and usage of these components are key to enhancing the application's functionality and user experience.