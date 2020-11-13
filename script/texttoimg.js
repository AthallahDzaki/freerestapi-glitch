var fs = require('fs');
var text2png = require('text2png');

async function Convert(text){
  fs.writeFileSync('./out/tti.png', text2png(text, {color: 'black'}));
  var data = base64_encode('./out/tti.png')
  return data;
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}

module.exports = {
  Convert
}