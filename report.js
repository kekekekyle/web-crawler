const printReport = (pages) => {
  console.log('Report starting...');
  const pagesArray = Object.entries(pages).sort(([, a], [, b]) => b - a);
  for (const page of pagesArray) {
    console.log(`Found ${page[1]} internal links to ${page[0]}`);
  }
}

export { printReport };
