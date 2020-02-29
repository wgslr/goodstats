const SERVER = 'localhost:3001'


export function listShelvedBooks(userId) {
  return new Promise((resolve, reject) => {
    console.log("Entered listReviews");
    const xhr = new XMLHttpRequest();
    const URL = `http://${SERVER}/goodreads/review/list?id=${userId}`;

    const titles = [];

    xhr.open("GET", URL, true);
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const xml = xhr.responseXML;
          var snapshot = xml.evaluate('//reviews/review/book/title',
            xml.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null
          );
          for (let i = 0; i < snapshot.snapshotLength; ++i) {
            const item = snapshot.snapshotItem(i);
            titles.push(item.textContent);
          }

          resolve(titles)

        } else {
          reject(`Server returned ${xhr.status} ${xhr.statusText} response`)
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
      reject(e)
    };
    xhr.send(null);
  });
}
