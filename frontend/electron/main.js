// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Notification, globalShortcut, Tray, Menu } = require("electron");
const exec = require("child_process").exec;
const path = require("path");
const process = require("process")
const readline = require("readline")

const nodeConsole = require("console");
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);
let child;

function printBoth(str) {
  console.log("main.js:    " + str);
  myConsole.log("main.js:    " + str);
}



// Create the browser window.
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 990,
    height: 600,
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, "guiExample.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "guiExample.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray = null
var robot = require("robotjs")
var isYShortcutRegistered = false

readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
}

process.stdin.on('keypress', function (chunk, key) {
  console.log(key)
  if (key && key.name == 'q') process.exit();
})

app.whenReady().then(() => {
  tray = new Tray(path.join(app.getAppPath(), 'images', 'icon.ico'))

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quit',
      click: async () => {
        // @Diyar: should mainWindow.destroy() if I make one
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  tray.setToolTip('mrnicegai')
  tray.setTitle('mrnicegai')

  var userTextInput = ""

  function finishedReadingUserInputCallback() {
    // we wish to start iohook here and wait until enter is pressed
    console.log(userTextInput)

    // copy and paste function
    /*
    robot.keyToggle('control','down') 
    robot.keyToggle('shift', 'down')
    robot.keyTap('left')
    robot.keyToggle('shift', 'up')
    robot.keyTap('c')
    robot.keyTap('v')
    robot.keyToggle('control','up') 
    */

    // enter 
    robot.keyTap('enter')


    setTimeout(() => {
      if (!isYShortcutRegistered) {
        globalShortcut.register('y', handleYKeystroke)
        isYShortcutRegistered = true
      }
    }, 100)
  }

  const handleYKeystroke = () => {
    if (isYShortcutRegistered) {
      globalShortcut.unregister('y')
      isYShortcutRegistered = false
    }

    robot.keyTap('y')
    
    // @Diyar: read text live here

    userTextInput = ""
    finishedReadingUserInputCallback()
  }

  isYShortcutRegistered = globalShortcut.register('y', handleYKeystroke)

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.

// @Diyar: don't need! This will just be a sys tray
//app.on("window-all-closed", function () {
  //if (process.platform !== "darwin") app.quit();
//});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.on("execute", (command) => {
  console.log("executing ls");
  child = exec("ls", function (error, stdout, stderr) {
    if (error !== null) {
      console.log("exec error: " + error);
    }
  });
});

ipcMain.on("open_json_file_sync", () => {
  const fs = require("fs");

  fs.readFile("config.json", function (err, data) {
    if (err) {
      return console.error(err);
    }
    printBoth("Called through ipc.send from guiExample.js");
    printBoth("Asynchronous read: " + data.toString());
  });
});

ipcMain.on("open_json_file_async", () => {
  const fs = require("fs");

  const fileName = "./config.json";
  const data = fs.readFileSync(fileName);
  const json = JSON.parse(data);

  printBoth("Called through ipc.send from guiExample.js");
  printBoth(
    `Data from config.json:\nA_MODE = ${json.A_MODE}\nB_MODE = ${json.B_MODE}\nC_MODE = ${json.C_MODE}\nD_MODE = ${json.D_MODE}`
  );
});
