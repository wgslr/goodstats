
import React, { } from 'react';
import { daysBetweenDates } from './utils';


const PIXELS_PER_DAY = 10;

export function Timeline({ books }) {
  const now = new Date();
  return (
    <div className="timeline">
      {books.map(b => {
        const finishedDaysAgo = daysBetweenDates(b.readAt, now);
        return <div
          key={b.title}
          className="book"
          style={{
            width: '7em',
            height: `${PIXELS_PER_DAY * b.days}px`,
            margin: '1em',
            marginTop: `${PIXELS_PER_DAY * finishedDaysAgo}px`
          }}>
          {b.title}
        </div>
      })}
    </div>
  )
}

export default Timeline;