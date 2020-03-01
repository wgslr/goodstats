
import React, { } from 'react';
import { daysBetweenDates } from './utils';


const UNITS_PER_DAY = 1.2;
const UNIT = 'em';

class Column {
  bottom = 0; // earliest entry
  books = [];

  addBook(book) {
    this.books.push(book);
    this.bottom = book.startedAgo;
  }
}

export function Timeline({ books }) {
  books = preprocessBooks(books);
  const { columns, latestDay, datePoints } = arrangeColumns(books);
  console.log({ columns, latestDay });
  return (
    <div className="timeline">
      <div className="timeAxis">
        {datePoints.map(dp =>
          <div style={{
            position: 'absolute',
            top: `${(dp - latestDay) * UNITS_PER_DAY}${UNIT}`,
            marginTop: `-0.5em`,
            lineHeight: '1em',
          }}>
            {dp} days ago
          </div>
        )}
      </div>

      {
        columns.map((col, idx) =>
          <div className="column" key={idx.toString()}>
            {
              col.books.map((b, bidx) =>

                <div
                  key={b.title}
                  className="book"
                  style={{
                    width: '100%',
                    height: `${UNITS_PER_DAY * b.days}${UNIT}`,
                    maxHeight: `${UNITS_PER_DAY * b.days}${UNIT}`,
                    // margin: '1em',
                    // marginTop: `${UNITS_PER_DAY * b.readAgo}px`
                    marginTop: bidx === 0 ? `${(b.readAgo - latestDay) * UNITS_PER_DAY}${UNIT}` :
                      `${((b.readAgo) - col.books[bidx - 1].startedAgo) * UNITS_PER_DAY}${UNIT}`,

                  }}>
                  {b.title}
                </div>
              )
            }

          </div>
        )
      }</div>
  );
}

// calculates positions in days ago
// using dates provided in books objects.
function preprocessBooks(books) {
  const now = new Date();
  return books.map(b => ({
    ...b,
    duration: b.days,
    readAgo: daysBetweenDates(b.readAt, now),
    startedAgo: daysBetweenDates(b.startedAt, now),
  }))
}

/**
 * Splits books into a minimum number of columns.
 */
function arrangeColumns(books) {
  const columns = [new Column()];
  // points in time (in days ago) where a book is started or finished
  const datePoints = [];
  let latestDay = 99999;

  books.sort((b1, b2) => {
    if (b1.readAgo < b2.readAgo) return -1;
    if (b1.readAgo > b2.readAgo) return 1;
    if (b1.startedAgo < b2.startedAgo) return -1;
    if (b1.startedAgo > b2.startedAgo) return 1;
    return 0;
  });


  books.forEach(b => {
    let col = columns.find(c => c.bottom <= b.readAgo);
    if (!col) {
      col = new Column();
      columns.push(col);
    }
    col.addBook(b)
    datePoints.includes(b.readAgo) || datePoints.push(b.readAgo);
    datePoints.includes(b.startedAgo) || datePoints.push(b.startedAgo);
    latestDay = Math.min(b.readAgo, latestDay);
  });
  datePoints.sort((a, b) => a - b)
  return { columns, latestDay, datePoints };
}

export default Timeline;