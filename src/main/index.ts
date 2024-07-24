import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
// import icon from '../../resources/icon.png'
import "reflect-metadata";
import {AppDataSource} from '../shared/database'
import { User } from "../entity/User";
const fs = require('fs');
import Excel from 'exceljs';
const puppeteer = require('puppeteer');

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: false,
    ...(process.platform === 'linux' ? {  } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))
  
  AppDataSource.initialize()
  .then(() => {
      const data = async () => {
        // // Tạo một người dùng mới
        // const user = new User();
        // user.firstName = "John";
        // user.lastName = "Doe";
        // user.age = 25;
        // // // Lưu người dùng vào cơ sở dữ liệu
        // await AppDataSource.manager.save(user);
        // console.log("New User has been saved");
        // // // Lấy tất cả người dùng
        const users = await AppDataSource.manager.find(User);
        // console.log("Loaded users:", users);

        // //Update 
        // const userToUpdate = await AppDataSource.manager.findOne(User, { where: { firstName: "John" } });
        //   if (userToUpdate) {
        //    userToUpdate.age = 26;
        //    await AppDataSource.manager.save(userToUpdate);
        //    console.log("User has been updated");
        //   }
        
        //Delete
        // const userToDelete = await AppDataSource.manager.findOne(User, { where: { firstName: "John" } });
        //   if (userToDelete) {
        //    await AppDataSource.manager.remove(userToDelete);
        //    console.log("User has been deleted");
        //   }

        let pathName = path.join(process.cwd(), 'Files')
        const createFile = async (fileName: string, fileContent: string) => {
          let file = path.join(pathName, fileName)
          await fs.writeFile(file, fileContent, (err: Error) => {
          if(err) console.log(err)
          console.log('Created files')
          })
        }
        createFile('text.txt', JSON.stringify(users))
        createFile('json.json',JSON.stringify(users) )

        const createExcel = async () => {
          const workbook = new Excel.Workbook();
          const worksheet = workbook.addWorksheet('Sheet1');
          worksheet.columns = [
            { header: 'First Name', key: 'firstName', width: 30 },
            { header: 'Last Name', key: 'lastName', width: 10 },
            { header: 'Age', key: 'age', width: 20 },
          ];

          users.forEach((row) => {
            worksheet.addRow(row);
          });

          const filename = path.join(process.cwd(), 'Files', 'user.xlsx')
          workbook.xlsx.writeFile(filename)
          .then(() => {
              console.log(`Excel file ${filename} saved.`);
          })
          .catch((err) => {
            console.error('Error saving Excel file:', err);
          });
        }
        createExcel()
       }
    
      data()
  })
  .catch((error) => console.log(error))

  let pathName = path.join(process.cwd(), 'Files')

  const readFile = async (fileName: string) => {
    let file = path.join(pathName, fileName)
    await fs.readFile(file, (err: Error, data: string) => {
      if(err) console.log(err)
      console.log(JSON.parse(data))
    })
  }
  readFile('text.txt')
  readFile('json.json')

  const filename = path.join(process.cwd(), 'Files', 'user.xlsx')
  let workbook = new Excel.Workbook(); 
  workbook.xlsx.readFile(filename)
  .then(() => {
    const worksheet = workbook.getWorksheet('Sheet1');

    worksheet?.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      console.log(`Row ${rowNumber} = ${JSON.stringify(row.values)}`);
    });
  })
  .catch((err) => {
    console.error('Error reading Excel file:', err);
  });

  // const deleteFile = async (fileName: string) => {
  //   let file = path.join(pathName, fileName)
  //   await fs.unlink(file, (err: Error, data: string) => {
  //     if(err) console.log(err)
  //     console.log('Deleted')
  //   })
  // }
  // deleteFile('text.txt')
  
  const openPage = async () => {
    const browser = await puppeteer.launch({headless: false});
    try {
      const page = await browser.newPage();
  
      await page.goto('https://www.facebook.com/');

      await page.type('#email', '');
      await page.type('#pass', '');
      await page.click('button[type="submit"]');

      await page.waitForNavigation();

      await page.goto('https://www.facebook.com/photo?fbid=10225599895613184&set=a.2071201348605');
      // await page.click('');
      
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      await browser.close();
    }
  }
  openPage()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

