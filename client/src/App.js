import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const SERVER = 'localhost:3001'
const USER_ID = '29690543';

function listReviewedBooks(userId) {
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


const STATUS = {
  'LOADING': 'loading',
  'LOADED': 'loaded',
  'ERROR': 'error',
}

function TitlesList() {
  const [
    { status, details, },
    setState
  ] = useState({
    status: STATUS.LOADING,
    details: {},
  });

  const [userId, setUserId] = useState(USER_ID);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      status: STATUS.LOADING,
      details: {}
    }))
    listReviewedBooks(userId).then(
      titles => setState(prev => ({
        ...prev,
        status: STATUS.LOADED,
        details: { titles, loadTimestamp: new Date() }
      })),
      error => setState(prev => ({
        ...prev,
        status: STATUS.ERROR,
        details: { error }
      }))
    );
  }, [userId]); // empty dependencies to load just once

  let body = '';
  switch (status) {
    case STATUS.LOADING:
      body = 'Loading your books...'
      break;
    case STATUS.LOADED:
      const { titles, loadTimestamp } = details;
      body =
        <div>
          <ul>{titles.map(t => <li key={t.toString()}>{t}</li>)}</ul>
          Loaded at: {loadTimestamp.toString()}
        </div>
      break;
    case STATUS.ERROR:
      body = 'Loading books failed: ' + details.error;
      break;
  }

  return (
    <div>
      <label>
        User ID
      <input type="text" value={userId} onChange={e => setUserId(e.target.value)} />
      </label>

      <h1>Books you have shelved</h1>
      {body}
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
