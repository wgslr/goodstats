import React from 'react';
import logo from './logo.svg';
import './App.css';
import { apiKey, userId } from './secrets.js'

function listReviews() {
  console.log("Entered listReviews");
  const xhr = new XMLHttpRequest();
  const URLBase = 'https://cors-anywhere.herokuapp.com/www.goodreads.com';
  const URLParams = `?v=2&key=${apiKey}&id=${userId}`
  const URL = URLBase + `/review/list` + URLParams
  xhr.open("GET", URL, true);
  xhr.onload = function (e) {
    console.log("onload", e)
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        console.log(xhr.responseText);
        console.log(xhr.responseXML);
        const xml = xhr.responseXML;
        console.log(xml.documentElement.children)
      } else {
        console.error(xhr.statusText);
      }
    }
  };
  xhr.onerror = function (e) {
    console.error(xhr.statusText);
  };
  xhr.send(null); 
}

listReviews();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Api Key: {apiKey} user {userId}</p>
        {/* <p>Reviews: {listReviews()}</p> */}
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
