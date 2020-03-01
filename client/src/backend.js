import {daysBetweenDates} from './utils';

const SERVER = 'localhost:3001'

class HttpException {
  constructor(code, codeText) {
    this.code = code;
    this.codeText = codeText;
  }

  toString() {
    return `Server returned ${this.code} ${this.codeText} response`;
  }
}

/**
 * Lists the first page of "reviewed" (shelved) books.
 */
export async function listShelvedBooks(userId, maxItems = 30) {
  const xmlDoc = await get('/review/list', { id: userId, per_page: maxItems, sort: 'date_read' });
  const { reviews } = parseReviewListResponse(xmlDoc);

  return reviews;
}


function getSingleXmlElement(xmlDoc, parent, query) {
  return xmlDoc.evaluate(
    query, parent, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
  ).singleNodeValue;
}

/**
 * Extracts interesting fields from the XML response.
 * @param Document xmlDoc
 */
function parseReviewListResponse(xmlDoc) {
  const reviewsElement = getSingleXmlElement(xmlDoc, xmlDoc.documentElement, 'reviews');
  const { start, end, total } = reviewsElement; // extract paging information
  const reviews = [];

  const reviewsSnapshot = xmlDoc.evaluate('//reviews/review',
    xmlDoc.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
  );

  for (let i = 0; i < reviewsSnapshot.snapshotLength; ++i) {
    const review = reviewsSnapshot.snapshotItem(i);

    const shelves = [];
    const shelvesSnapshot = xmlDoc.evaluate('shelves/shelf',
      review, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
    );

    for (let j = 0; j < shelvesSnapshot.snapshotLength; ++j) {
      shelves.push(shelvesSnapshot.snapshotItem(j).attributes['name'])
    }

    const started = getSingleXmlElement(xmlDoc, review, 'started_at').textContent;

    let startedAt = getSingleXmlElement(xmlDoc, review, 'started_at').textContent;
    let readAt = getSingleXmlElement(xmlDoc, review, 'read_at').textContent;
    startedAt = startedAt ? parseDate(startedAt) : null;
    readAt = readAt ? parseDate(readAt) : null;
    let days = startedAt && readAt ? daysBetweenDates(startedAt, readAt) : null;

    reviews.push({
      shelves, startedAt, readAt, days,
      title: getSingleXmlElement(xmlDoc, review, 'book/title').textContent,
    })
  }

  return { start, end, total, reviews }
}


/**
 * Parses date in format used by the Goodreads API
 * e.g. Fri Jun 28 14:24:08 -0700 2019
 */
function parseDate(string) {
  const [, monthStr, day, , , year] = string.split(' ');
  const month = {
    'Jan': 0,
    'Feb': 1,
    'Mar': 2,
    'Apr': 3,
    'May': 4,
    'Jun': 5,
    'Jul': 6,
    'Aug': 7,
    'Sep': 8,
    'Oct': 9,
    'Nov': 10,
    'Dec': 11,
  }[monthStr];
  return new Date(year, month, day);
}


async function get(path, queryParams) {
  const url = new URL(`http://${SERVER}/goodreads/${path}`);
  url.search = new URLSearchParams(queryParams).toString();
  const response = await window.fetch(url, { mehod: 'GET', })
  if (!response.ok) {
    throw new HttpException(response.status, response.statusText);
  }
  const body = await response.text();
  const doc = (new DOMParser()).parseFromString(body, 'application/xml');
  return doc;
}
