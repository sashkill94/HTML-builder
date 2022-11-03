const fs = require('fs');
const path = require('path');

async function createFolder() {
  await fs.promises.mkdir(path.join(__dirname, 'files-copy'), {
    recursive: true
  });
}

async function copyFolder() {
  const dirFiles = await fs.promises.readdir(path.join(__dirname, 'files-copy'));
  for (const file of dirFiles){
    fs.promises.unlink(path.join(__dirname, 'files-copy', file));
  }
  const files = await fs.promises.readdir(path.join(__dirname, 'files'));
  if (files) {
    for (const file of files) {
      await fs.promises.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file));
    }
  }
}

createFolder();
copyFolder();