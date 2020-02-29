const SERVER = 'localhost:3001'

export async function listShelvedBooks(userId) {
  const xmlDoc = await get('/review/list', { id: userId });
  var snapshot = xmlDoc.evaluate('//reviews/review/book/title',
    xmlDoc.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
  );
  const titles = [];
  for (let i = 0; i < snapshot.snapshotLength; ++i) {
    const item = snapshot.snapshotItem(i);
    titles.push(item.textContent);
  }

  return titles;
}


async function get(path, queryParams) {
  const url = new URL(`http://${SERVER}/goodreads/${path}`);
  url.search = new URLSearchParams(queryParams).toString();
  const response = await window.fetch(url, { mehod: 'GET', })
  if (!response.ok) {
    throw (`Server returned ${response.status} ${response.statusText} response`)
  }
  const body = await response.text();
  const doc = (new DOMParser()).parseFromString(body, 'application/xml');
  console.log("Parsed as ", doc)
  return doc;
}
