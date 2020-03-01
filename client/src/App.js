import React, { useState, useEffect } from 'react';
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
    const books = await listShelvedBooks(userId)
    console.log("books", books);
    setState({
      status: STATUS.LOADED,
      details: { books, loadTimestamp: new Date() }
    })
  } catch (error) {
    setState({
      status: STATUS.ERROR,
      details: { error }
    })
  }
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
          <ul>{books.map(b => <li key={b.title}>{b.title}</li>)}</ul>
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
