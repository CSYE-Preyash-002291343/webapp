# WebApp

## Overview

This is a webapp with a health-check API implemented to monitor the application status.

## Tech Stack:

**Backend**: Node.JS
**Backend ORM**: Sequeslize 
**Database**: Postgres


## To start the webapp you will need to follow the steps below:

1. You can use `git clone` via SSH or Download the code as Zip to your local.
2. Before starting the application, you will need to install the dependencies with `npm install`
3. Next, you will have to setup the env file with the necessary variables which will be required in the main app.
4. Once you are done with this setup, you can now run the application with `npm start`
5. As per the flow of the code, the server will be running on port->*5000*, you can visit http://localhost:5000/healthz.
6. You can now go ahead and test all the endpoint methods to verify the working for all as expected.

## Database connection Steps

To check whehther you are connected to the DB you can use :
    `psql -h localhost -p 5432 -U postgres -d <your-DB-name>`

To stop the DB server from running you can use the following command:
    `pg_ctl stop -D "C:\Program Files\PostgreSQL\16\data"`

To Start the DB server back up use the following command:
    `pg_ctl start -D "C:\Program Files\PostgreSQL\16\data"`

### Since I am version 16 for postgresql, I have that in the path, you can change the version number based on your version 


## Endpoints Testing :

1. GET method :
   1. Without payload/query - `200 OK`
   2. With payload - `400 Bad Request`
   3. With bad payload - `400 Bad Request`
   4. With Query - `400 Bad Request`
2. All other methods : `405 Method Not Allowed`   

## If you are still facing any issue, please reach out to mehta.prey@northeastern.edu