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
- [x] Update server tests
- [x] Rename `state` to `refinement` for relics in db and in types
- [x] Add type-safety to query params on `/posts` route
- [x] Implement search/ filter by relic in the posts UI. *Done, but consider further improvements.*
- [ ] Implement ability to create a post (assuming user is logged in).
  - [ ] Flesh out the create-squad page
  - [ ] Create a form to create a post
    - [ ] Relic (tier + name) and refinement (determine the relic_id based on these)
    - [ ] Number of open slots
  - [ ] Make the form submit a POST request to the server
  - [ ] Make a /post/:id route that shows a single post
    - [ ] UI should be different if the user is the creator of the post
    - [ ] Allow the creator to delete or update the post
- [ ] Implement sorting by fields in the posts UI
- [ ] Consider a toggle on relics page to search by reward name or relic name
- [ ] Consider searching by reward name in the posts UI. *I think this is a good idea but it might be scope creep*

## TODO Later

- [ ] Implement user authentication. Full on account system.
  - [ ] Sign up
  - [ ] Log in
  - [ ] Log out
  - [ ] Update user info

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

The *Best* way to implement accounts would be to make sure username matches Warframe username. 
Kind of like how warframe.market does it.
But that's a lot of work. Def overkill since no one is gonna use this lol.

## Acknowledgements

- [WFCD Warframe Drop Data](https://github.com/WFCD/warframe-drop-data#api-endpoints)
