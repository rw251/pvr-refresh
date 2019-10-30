const { app, BrowserWindow, ipcMain } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const createWindow = () => {

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show:false,
    webPreferences: {
      nodeIntegration: true
    },
    frame: false,
  });

  mainWindow.maximize();
  mainWindow.show();

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
const WebSocketServer = require('websocket').server;
const http = require('http');

var server = http.createServer((req, res) => {
  // allow cors
  res.setHeader('Access-Control-Allow-Origin', '*');
});
server.listen(8812, function() { });

// create the server
wsServer = new WebSocketServer({
  httpServer: server
});

wsServer.on('connect', (connection) => {
  console.log('user connected');
  connection.send('welcome')
});
// WebSocket server
wsServer.on('request', function(request) {
  var connection = request.accept(null, request.origin);

  // This is the most important callback for us, we'll handle
  // all messages from users here.
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      // process WebSocket message
      const msg = JSON.parse(message.utf8Data);
      if(msg.type === 'button') {
        mainWindow.webContents.send('button', msg.value);
        console.log('Button pressed: ' + msg.value);
      }
    }
  });

  connection.on('close', function(connection) {
    // close user connection
      console.log('closed');
  });
});