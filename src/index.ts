import { app, BrowserWindow, Menu, nativeTheme } from "electron";
const contextmenu = require("electron-context-menu");
const ElectronPreferences = require("electron-preferences");

contextmenu({
  prepend: (params, browserWindow) => [
    {
      role: "cut",
    },
    {
      role: "copy",
    },
    {
      role: "paste",
    },
  ],
});

const menu = Menu.buildFromTemplate([
  {
    label: "File",
    submenu: [
      {
        label: "Save",
        accelerator: "Control+S",
        click: () => {
          mainWindow.webContents.send("save");
        },
      },
      {
        label: "Save as",
        accelerator: "Control+Shift+S",
        click: () => {
          mainWindow.webContents.send("save-as");
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
          //   createPreferencesWindow();
          preferences.show();
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

let mainWindow: BrowserWindow;
app.on("ready", createMainWindow);
function createMainWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: __dirname + "/preload.js",
      nodeIntegration: true,
    },
  });
  mainWindow.loadFile(__dirname + "/index.html");
  mainWindow.on("ready-to-show", () => mainWindow.show());
  mainWindow.on("closed", () => {
    mainWindow = null;
    preferences.close();
  });
}

const preferences = new ElectronPreferences({
  browserWindowOpts: {
    width: 600,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
    },
  },
  css: "preferences.css",
  dataStore: "~/preferences.json",
  defaults: {
    general: {
      theme: "light",
    },
    editor: {
      fontSize: 16,
      fontFamily: "sans-serif",
      lineHeight: 1.5,
      tabSize: 2,
      showLineNumbers: true,
    },
  },
  sections: [
    {
      id: "general",
      label: "General",
      icon: "settings-gear-63",
      form: {
        groups: [
          {
            fields: [
              {
                type: "radio",
                key: "theme",
                label: "Theme",
                options: [
                  {
                    label: "System (default)",
                    value: "system",
                  },
                  {
                    label: "Light",
                    value: "light",
                  },
                  {
                    label: "Dark",
                    value: "dark",
                  },
                ],
              },
            ],
          },
        ],
      },
    },
    {
      id: "editor",
      label: "Editor",
      icon: "single-folded-document",
      form: {
        groups: [
          {
            fields: [
              {
                type: "number",
                key: "fontSize",
                label: "Font size",
                min: 8,
                max: 32,
              },
              {
                type: "select",
                key: "fontFamily",
                label: "Font family",
                options: [
                  {
                    label: "Sans Serif",
                    value: "sans-serif",
                  },
                  {
                    label: "Monospace",
                    value: "monospace",
                  },
                ],
              },
              {
                type: "number",
                name: "lineHeight",
                label: "Line Height",
                min: 0.5,
                max: 2,
              },
              {
                type: "number",
                name: "tabSize",
                label: "Tab Size",
                min: 1,
                max: 8,
              },
              {
                type: "checkbox",
                name: "showLineNumbers",
                label: "Show Line Numbers",
              },
            ],
          },
        ],
      },
    },
  ],
});

preferences.on("save", (preferences) => {
  nativeTheme.themeSource = preferences.general.theme;
});

preferences.on("click", (key) => {
  if (key == "resetButton") {
    preferences.reset();
  }
});
