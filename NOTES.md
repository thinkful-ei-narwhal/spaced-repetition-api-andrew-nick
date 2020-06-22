- Which database tables are created in the migrations?
  user table, create-language table and the create-word table
  
- What are the endpoints for user registration, login and refresh?
  user registration: POST /api/user/
  login: POST /api/auth/token
         PUT /api/auth/ = ** what is this doing? **
  refresh: /api/auth/token ?? This may be the PUT from above.
  
- What endpoints have been implemented in the language router?
  GET /api/language/ = this gets all of our words/phrases
  GET /api/language/head = ***** need to look into this endpoint *****
  POST /api/language/guess = posts your answer to the database
  
- What is the async and await syntax for? (Hint)
  We are using async/await instead of chaining our .then(). We are using it to take the req and process it 
  and making sure each interaction with the database and request works out before moving on to the next 
  action in our code.
  
- Which endpoints need implementing in the language router?
  '/api/language/head' & 'api/language/guess'

- How does the GET /api/language endpoint decide which language to respond with? 
  (Hint: Does it relate to the user that made the request?)
    This is based off of the user_id and the language associated with it.

- In the UserService.populateUserWords method, what is db.transaction?
  Hints:
  https://knexjs.org/#Transactions
  https://knexjs.org/#Builder-transacting
  https://www.postgresql.org/docs/8.3/tutorial-transactions.html
  https://www.tutorialspoint.com/postgresql/postgresql_transactions.htm
    Answer: 'All queries within a transaction are executed on the same database connection, 
    and run the entire set of queries as a single unit of work. Any failure will mean the database will 
    rollback any queries executed on that connection to the pre-transaction state.'
    Basically, we are going to make sure that everything within our 'populateUserWords' goes off without a hitch otherwise
    the database will go back what it was before called populateUserWords
  
- What is SERIAL in the create migration files? (Hint)
  SERIAL data type allows you to automatically generate unique integer numbers

- What is setval in the seed file? (Hint)
  sets sequence current value