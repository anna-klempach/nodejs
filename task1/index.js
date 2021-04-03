import stream from 'stream';
import util from 'util';
process.stdin.setEncoding('utf8');

function Reverse(options) {
    if (!(this instanceof Reverse)) {
      return new Reverse(options);
    }
    stream.Transform.call(this, options);
  }
  util.inherits(Reverse, stream.Transform);
  
  Reverse.prototype._transform = function (data, enc, cb) {
    const trimmedData = data && data.toString().trim();
    if (trimmedData === '0') {
        this.push('Have a good day!\n');
        process.exit(0);
    }
    if (data) {
        this.push(`${trimmedData.split('').reverse().join('').toString()}\n`);
    }
    cb();
  };

console.log('Print something to get a reverse line. Print 0 to exit.');
const reverse = new Reverse();

process.stdin
.pipe(reverse)
.pipe(process.stdout)