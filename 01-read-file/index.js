const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'));

stream.on('readable', function(){
  let data = this.read();
  console.log(data.toString());
  if (data != null){
    process.exit();
  }
});