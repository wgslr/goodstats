import React from 'react';
import logo from './logo.svg';
import './App.css';

const SERVER = 'localhost:3001'
const USER_ID = '29690543';

function listReviewedBooks() {
  return new Promise((resolve, reject) => {
    console.log("Entered listReviews");
    const xhr = new XMLHttpRequest();
    const URL = `http://${SERVER}/goodreads/review/list?id=${USER_ID}`;

    const titles = [];

    xhr.open("GET", URL, true);
    xhr.onload = function (e) {
      console.log("onload", e)
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("parsing")

          console.log('responseText', xhr.responseText);
          const xml = xhr.responseXML;
          console.log('xml', xml);

          var snapshot = xml.evaluate('//reviews/review/book/title', xml.documentElement, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
          console.log("Snaphsot: ", snapshot);
          for(let i = 0; i < snapshot.snapshotLength; ++i) {
            const item = snapshot.snapshotItem(i);
            console.log('item', item);
            titles.push(item.textContent);
          }
          
          // while (thisTitle) {
          //   console.log(s)
          //   titles.push(thisTitle.textContent)
          //   thisTitle = titleIterator.iterateNext();
          // }	
          console.log("resolving with ", titles)
          resolve(titles)

        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.send(null);
  });
}

listReviewedBooks().then(titles => console.log('titles', titles), error => console.log('list failed', error));

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {/* <p>Reviews: {await listReviewedBooks()}</p> */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
