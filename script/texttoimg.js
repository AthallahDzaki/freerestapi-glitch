var convert = function(t1, t2, t3) {
  const fs = require("fs");
  const images = require("images");
  const TextToSVG = require("text-to-svg");
  const svg2png = require("svg2png");
  const Promise = require("bluebird");

  Promise.promisifyAll(fs);

  const textToSVG = TextToSVG.loadSync("fonts/.ttf");

  const sourceImg = images("./i/1.jpg");
  const sWidth = sourceImg.width();
  const sHeight = sourceImg.height();

  const svg1 = textToSVG.getSVG(t1 || "魏长青-人人讲App", {
    x: 0,
    y: 0,
    fontSize: 24,
    anchor: "top"
  });

  Promise.coroutine(function* generateInvitationCard() {
    const targetImg1Path = "./i/1_tmp_" + t1 + ".png";
    const [buffer1, buffer2, buffer3] = yield Promise.all([svg2png(svg1)]);

    yield Promise.all([fs.writeFileAsync(targetImg1Path, buffer1)]);

    const target1Img = images(targetImg1Path);
    const t1Width = target1Img.width();
    const t1Height = target1Img.height();
    const offsetX1 = (sWidth - t1Width) / 2;
    const offsetY1 = 200;

    images(sourceImg)
      .draw(target1Img, offsetX1, offsetY1)
      .save("./i/out_" + t1 + ".png", { quality: 90 });
  })().catch(e => console.error(e));
};

exports.convert = convert;