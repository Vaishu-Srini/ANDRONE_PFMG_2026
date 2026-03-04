import { app, BrowserWindow } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// // In this file you can include the rest of your app's specific main process
// // code. You can also put them in separate files and import them here.

// import { app, BrowserWindow } from "electron";
// import path from "path";
// import { spawn } from "child_process";
// import started from "electron-squirrel-startup";
// let backendProcess;
// // Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (started) {
//   app.quit();
// }
// const createWindow = () => {
//   const mainWindow = new BrowserWindow({
//     width: 800,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, "preload.js"),
//     },
//   });
//   // Dev mode (Vite server)
//   if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
//     mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
//   } else {
//     mainWindow.loadFile(
//       path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
//     );
//   }
//   mainWindow.webContents.openDevTools();
// };
// // Backend executable path
// const backendPath = app.isPackaged
//   ? path.join(process.resourcesPath, "backend", "Anadrone_BackEnd.exe") // prod
//   : path.join(process.cwd(), "backend", "Anadrone_BackEnd.exe"); // dev
// app.on("ready", () => {
//   console.log("Backend path:", backendPath);
//   // Spawn backend process
//   backendProcess = spawn(backendPath, [], {
//     stdio: "inherit",
//   });
//   backendProcess.on("error", (err) => {
//     console.error("Failed to start backend process:", err);
//   });
//   backendProcess.on("close", (code) => {
//     console.log(`Backend exited with code ${code}`);
//     app.quit();
//   });
//   createWindow();
// });
// // Kill backend when Electron exits
// app.on("before-quit", () => {
//   if (backendProcess) backendProcess.kill();
// });
// // macOS: recreate window when dock icon is clicked
// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
// // Quit when all windows are closed (except macOS)
// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });
