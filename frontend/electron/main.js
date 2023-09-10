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

const startCodeFunction = (message, callback) => {
  printBoth("Initiating program");
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn('python',["./python/pythonExample.py", `"${message}"`]);
  let globalData = "";
  
  pythonProcess.stdout.on('data', (data) => {
    // Do something with the data returned from python script
    globalData = data.toString("utf8");
    callback(globalData);
   });
  };

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
var inputModeFlag = false

const endInputMode = () => {
  for (let i = 33; i <= 126; i++) {
    if (i === 43) continue

    const asciiChar = String.fromCharCode(i)

    globalShortcut.unregister(asciiChar)
  }

  globalShortcut.unregister('Backspace')
  globalShortcut.unregister('Escape')
  globalShortcut.unregister('Space')
  globalShortcut.unregister('Return')

}

const handleYKeystroke = () => {
  if (isYShortcutRegistered) {
    globalShortcut.unregister('y')
    isYShortcutRegistered = false
  }

  robot.keyTap('y')

  // register all keys to global shortcut
  for (var i = 33; i <= 126; i++) {
    if (i == 43) continue
    const asciiChar = String.fromCharCode(i)

    if (asciiChar === 'y') {
      if (isYShortcutRegistered) {
        globalShortcut.unregister('y')
      }

      globalShortcut.register('y', () => {
        userInputText += 'y'
      })
      isYShortcutRegistered = true
      continue
    }
    
    globalShortcut.register(asciiChar, () => {
      console.log(asciiChar)
      userInputText += asciiChar
    })
  }

  globalShortcut.register('Backspace', () => {
    if (userInputText !== "") {
      userInputText.slice(0, -1)
    }
  })
  globalShortcut.register('Space', () => {
    userInputText += " "
  })
  globalShortcut.register('Escape', () => {
    endInputMode()
  })
  globalShortcut.register('Return', () => {
    endInputMode()
    finishedReadingUserInputCallback(userInputText)
  })
}

function finishedReadingUserInputCallback(input) {
  // here is where we shove input into the python scripts
  var output = "HEY";
  // message = "You're such a loser!"
  message = input;
  // replace all spaces with @ symbols to go in as one argument
  const replacedMessage = message.replace(/ /g, '@');

  startCodeFunction(replacedMessage, (result) => {
    console.log("Result from Python:", result);
    output = result;
  });

  // Determine the correct modifier key based on the OS
  const isMac = process.platform === "darwin"
  const modifierKey = isMac ? "command" : "control"

  // clear old input and put in new
  robot.keyToggle(modifierKey, 'down')
  robot.keyToggle('shift', 'down')

  robot.keyTap('a')
  robot.keyTap('delete')

  robot.keyToggle(modifierKey, 'up')
  robot.keyToggle('shift', 'up')

  // add robot to add to clipboard but you can do robot.typeString for now..
  robot.typeString(output)
  
  // enter 
  robot.keyTap('enter')

  setTimeout(() => {
    if (!isYShortcutRegistered) {
      globalShortcut.register('y', handleYKeystroke)
      isYShortcutRegistered = true
    }
  }, 100)
}

var userInputText = ""
readline.emitKeypressEvents(process.stdin);

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
}

process.stdin.on('keypress', function (chunk, key) {
  if (inputModeFlag) {
  
    console.log(key)
    if (key && key.name === 'escape') {
      inputModeFlag = false
      process.exit()
    } else if (key && key.name === 'return') {
      finishedReadingUserInputCallback(userInputText)
      inputModeFlag = false
      //process.exit();
    } else {
      userInputText += key.sequence
    }
  }
})

app.whenReady().then(() => {
  tray = new Tray(path.join(app.getAppPath(), 'images', 'icon.png'))

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
