import { createWorker } from "tesseract.js";
import fetch from "node-fetch";
import $JSSoup from "jssoup";
import { pdf } from "pdf-to-img";
import fs from "fs";
const JSSoup = $JSSoup.default;

const URL = "https://bpitind.bpitindia.ac.in/?page_id=9148&preview_id=9148";

/* (async () => {
	const worker = await createWorker('eng');
	const ret = await worker.recognize('https://bpitind.bpitindia.ac.in/wp-content/uploads/2024/02/List-of-Nominated-Candidates_compressed.pdf');
	console.log(ret.data.text);
	await worker.terminate();
})(); */

async function imageToText(path) {
  const worker = await createWorker("eng");
  const ret = await worker.recognize(path);
  const data = ret.data.text;
  await worker.terminate;
  return data;
}

async function getHTMLData(url) {
  let data = await fetch(url);
  let html = await data.text();

  const dom = new JSSoup(html);

  return dom;
}

async function getAllNotices() {
  let pdfLinks = [];
  const htmlDoc = await getHTMLData(URL);
  const links = htmlDoc.findAll("a");

  links.forEach((ele) => {
    if (ele.attrs.href) {
      let text = ele.text;
      text = text.replace(/[^a-zA-Z0-9]/g, "_");
      let link = ele.attrs.href;
      pdfLinks.push({ subject: text, link });
    }
  });

  pdfLinks = pdfLinks.filter((ele) => {
    if (ele.link.length < 4 || ele.link.slice(ele.link.length - 4) != ".pdf")
      return false;
    return true;
  });

  return pdfLinks;
}

async function getPdfToImageToText(url, name) {
  // convert pdf to image and save it in the same directory with the same name

  const pdfPath = url;

  const doc = await pdf(pdfPath, { combinedImage: true, scale: 5 });
  let count = 0;
  const textData = [];

  for await (const page of doc) {
    await fs.writeFileSync(`./images/${name + count}.png`, page);
    let text = await imageToText(`./images/${name + count}.png`);
    await fs.unlinkSync(`./images/${name + count}.png`);
    count++;
    textData.push(text);
  }

  await fs.unlinkSync(pdfPath);

  return textData;
}

async function downloadPdf(url, name) {
  const pdfPath = url;
  const pdfStream = await fetch(pdfPath);
  const pdfBuffer = await pdfStream.arrayBuffer();

  await fs.writeFileSync(`./pdfs/${name}.pdf`, Buffer.from(pdfBuffer));
}

// downloadPdf(
//   "https://bpitind.bpitindia.ac.in/wp-content/uploads/2024/02/List-of-Nominated-Candidates_compressed.pdf",
//   "List-of-Nominated-Candidates"
// );

// getPdfToImage(
//   "./pdfs/List-of-Nominated-Candidates_compressed.pdf",
//   "List of Nominated Candidates"
// ).then((data) => {
//   console.log(data);
// });

async function downloadAllPdf(links) {
  let progress = 0;
  links.forEach(async (ele) => {
    await downloadPdf(ele.link, ele.subject);
    console.log((progress / links.length) * 100 + "%");
    progress++;
  });
}

async function getAllPdfToText(links) {
  const jsonData = { notices: [] };
  let progress = 0;

  links.forEach(async (ele) => {
    let pdfTxt = await getPdfToImageToText(
      `./pdfs/${ele.subject}.pdf`,
      ele.subject
    );

    console.log((progress / links.length) * 100 + "%");
    progress++;

    jsonData.notices.push({ subject: ele.subject, data: pdfTxt });
  });

  return jsonData;
}

async function createNoticesJson() {
  const links = await getAllNotices();
  console.log(links);
  await downloadAllPdf(links).then(() => {
    getAllPdfToText(links).then((data) => {
      fs.writeFileSync("notices.json", JSON.stringify(data));
    });
  });

  // const jsonData = await getAllPdfToText(links);

  // fs.writeFileSync("notices.json", JSON.stringify(jsonData));

  // return jsonData;
}

createNoticesJson();

// getAllNotices()
//   .then((links) => {
//     links.forEach(async (ele) => {
//       await downloadPdf(ele.link, ele.subject);
//       await getPdfToImage(`./pdfs/${ele.subject}.pdf`, ele.subject).then(
//         (data) => {
//           jsonData.notices.push({ subject: ele.subject, data });
//         }
//       );
//     });
//   })
//   .then(() => {
//     fs.writeFileSync("notices.json", JSON.stringify(jsonData));
//   });

// fetch("https://bpitind.bpitindia.ac.in/?page_id=9148&preview_id=9148").then((data) => {
//	console.log(data)
// }).catch((err) => {
//	console.log("server messed up");
//});
