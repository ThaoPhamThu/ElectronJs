import path from "path"
const fs = require('fs');

let btnCreate = document.getElementById('btnCreate')
let btnRead = document.getElementById('btnRead')
let btnDelete = document.getElementById('btnDelete')
let fileName = <HTMLInputElement>document.getElementById('filename')
let fileContent = <HTMLInputElement>document.getElementById('filecontent')
let pathName = path.join(process.cwd(), 'Files')
btnCreate?.addEventListener('click', async () => {
    let file = path.join(pathName, fileName?.value)
    let contents = fileContent?.value
    await fs.writeFile(file, contents, (err: Error) => {
      if(err) console.log(err)
      console.log('Created files')
    })
  })