# TopTimes Backend Core

A RESTful JSON API backend server with MongoDB or/and Postgres persistence layer.

## Getting Started

The following instructions will get you a copy of the application up and running on your local machine.

### Prerequisites

- Node.js (v10.16.0)
- npm (>= v6.9.0)
- Database: MongoDB or/and Postgres
	- [Suggested MongoDB installation](https://docs.mongodb.com/manual/installation/)
	- [Suggested Postgres installation](https://postgresapp.com/)

### Installing

```
$ # Install Mongo or/and Postgres by the suggested links above...
$ npm install
```

### Testing Databases CRUD Operations

#### MongoDB Driver

```
$ # Start MongoDB daemon...
$ ./examples/database/mongo.sample.js
$ # It should print out the result of each CRUD operations properly...
```

#### Postgres Driver

```
$ # Start Postgres server...
$ ./examples/database/postgres.sample.js
$ # It should print out the result of each CRUD operations properly...
```

### Running Server Locally

```
$ # Start MongoDB daemon or/and Postgres server...
$ npm run dev:start
```

## Testing and Contributing

### Style Lint

```
$ npm run lint
```

### Unit test

```
$ npm run test  # Run all the tests and show the leanest version of the test report
$ npm run coverage:test && npm run coverage:report  # Run all the tests and show the test coverage report
```


## Technology

* [Express.js](http://expressjs.com/)
* [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* [mongojs](https://github.com/mafintosh/mongojs)
* [Sequelize](http://docs.sequelizejs.com/en/latest/)

***[Note] All required packages and versions are listed in `package.json`***

## Author

* Marcus Hsu

