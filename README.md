# Warframe Relic LFG Site

Uses [React](https://react.dev/) with [Million.js](https://million.dev/) for the UI.

[Elysia](https://elysiajs.com) with [Bun](https://bun.sh) and [SQLite](https://bun.sh/docs/api/sqlite) for the backend.

Makes use of [`@scope`](https://developer.mozilla.org/en-US/docs/Web/CSS/@scope) (in an extremely scuffed way). Need to enable in Firefox with a feature flag.

1. Type `about:config` in your URL bar
2. Search for `layout.css.at-scope.enabled`
3. Enable the flag

## TODO

- [x] Refactor `/posts` search to search by relic_tier and relic_name instead of `relic_id`
- [ ] ~~Implement searching by refinement in home page~~
- [x] Show refinement state in `/posts`
- [x] Clean up types for Posts
- [x] Clean up server code
- [ ] Update server tests
- [x] Rename `state` to `refinement` for relics in db and in types
- [x] Add type-safety to query params on `/posts` route
- [ ] Implement search/ filter by relic in the posts UI
- [ ] Consider a toggle on relics page to search by reward name or relic name
- [ ] Will eventually implement an auth system but that's waaaay down the line

## Dev Notes

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
