import { JSDOM } from 'jsdom';

const normalizeURL = (urlString) => {
  const url = new URL(urlString);
  const host = url.host;
  const pathname = url.pathname.slice(-1) === '/' ? url.pathname.slice(0, url.pathname.length -1) : url.pathname;
  return `${host}${pathname}`;
}

const getURLsFromHTML = (htmlBody, baseURL) => {
  const dom = new JSDOM(htmlBody);
  const anchors = dom.window.document.querySelectorAll('a');
  const urls = [];

  for (const anchor of anchors) {
    if (anchor.hasAttribute('href')) {
      let href = anchor.getAttribute('href');

      try {
        href = new URL(href, baseURL).href;
        urls.push(href)
      } catch (err) {
        console.log(`${err.message}: ${href}`);
      }
    }
  }
  return urls;
}

const crawlPage = async (baseURL, currentURL = baseURL, pages = {}) => {
  const currentURLObj = new URL(currentURL);
  const baseURLObj = new URL(baseURL);
  if (currentURLObj.hostname != baseURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (!pages[normalizedCurrentURL]) {
    pages[normalizedCurrentURL] = 1;
  } else {
    pages[normalizedCurrentURL]++;
    return pages
  }

  const html = await fetchPage(currentURL);
  const urls = getURLsFromHTML(html, baseURL);
  for (const url of urls) {
    pages = await crawlPage(baseURL, url, pages);
  }

  return pages;
}

const fetchPage = async (currentURL) => {
  try {
    const response = await fetch(currentURL);
    const status = response.status;

    if (status >= 400) {
      console.log(`status code: ${status}`);
      return;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(`got invalid content-type: ${contentType}`);
      return;
    }

    const responseBody = await response.text();
    return responseBody;
  } catch (err) {
    console.log(`err: ${err}`);
  }
}


export { normalizeURL, getURLsFromHTML, crawlPage };
