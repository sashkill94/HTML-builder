const fs = require('fs');
const path = require('path');

async function func() {
  try {
    const files = await fs.promises.readdir(path.join(__dirname, 'secret-folder'), {
      withFileTypes: true
    });
    for (const file of files) {
      if (file.isFile()) {
        const name = file.name.split('.')[0];
        const format = path.extname(file.name).slice(1);
        const size = (await fs.promises.stat(path.join(__dirname, 'secret-folder', file.name))).size / 1000 + 'kb';
        console.log([name, format, size].join(' - '));
      }
    }
  } catch (err) {
    console.error(err);
  }

}

func()