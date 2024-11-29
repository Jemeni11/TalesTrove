import React from "react";

function JSONIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="M31 11v10h-2l-2-6v6h-2V11h2l2 6v-6zm-9.666 10h-2.667A1.67 1.67 0 0 1 17 19.334v-6.667A1.67 1.67 0 0 1 18.666 11h2.667A1.67 1.67 0 0 1 23 12.666v6.667A1.67 1.67 0 0 1 21.334 21M19 19h2v-6h-2zm-5.666 2H9v-2h4v-2h-2a2 2 0 0 1-2-2v-2.334A1.67 1.67 0 0 1 10.666 11H15v2h-4v2h2a2 2 0 0 1 2 2v2.334A1.67 1.67 0 0 1 13.334 21m-8 0H2.667A1.67 1.67 0 0 1 1 19.334V17h2v2h2v-8h2v8.334A1.67 1.67 0 0 1 5.334 21"></path>
    </svg>
  );
}

function CSVIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="m28 9l-2 13l-2-13h-2l2.516 14h2.968L30 9zM18 23h-6v-2h6v-4h-4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h6v2h-6v4h4a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2m-8 0H4a2 2 0 0 1-2-2V11a2 2 0 0 1 2-2h6v2H4v10h6z"></path>
    </svg>
  );
}

function TXTIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="M21 11h3v12h2V11h3V9h-8zm-1-2h-2l-2 6l-2-6h-2l2.75 7L12 23h2l2-6l2 6h2l-2.75-7zM3 11h3v12h2V11h3V9H3z"></path>
    </svg>
  );
}

function HTMLIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="M28 19v-8h-2v10h6v-2zm-4-8h-2l-1.5 4l-1.5-4h-2v10h2v-7l1.5 4l1.5-4v7h2zM9 13h2v8h2v-8h2v-2H9zm-4-2v4H2v-4H0v10h2v-4h3v4h2V11z"></path>
    </svg>
  );
}

function BookmarksHTMLIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 32 32">
      <path
        fill="currentColor"
        d="M24 16v10.752l-7.096-3.59l-.904-.457l-.9.456L8 26.748V4h10V2H8a2 2 0 0 0-2 2v26l10-5.054L26 30V16Z"></path>
      <path fill="currentColor" d="M26 6V2h-2v4h-4v2h4v4h2V8h4V6z"></path>
    </svg>
  );
}

export { JSONIcon, CSVIcon, TXTIcon, HTMLIcon, BookmarksHTMLIcon };
