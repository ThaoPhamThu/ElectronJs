import { contextBridge, ipcRenderer } from 'electron'
import path from "path"
const fs = require('fs');

// Custom APIs for renderer
let pathName = path.join(process.cwd(), 'Files')
// const api = {
//   createFile: async (fileName: string, fileContent: string) => {
//     let file = path.join(pathName, fileName)
//     let contents = fileContent
//     return await fs.writeFile(file, contents, (err: Error) => {
//       if(err) console.log(err)
//       console.log('Created files')
//     })
//   }
// }

contextBridge.exposeInMainWorld('api', {
  createFile: async (fileName: string, fileContent: string) => {
    let file = path.join(pathName, fileName)
    let contents = fileContent
    return await fs.writeFile(file, contents, (err: Error) => {
      if(err) console.log(err)
      console.log('Created files')
    })
  }
})
  


