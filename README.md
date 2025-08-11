# Video Request SPA (Vanilla JavaScript)

A single-page application for submitting and voting on video requests, built with **HTML, CSS, Bootstrap, and vanilla JavaScript**. This is my completed implementation of the [Semicolon Academy Ramadan 2020 assessment](https://github.com/yallacodecom/ramadan-2020-assessments).


## Features
- Submit video requests via validated form (required fields, email check, title ≤100 chars)
- View list of requests in real time
- Upvote/downvote system (one vote per user)
- Sorting: "New first" (default) or "Top voted first"
- Search requests by title/topic
- Super-user mode (via URL param) with:
  - Delete requests
  - Change status: `NEW` → `PLANNED` → `DONE`
  - Add YouTube embed for completed requests
  - Hide voting on completed requests
- Filter requests by status
- Responsive UI with Bootstrap

## Technologies
- HTML5
- CSS3 / Bootstrap
- Vanilla JavaScript (Fetch API for AJAX)
- Express.js backend (provided)
- MongoDB (local connection)

## How to Run
1. Clone the repo
2. Navigate to `server/` and run:
   ```bash
   npm install
   npm start
