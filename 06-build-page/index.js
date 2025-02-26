const fs = require('fs');
const path = require('path');

async function createFolder(dirPath) {
  fs.promises.mkdir(dirPath, {
    recursive: true
  });
}

async function cleanFolder(folderPath) {
  const files = await fs.promises.readdir(folderPath, {
    withFileTypes: true
  });

  if (files.length === 0) {
    await fs.promises.rmdir(folderPath);
  } else {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.isDirectory()) {
        await cleanFolder(path.join(folderPath, file.name));
      } else {
        await fs.promises.unlink(path.join(folderPath, file.name));
      }
    }
    await fs.promises.rmdir(folderPath);
  }
}

async function getArrayFromHtml(path) {
  const contents = await fs.promises.readFile(path, { encoding: 'utf8' });
  return contents.split('\n');
}

async function insertComponents() {
  const componentsPath = path.join(__dirname, 'components')
  const components = await fs.promises.readdir(componentsPath, {
    withFileTypes: true
  });

  const filePath = path.join(__dirname, 'template.html')
  const htmlDoc = await getArrayFromHtml(filePath);
  const writtebleHtml = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'))
  const regexp = /\{\{\w*\}\}/;

  for (const str of htmlDoc) {

    if (str.match(regexp)) {
      const spaces = str.split(regexp)[0];
      const matchPart = str.match(regexp)[0];

      for (const component of components) {
        if (matchPart.slice(2, matchPart.length - 2) === component.name.split('.')[0]) {
          const arr = await getArrayFromHtml(path.join(componentsPath, component.name));
          const formatterArr = arr.map(el => spaces + el);
          for (const el of formatterArr) {
            writtebleHtml.write(el);
          }
          writtebleHtml.write('\n');
        }
      }
    } else {
      writtebleHtml.write(str);
    }
  }
}

async function mergeCssFiles() {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true
  });
  const writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
      readableStream.on('readable', function () {
        readableStream.pipe(writeableStream);
        if (this.read() != null) {
          writeableStream.write('\n')
        }
      });
    }
  }

}

async function copyFolders(from, to) {
  await createFolder(to);
  const files = await fs.promises.readdir(from, {
    withFileTypes: true
  });
  if (files) {
    for (const file of files) {
      if (file.isDirectory()) {
        await copyFolders(path.join(from, file.name), path.join(to, file.name));
      } else {
        await fs.promises.copyFile(path.join(from, file.name), path.join(to, file.name));
      }
    }
  }
}

async function start() {
  try {
    await fs.promises.access(path.join(__dirname, 'project-dist'));
    await cleanFolder(path.join(__dirname, 'project-dist'));
  } catch {
  }
  // await cleanFolder(path.join(__dirname, 'project-dist'));
  await createFolder(path.join(__dirname, 'project-dist'));
  await insertComponents();
  await mergeCssFiles();
  await copyFolders(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

start();
