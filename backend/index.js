import createWorker from "tesseract.js";
import fetch from "node-fetch";
import { parseFromString } from "dom-parser";
import $JSSoup from 'jssoup';
const JSSoup = $JSSoup.default;

const URL = "https://bpitind.bpitindia.ac.in/?page_id=9148&preview_id=9148";

/* (async () => {
	const worker = await createWorker('eng');
	const ret = await worker.recognize('https://bpitind.bpitindia.ac.in/wp-content/uploads/2024/02/List-of-Nominated-Candidates_compressed.pdf');
	console.log(ret.data.text);
	await worker.terminate();
})(); */

async function imageToText(path)

	const worker = await createWorker('eng');
	const ret = await worker.recognize(path);
	const data = ret.data.text;
	await worker.terminate;
	return data;
}	

async function getHTMLData(url)
{
	let data = await fetch(url);
	let html = await data.text();

	const dom = new JSSoup(html);

	return dom;
}

async function getAllNotices()
{
	let pdfLinks = [];
	const htmlDoc = await getHTMLData(URL);
	const links = htmlDoc.findAll('a');

	links.forEach((ele) => {
		if(ele.attrs.href)
		{
			let link = ele.attrs.href;
			pdfLinks.push(link);
		}
	
	});
		
	pdfLinks = pdfLinks.filter((ele) => {
		if(ele.length < 4 || ele.slice(ele.length - 4) != ".pdf") return false;
		return true;
	});

	return pdfLinks;
}



getAllNotices().then((links) => console.log(links));

// fetch("https://bpitind.bpitindia.ac.in/?page_id=9148&preview_id=9148").then((data) => {
//	console.log(data)
// }).catch((err) => {
//	console.log("server messed up");
//});
