const readline = require('readline');
const fs = require('fs');
const path = require('path');
const process = require('process');

const writteble = fs.createWriteStream(path.join(__dirname, 'text.txt'));

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

process.stdout.write('Enter a string:\n')

rl.on('line', (input) => {
  if (input.toLowerCase() === 'exit') {
    console.log('Have a nice day, User!');
    rl.close();
  } else {
    writteble.write(`${input}\n`);
  }
});

rl.on('SIGINT', () => {
  console.log('Have a nice day, User!');
  rl.close();
});