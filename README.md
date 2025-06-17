# Bolt

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.0.0.

This application built with **Angular** as the FrontEnd side.
**Node.js**, **Express**. as the BackEnd side.
**MongoDB Atlas** for Database.
This app is written by **Typescript** and follows **SOLID principles**, **Hexagonal Architecture**, **Repository Pattern** and incorporates **Design Patterns** for maintainability and scalability.

**Api Description**.

The `getCars` api function is following these principles:
- **SOLID Principles**:
  - **Single Responsibility Principle (SRP)**: The `getCars` function in the controller is handle the data params valid. Then it will call the `getCars` function inside the service `car.service.ts` to check the logic for available cars in the season and calculate the price for each car.
  - **Open/Closed Principle (OCP)**: The `car.service.ts` is the class use for the logic define and for reusable methods.
  - **Dependency Inversion Principle (DIP)**: The `car.service.ts` depends on abstractions `car.repository.ts` not on concretions.

- **Hexagonal Architecture**:
  - The `car.service.ts` define the business logic for calculating the price and slots to book a car (reminingStock). It interacts with the `car.repository.ts` to fetch data from the database.

- **Repository Pattern**:
  - The `car.repository.ts` abstracts the database operations for fetching car data from mongodb.

- **Design Patterns**:
  - **Dependency Injection**: The `car.service.ts` get `car.repository.ts` as dependencies, making it easier to test and reuseable.
  - **Factory Pattern**: The `car.service.ts` uses helper functions like `calculateTotalPrice` to calculate pricing logic, which can be extended or reuse, replace without modifying the service.

The `book` api function is following these principles same as `getCars` api:
- **SOLID Principles**:

  - **Single Responsibility Principle (SRP)**: The `createBooking` function in the controller only handles HTTP request validation. Then it will call the `bookACar` in `car.service.ts` to check the logic and validation to create a booking for car.
  - **Dependency Inversion Principle (DIP)**: The `car.service.ts` depends on an abstraction (`car.repository.ts`) not on concretions.

- **Hexagonal Architecture**:
  - The `car.service.ts` define the business logic for check duplicated booking, check lisence validate, car stock pricing to create a payload. It interacts with the `car.repository.ts` to add new data into the database.

- **Repository Pattern**:
  -  The `car.repository.ts` abstracts the database operations for add a car data into mongodb.

- **Design Patterns**:
  - **Dependency Injection**: The `car.service.ts` get `car.repository.ts` as dependencies, making it easier to test and reuseable.

- **Barrel Pattern**:
  - **Dependency Injection**: The barrel pattern is a file organization pattern that allows you to export all modules in a directory through a single file for example `routers` directory define with export all modules.

## Note:
- Because it's a test project so I dont handle too much features for it, Just basic features based on requirement and US and focus on main request from the test description. I didn't handle the guard protection for api for check duplicate booking car base on a user name, just base on date range format and submit a simple data to get available car and book a car (but I also add validate for booking method with check lisence expired with FE code, check duplicate booking with api). I've just write some simple UT for BE apis and default generate test format for FE side. So please forgive me if you think this is too simple applications.

## Things to improve:

- Improve protection with guard protection for apis in carRoutes.
- Handle validate input, request, logic business to fetch the data to make is look faster and improve database query, etc...
- Improve UI/UX for FE because Im also have some advantage skill on it. For now I only use angular material and tailwindcss for quick UI define.
- Improve FE sided with more test case and complete test jest function, not a simple test for now.
- Improve performance for both FE and BE (improve bundle file, optimaze css minimal, handle some pagination, try to do split the modules and components with more detail functions to improve the structure and reuseable functions.)
- Apply a complete Unit Test with coverage generated reports.


## Getting Started

### Prerequisites

- **Node.js** (20 or higher) - Im using v22.
- **MongoDB** (local or cloud instance) - Im using mongo cloud instance for this.

## Development server for Front end

``cd ./Frontend/bolt

To start a local development server, run:

```bash
npm i
npm start
```
## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm run test
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



## Development server for Back end

``cd ./Backend

To start a local development server, run:

## Update env config with your enviroments -> Backend/src/shared/config/index.ts -> update envConfig

```bash
npm i
npm start
```
## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npm run test
```