Project Folder Structure:

- src - application related code
  - api - controllers and controller related objects & functions
  - app - use cases and use case related objects & functions
  - models - entities and types defined in typeorm
  - repos - repositories based on typeorm for interacting with the database
  - server - bootstraping express server
- tests - tests for the application

How to run:

1. `git pull` - get up to date
2. `npm install` - install all related packages
3. `npm run dc-up` - start local mssql container (uses `docker-compose.yml`)
4. `npm run init-db` - initialize local db with current schema
5. `npm run dev` - run application in dev mode

How to stop:

1. `npm run dc-stop` - stop mssql container

resources to go over for typeorm:

- datasource - https://typeorm.io/data-source
- custom repository - https://typeorm.io/custom-repository
- set foreign key number without fetching entity - https://github.com/typeorm/typeorm/issues/586
