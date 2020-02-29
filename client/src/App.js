import React, { useState, useEffect } from 'react';
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


function TitlesList() {

  const [{ titles, isLoading, loadTimestamp }, setState]
    = useState({ isLoading: true, titles: undefined, loadTimestamp: 0 });

  useEffect(() => {
    listReviewedBooks().then(
      titles => {
        setState(prev => ({ ...prev, titles: titles, isLoading: false, loadTimestamp: new Date() }));
      },
      error => console.log('Listing books failed', error)
    );
  }, []); // empty dependencies to load just once

  return (
    <div>
      <h1>Books you have shelved</h1>
      {
        isLoading ?
          "Loading your books..." :
          <div>
            <ul>{titles.map(t => <li key={t.toString()}>{t}</li>)}</ul>
            Loaded at: {loadTimestamp.toString()}
          </div>

      }
    </div>
  );

}


function App() {
  return (
    <div className="App">
      <TitlesList />

    </div>
  );
}

export default App;
