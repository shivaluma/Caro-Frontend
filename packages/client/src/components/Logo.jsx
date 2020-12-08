import clsx from 'clsx';
import React from 'react';

const Logo = ({ className }) => {
  return (
    <svg className={clsx(className)} viewBox="0 0 24 24" title="puzzle">
      <path
        style={{ fill: 'rgba(21,27,38,.75)' }}
        d="M18 10C16.9 10 16 10.9 16 12H12V8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4V0H22C23.1 0 24 0.9 24 2V12H20C20 10.9 19.1 10 18 10ZM6 14C7.1 14 8 13.1 8 12H12V16C13.1 16 14 16.9 14 18C14 19.1 13.1 20 12 20V24H2C0.9 24 0 23.1 0 22V12H4C4 13.1 4.9 14 6 14Z"
      />
      <path
        style={{ fill: '#fff' }}
        d="M10 6C10 7.1 10.9 8 12 8V12H8C8 13.1 7.1 14 6 14C4.9 14 4 13.1 4 12H0V2C0 0.9 0.9 0 2 0H12V4C10.9 4 10 4.9 10 6ZM14 18C14 16.9 13.1 16 12 16V12H16C16 10.9 16.9 10 18 10C19.1 10 20 10.9 20 12H24V22C24 23.1 23.1 24 22 24H12V20C13.1 20 14 19.1 14 18Z"
      />
    </svg>
  );
};

export default Logo;
