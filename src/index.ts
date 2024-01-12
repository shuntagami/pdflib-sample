import { readFileSync, writeFileSync } from "fs";
import { PDFDocument, rgb } from "pdf-lib";
import { exit } from "process";
import * as path from "path";
import * as fk from "@pdf-lib/fontkit";

const main = async () => {
  const doc = await PDFDocument.load(
    readFileSync(path.join("testdata", "sample.pdf"))
  );
  doc.registerFontkit(fk);
  const targetPage = doc.getPages()[0];
  if (targetPage === undefined) exit(1);

  const fontData = readFileSync("./fonts/SourceHanSans-Regular.otf");
  const customFont = await doc.embedFont(fontData, { subset: true });

  console.log(targetPage.getRotation().angle, "angle");

  const text = "This is text in an embedded font!";
  const textSize = 35;
  const textWidth = customFont.widthOfTextAtSize(text, textSize);
  const textHeight = customFont.heightAtSize(textSize);

  // Draw the string of text on the page
  targetPage.drawText(text, {
    x: 40,
    y: 450,
    size: textSize,
    font: customFont,
    color: rgb(0, 0.53, 0.71),
  });

  // Draw a box around the string of text
  targetPage.drawRectangle({
    x: 40,
    y: 450,
    width: textWidth,
    height: textHeight,
    borderColor: rgb(1, 0, 0),
    borderWidth: 1.5,
  });

  const pdfBytes = await doc.save();
  writeFileSync(path.join("results", "out.pdf"), pdfBytes);
};

main();
