## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```


## Migration

```bash
# create table
# migration_name: create_tableName_table
$ npm run migration:generate db/migrations/migration_name

# add column into table
# migragion_name: add_columnName_to_tableName_table
$ npm run migration:generate db/migrations/migration_name

# set field column into table
# migragion_name: set_feature_columnName_to_tableName_table
$ npm run migration:generate db/migrations/migration_name

# run migration and up database
$ npm run migration:run

# revert migration and revert database
$ npm run migration:revert
```