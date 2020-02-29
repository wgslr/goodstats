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

function TitlesList() {
  const [
    { status, details, },
    setState
  ] = useState({
    status: STATUS.LOADING,
    details: {},
  });

  const [userId, setUserId] = useState(DEFAULT_USER_ID);

  useEffect(() => {
    setState(prev => ({
      ...prev,
      status: STATUS.LOADING,
      details: {}
    }))
    listShelvedBooks(userId).then(
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
