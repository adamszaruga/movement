// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const five = require('johnny-five');
const pixel = require('node-pixel');
const opn = require('opn');
const textAdam = require('./textAdam.js')
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let isReady = false;
setTimeout(() => {
  isReady = true;
}, 5000);

// REDUX
const Redux = require('redux');
const reducer = require('./reducer.js');
const store = Redux.createStore(reducer);
store.subscribe(() => {
  if (!isReady) {
    console.log('not ready yet!')
    return;
  }
  isReady = false;
  setTimeout(() => {
    isReady = true;
  }, 1000);
  const { currentTask } = store.getState();
  console.log(`executing ${currentTask}`);
  if (currentTask === "HIDE_WINDOWS") {
    if (mainWindow) {
      mainWindow.setFullScreen(false);
      setTimeout(() => {
        mainWindow.hide()
      }, 1000);
      
      console.log('HIDE')
    };
  } else if (currentTask === "BREAKOUT") {
    if (!mainWindow) createWindow()
    mainWindow.loadFile('breakout.html');
    mainWindow.setFullScreen(true);
    mainWindow.show();
    console.log('BREAKOUT')
  } else if (currentTask === "GO_TO_LINK") {
    opn('https://zoom.us/j/2272237713');
    // opn('https://')
    console.log('LINK')
  } else if (currentTask === "THANKS") {
    console.log("thanks")
    textAdam("Theeeeeeeenk youuuuuu!");
  } else if (currentTask === "WATER") {
    console.log('water')
    textAdam("Water please!!");
  } else if (currentTask === "SNACK") {
    textAdam("Snack please!!");
    console.log('snack')
  }
})


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
var strip = null;
const board = new five.Board();

app.on('ready', () => {
  // createWindow({kiosk: true})
  // mainWindow.loadFile('breakout.html');
  // mainWindow.setFullScreen(true);
  // mainWindow.show();
  board.on('ready', function() {
    console.log('board connected!')
    let switches = new five.Switches([7, 8]);

    let initialState = {
      pin7: switches[0].isClosed,
      pin8: switches[1].isClosed,
      // pin7: switches[2].isClosed,
      // pin8: switches[3].isClosed
      
    }

    store.dispatch({
      type: 'BOARD_INIT',
      initialState
    })

    switches.on('open', ({ pin }) => {
      // console.log('open ' + pin)
      store.dispatch({
        type: 'SWITCH',
        pin,
        isClosed: false
      })
    })
    switches.on('close', ({ pin }) => {
      // console.log('close ' + pin)
      store.dispatch({
        type: 'SWITCH',
        pin,
        isClosed: true
      })
    })
    // createWindow();
  })


})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
