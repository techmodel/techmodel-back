# Tech Model

### Project Folder Structure

- src - application related code
  - api - controllers and controller related objects & functions
  - app - use cases and use case related objects & functions
  - models - entities and types defined in typeorm
  - migrations - contains migration files
  - repos - repositories based on typeorm for interacting with the database
  - server - bootstraping express server
- tests - tests for the application

### Running for development

to run the app you need:

1. git
2. node (version 14)
3. docker and docker-compose

Then, to run the application do:

1. `git pull` - get up to date
2. `npm install` - install all related packages
3. `npm run dc-up` - start local mssql container (uses `docker-compose.yml`)
4. `npm run init-db` - initialize local db with current schema
5. `npm run dev` - run application in dev mode

### Stopping

1. `npm run dc-stop` - stop mssql container

### Migrations

- we use the `.env` configuration to run the migartion generation
  - MAKE SURE YOUR `.env` CONFIGURATION IS SET TO THE LOCAL DB
- typeorm will connect to the database defined in the `.env` and diff it with the current entities with have
- in each migration, all of the statements we run are in a single transaction, be it inside the `await queryRunner.query` or all of the `await queryRunner.query` statements together. if one of them fails, then none will run
- each migration that is executed is saved to the `migrations` table, that way we know which migrations we already ran
- each new migration that is added, when we try to run the migrations is checked against the `migrations` table to see if we need to run it
- we use ONLY the `up` (or in other words, rolling forward) migrations, DO NOT use the `down` migrations as they are not maintained

#### Creating New Migration:

1. change the models the way you want
2. install globaly `dotenv-cli` if you still didnt - `npm install -g dotenv-cli`
3. run `docker-compose down` then `docker-compose up -d`.
   we do this because we want our database to be clean
4. run `npm run typeorm-dev migration:run` to get the local database up to date with the current migrations
5. run `npm run typeorm-dev migration:generate ./src/migrations/**migration name**` to create a new migration that contains the diff
6. run `npm run typeorm-dev migration:run` again to apply the new migration

Resources for TypeORM:

- datasource - https://typeorm.io/data-source
- custom repository - https://typeorm.io/custom-repository
- set foreign key number without fetching entity - https://github.com/typeorm/typeorm/issues/586
