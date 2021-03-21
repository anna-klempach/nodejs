import path from 'path';
import fs from 'fs';
import { pipeline } from 'stream';
import csv from 'csvtojson';

const inputPath = path.join(__dirname, './csv/book.csv');
const outputDirPath = path.join(__dirname, './txt');
fs.mkdirSync(outputDirPath, { recursive: true });
const outputPath = path.join(outputDirPath, './book.txt');

pipeline(
    fs.createReadStream(inputPath, 'utf8'),
    csv(),
    fs.createWriteStream(outputPath, 'utf8'),
    (error) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Pipeline succeeded.');
        }
    }
);