# Synology Magnet Extension

A Chrome extension to send magnet links to a Synology NAS for download.

## Features

- Adds a context menu item to send selected magnet links to Synology NAS.
- Notifies the user about the success or failure of the operation.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2. Go to the cloned directory:
    ```bash
    cd your-repo-name
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Build the extension:
    ```bash
    npm run build
    ```
5. Load the extension in Chrome:
    - Go to `chrome://extensions/` in your Chrome browser.
    - Enable Developer mode.
    - Click "Load unpacked".
    - Select the `build` directory.

## Usage

1. Right-click on a magnet link.
2. Select "Send to Synology NAS" from the context menu.
3. The extension will send the magnet link to your Synology NAS for download.
4. You will receive a notification about the success or failure of the operation.