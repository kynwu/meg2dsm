<<<<<<< HEAD
# megnet2dsm

## Overview
The Synology Magnet Extension is a tool designed to enhance the functionality of Synology NAS devices by allowing users to easily add magnet links for torrent downloads. This extension simplifies the process of managing torrent downloads directly from your browser.

## Features
- **Easy Magnet Link Addition**: Quickly add magnet links to your Synology NAS.
- **Browser Integration**: Seamlessly integrates with your web browser for a smooth user experience.
- **Secure Authentication**: Ensures secure communication with your Synology NAS.

## Installation

### Prerequisites
- A Synology NAS device with DSM 6.0 or higher.
- A web browser (Chrome, Firefox, etc.).
- Git installed on your local machine.

### Steps
1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/synology_magnet_extension.git
   cd synology_magnet_extension
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Extension**
   ```bash
   npm run build
   ```

4. **Load the Extension in Your Browser**
   - Open your browser and navigate to the extensions page.
   - Enable "Developer mode".
   - Click "Load unpacked" and select the `dist` folder from the cloned repository.

## Usage
1. **Open the Extension**: Click on the extension icon in your browser toolbar.
2. **Add Magnet Link**: Enter the magnet link and click "Add".
3. **Monitor Downloads**: Check the status of your downloads directly from the extension.

## Configuration
To configure the extension, you need to provide the following details:
- **Synology NAS IP Address**
- **Port Number**
- **Username**
- **Password**

These settings can be accessed from the extension's options page.

## Troubleshooting
If you encounter issues, please ensure:
- Your Synology NAS is powered on and connected to the network.
- The IP address and port number are correctly configured.
- Your credentials are correct.

## Contributing
We welcome contributions! Please fork the repository and submit pull requests.
=======
# meg2dsm
The Synology Magnet Extension is a tool designed to enhance the functionality of Synology NAS devices by allowing users to easily add magnet links for torrent downloads. This extension simplifies the process of managing torrent downloads directly from your browser.
>>>>>>> b33c166de8da137ce94f1307cebd6141da3aa7d1
