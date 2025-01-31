# Warframe Relic LFG Site

Uses [React](https://react.dev/) with [Million.js](https://million.dev/) for the UI.

[Elysia](https://elysiajs.com) with [Bun](https://bun.sh) and [SQLite](https://bun.sh/docs/api/sqlite) for the backend.

Makes use of [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) (in an extremely scuffed way). Need to enable in Firefox with a feature flag.

## TODO

- [ ] Will eventually implement an auth system but that's waaaay down the line
- [ ] Implement search/ filter by relic in the posts UI

## Dev Notes

- Consider a toggle on relics page to search by reward name or relic name
- Flow for finding a squad
  - Search by reward
  - Click find squad on relics search
  - Redirect to /posts and filter by that relic
  - Find an open post
  - copy invite msg
- Flow for making a squad
  - Search by reward
  - Click create squad
  - Redirect to /posts/create or something like that
  - Prefill the form with data like username and relic
  - Allow the user to edit all form data
  - require user to input number of open slots
  - Eventually add refinement as an option
  - User creates post, post shows up in /posts

## Acknowledgements

- [WFCD Warframe Drop Data](https://github.com/WFCD/warframe-drop-data#api-endpoints)
