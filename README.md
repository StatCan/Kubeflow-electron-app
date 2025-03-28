# The Zone Electron App

The Zone Electron App is a minimal Electron-based application designed to provide a dedicated browsing experience for the Zone. It launches loads the Zone site without any additional browser distractions, ensuring you get a clean, focused experience.

## Features

- **Dedicated Browser:** Access only the Zone website.
- **Fullscreen Windowed Mode:** Automatically maximizes to fill the screen while remaining windowed (with borders). Fullscreen is allowed, but not a good idea. 
- **Custom Icon:** Displays a custom logo for a branded look.
- Scripts can be opened in different screens as part of the same notebook. 

## Screenshots

The first image below shows how the Zone looks like with the default web browser (Microsoft Edge): 

![](assets/browser_ex_2.png)

The second image below shows how the Zone looks like with the Electron web browser:

![](assets/browser_ex_1.png)

Clearly, the second browser makes for a nicer user experience. 

## Prerequisites

- In order to run this code from source, you will need `Node.js`. Some users may already have `Node.js` on single session AVD. 
- To check if you have `Node.js`, press `Win`+`R` on and type `cmd`. Press `Enter` to open the **Command Console**. In the command console, type: 
    ```bash
    node -v 
    ```
    If you have `Node.js`, you should see the version number of `Node.js` on your AVD. 
-  If you don't have `Node.js` you need to request for it to be installed on your Single Session AVD. 

## How to Run

1. **Clone this repository and cd to the root**
   ```bash
   git clone https://gitlab.k8s.cloud.statcan.ca/os-collab/applications/the-zone-electron-application.git
   cd zone-electron-app
   ```

2. **Install dependencies**
    ```bash
    npm install 
    ```
- **Note**: All **direct** dependencies can be found in the `package.json`. 
    - All dependencies are found in `package-lock.json`

3. **Start the app** 

    ```bash
    npm start
    ```



Needed: 

- This app needs to be built before being shipped. This repo contains the source code only. 

## How to Compile as an Executable

This application can be compiled as an executable by running the following command from your project directory: 

```bash
npx electron-packager . ZoneElectronApp --platform=win32 --arch=x64 --icon=assets/logo.png
```