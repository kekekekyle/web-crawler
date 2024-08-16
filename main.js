import { argv } from 'node:process';
import { crawlPage } from './crawl.js';
import { printReport } from './report.js';

async function main () {
  if ((argv.length < 3) | (argv.length > 3)) {
    console.log('invalid arguments');
    return;
  }
  if (argv.length == 3) {
    const baseURL = argv[2];
    console.log(`Starting web-crawler with ${baseURL}`);
    const crawledPages = await crawlPage(baseURL);
    printReport(crawledPages);
    return;
  }
}

main();
