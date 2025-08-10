lists of apis

<!-- -- AUTH ROUTER-- -->

- POST /signup
- POST /login
- POST /logout

<!-- -- PROFILE ROUTER -- -->

- GET /profile/view
- patch /profile/edit
- patch /profile/password

<!-- -- CONNECTIONS REQUEST -- -->

- POST /request/send/intrested/:userId
- POST /request/send/ignored/:userId
- POST/request/review/intrested/:userId
- POST/request/review/rejected/:userId

<!-- -- USER ROUTER -- -->

- GET /user/connections
- GET /user/request/received
- GET /user/feed (gets you the profiles )
