
import React, { } from 'react';
import { daysBetweenDates } from './utils';


const PIXELS_PER_DAY = 10;

class Column {
  bottom = 0; // earliest entry
  books = [];

  addBook(book) {
    this.books.push(book);
    this.bottom = book.startedAgo;
  }
}

export function Timeline({ books }) {
  const columns = arrangeColumns(calculateCoords(books));
  console.log('columns', columns)
  return (
    <div className="timeline">
      <div className="timeAxis"></div>

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
                    height: `${PIXELS_PER_DAY * b.days}px`,
                    maxHeight: `${PIXELS_PER_DAY * b.days}px`,
                    // margin: '1em',
                    // marginTop: `${PIXELS_PER_DAY * b.readAgo}px`
                    marginTop: bidx === 0 ? `0px` :
                      `${(b.readAgo - col.books[bidx - 1].startedAgo)  * PIXELS_PER_DAY}px`

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
function calculateCoords(books) {
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

  books.forEach(b => {
    let col = columns.find(c => c.bottom <= b.readAgo);
    if (!col) {
      col = new Column();
      columns.push(col);
    }
    col.addBook(b)
  });
  return columns;
}

export default Timeline;