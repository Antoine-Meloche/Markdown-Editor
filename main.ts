import { BrowserWindow, Menu } from "electron";

export default class Main {
  static mainWindow: Electron.BrowserWindow;
  static application: Electron.App;
  static BrowserWindow;
  private static onWindowAllClosed() {
    if (process.platform !== "darwin") {
      Main.application.quit();
    }
  }

  private static onClose() {
    Main.mainWindow = null;
  }

  private static onReady() {
    Main.mainWindow = new Main.BrowserWindow({ width: 800, height: 600 });
    Main.mainWindow.loadURL("file://" + __dirname + "/index.html");
    Main.mainWindow.on("closed", Main.onClose);
  }

  static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
    const menu = Menu.buildFromTemplate([
      {
        label: "File",
        submenu: [
          {
            label: "Save",
            accelerator: "Control+S",
            click: () => {
              Main.mainWindow.webContents.send("save");
            },
          },
          {
            label: "Save as",
            accelerator: "Control+Shift+S",
            click: () => {
              Main.mainWindow.webContents.send("save-as");
            },
          },
          {
            type: "separator",
          },
          {
            role: "close",
          },
        ],
      },
      {
        label: "Edit",
        submenu: [
          {
            role: "undo",
          },
          {
            role: "redo",
          },
          {
            role: "cut",
          },
          {
            role: "copy",
          },
          {
            role: "paste",
          },
          {
            role: "selectAll",
          },
          {
            type: "separator",
          },
          {
            label: "Preferences",
            accelerator: "Control+,",
            click: () => {
              Main.mainWindow.webContents.send("preferences");
            },
          },
        ],
      },
      {
        label: "View",
        submenu: [
          {
            role: "reload",
          },
          {
            role: "toggleDevTools",
          },
          {
            type: "separator",
          },
          {
            role: "togglefullscreen",
          },
          {
            role: "zoomIn",
          },
          {
            role: "zoomOut",
          },
          {
            role: "resetZoom",
          },
        ],
      },
    ]);
    Menu.setApplicationMenu(menu);

    Main.BrowserWindow = browserWindow;
    Main.application = app;
    Main.application.on("window-all-closed", Main.onWindowAllClosed);
    Main.application.on("ready", Main.onReady);
  }
}
