const { app, BrowserWindow } = require('electron')
const path = require('path');
let apiProcess;

module.exports = {
  yuInit: function () {
    ProgramEntry();
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    },
    frame: false
  })

  let myArgs = {};
  let args = process.argv;
  args.forEach(arg => {
    if (arg.indexOf('=') !== -1) {
      const nameAndVal = arg.split('=');
      myArgs[nameAndVal[0]] = nameAndVal[1];
      console.log(nameAndVal[0] + ' = ' + nameAndVal[1]);
    }
  });

  if (myArgs['startUrl']) {
    let URL = myArgs['startUrl'];
    win.loadURL(myArgs['startUrl'])
  } else {

    const currentDirPath = __dirname.replace('app.asar', '');
    const currentBinPath = path.join(currentDirPath, 'aspbin');
    console.log(path.join(currentDirPath, 'initSettings.json'));
    const manifest = require(path.join(currentDirPath, 'initSettings.json'));

    const aspBinFileName = manifest.AspBinName;
    let binaryFile = path.join(currentBinPath, aspBinFileName);

    const os = require('os');
    if (os.platform() === 'win32') {
      binaryFile = binaryFile + '.exe';
    }

    const options = { cwd: "" };
    const cProcess = require('child_process').spawn;

    console.log('pathASP=' + binaryFile);

    apiProcess = cProcess(binaryFile, ["startURL=getUrl]"], options);

    apiProcess.stdout.on('data', async (data) => {
      console.log(`stdout: ${data.toString()}`);
      const str = data.toString();
      let index = str.indexOf('%g7nTzEA0Bxi6ZyRN%') 
      if (index !== -1) {
        index += '%g7nTzEA0Bxi6ZyRN%'.length;
        indexEnd = str.indexOf('%ZCUORn5Pn0dJ8Y7L%');
        let body = str.substring(index, indexEnd);
        let nameAndArg = body.split('$');

        if (nameAndArg[0] === 'loadURL') {
          console.log(nameAndArg[0] + ' | ' + nameAndArg[1]);
          win.loadURL(nameAndArg[1]);
        }
      }
    });

    app.on('quit', async (event, exitCode) => {
      apiProcess.kill();
    });
  }
}

function ProgramEntry() {
  app.whenReady().then(createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
}