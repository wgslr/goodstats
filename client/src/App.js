import React, { useState, useEffect } from 'react';
import Timeline from './Timeline.js';
import logo from './logo.svg';
import { listShelvedBooks } from './backend.js'
import './App.css';

const DEFAULT_USER_ID = '29690543';

const STATUS = {
  'LOADING': 'loading',
  'LOADED': 'loaded',
  'ERROR': 'error',
}

async function loadBooks(userId, setState) {
  try {
    const books = await listShelvedBooks(userId, 50)
    console.log("books", books);
    setState({
      status: STATUS.LOADED,
      details: { books: getBooksWithDates(books), loadTimestamp: new Date() }
    })
  } catch (error) {
    setState({
      status: STATUS.ERROR,
      details: { error }
    })
  }
}


function getBooksWithDates(books) {
  return books.filter(book =>
    book.startedAt instanceof Date && book.readAt instanceof Date
  )
}


function TitlesList() {
  const [{ status, details }, setState] = useState({
    status: STATUS.LOADING,
    details: {},
  });

  const [userId, setUserId] = useState(DEFAULT_USER_ID);

  // @TODO prevent overwriting newer data with a late older request
  useEffect(() => {
    setState({ status: STATUS.LOADING, details: {} });
    loadBooks(userId, setState);
  }, [userId]);

  let body = '';
  switch (status) {
    case STATUS.LOADING:
      body = 'Loading your books...'
      break;
    case STATUS.LOADED:
      const { books, loadTimestamp } = details;
      body =
        <div>
          <ul>
            {books.map(({ title, days, startedAt, readAt }) =>
              <li key={title}>
                {title} (read in {days} days - from {startedAt.toLocaleDateString()} to {readAt.toLocaleDateString()})
            </li>
            )}
          </ul>
          Loaded at: {loadTimestamp.toString()}

          <Timeline books={books}/>
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

      <h1>Books you have read</h1>
      {body}
    </div>
  );

}


function App() {
  return (
    <div className="App">
      <h1>Goodstats</h1>
      <p>This website uses your data from <a href="https//goodreads.com">Goodreads</a> to display a history of reading.
      No data is persisted on our servers.
      </p>
      <TitlesList />

    </div>
  );
}

export default App;
