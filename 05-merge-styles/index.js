const fs = require('fs');
const path = require('path');

async function mergeFiles() {
  const files = await fs.promises.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true
  });
  const writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readableStream = fs.createReadStream(path.join(__dirname, 'styles', file.name));
      readableStream.on('readable', function(){
        readableStream.pipe(writeableStream);
        if (this.read() != null){
          writeableStream.write('\n')
        }
      });
    }
  }

}

mergeFiles();