# Dockerized end-to-end testing setup
This is a plug-in end-to-end UI test setup for Node.js based applications. The goal is to provide a setup that can mostly be copied into an existing project and after a few configuration changes you can start writing test cases.

The setup assumes that your application already runs in a docker container, but this can just as well be used on a naked application. Just pay a bit more attention to environment setup in `docker-compose.yml`.

## Demo
Run `docker-compose run --rm test-runner` to see tests get executed. Then open a `VNC` connection to `localhost:5901` and run the tests again. You should now be able to see the browser where the tests are run.

You may also verify that the core application has no dependency on this test setup, which is the case in your current project, too. Run `docker-compose run --rm server` and open `localhost:8000`.

## Arhitecture
When running end-to-end tests the following services are running:
- `test-runner`: Runner. When updating tests, only re-run this container, no other services need to be rebuilt/restarted.
- `test-server`: The application server the specs are run against. If implementation changes, be sure to mount the application code as a volume and have the server restart automatically.
- `test-database`: The database that the application uses. The `test-runner` may also access the database in order to create preconditions for each test case.
- `selenium`: Kind of a helper for `test-runner`. Also provides VNC server for you to spectate on the test run.

## File structure
- `server/`: Sample application server which uses a database.
  - Replace with your own.
- `test-ui/`: Specs only.
  - Replace with your own.
- `config/`: Regular Node.js application configuration as per the `config` npm module convention.
  - Replace with your own.
- `Dockerfile`: Application image.
  - Replace with your own.
- `test-runner/`: Configuration for WebdriverIO. Currently only the `.conf.js` file.
  - Copy as-is.
- `package.json`: Regular Node.js application package plus test dependencies.
  - Note the `devDependencies` which are required for the `test-runner` container to work.

## docker-compose.yml services
- `server`: Sample application.
  - Replace with your own.
- `database`: Sample database, used by the application only.
  - Replace with your own.
- `test-server`: Sample application.
  - Replace with your own. The same as `server`, but advised to link to a different database container.
- `test-database`: Sample database, used by the `test-server` and the `test-runner`
  - Replace with your own. The same as `database`
  - Includes an optional additional volume which has a few non-durable configuration settings for PostgreSQL aimed to improve test performance some.
- `test-runner`: Run this container to execute your end-to-end tests.
  - Copy-with-modifications.
  - Advised to use the application image as its base so that any database helpers / models you have created can be utilized in your specs, but this is not necessary.
  - Mounted `volumes` are required.
  - Configure environment the same as your `test-server` so that this container is able to access the same database as the server the specs are run against.
  - It helps if the startup command uses `wait-for-it.sh` to wait until test database and test server are running (and selenium, too, but it seems to start very quickly anyway).
  - Be sure to depend on the `selenium` service.
  - Be sure to depend on the `test-server` and `test-database` services if your work flow doesn't otherwise start them.
- `selenium`: Selenium standalone server with chrome and debugging (VNC server).
  - Copy-as-is.

## Observing the test execution
You may view the browser execution while the tests are running. For this purpose, the `selenium` container maps the port `5901` to host. Use any `VNC` client and connect to `localhost:5901` after the container has started. The default password to the VNC connection appears to be `secret`. The same VNC session can be left running across multiple test runs.
