# Jenga Project Management Application
A Nodejs application leveraging the Backend capabilities of Firebase

By Vivvianne Kimani.

## Description
A web based system for students and supervisors. It allows students to view projects and enroll to them as desired
It also allows admin user to add, delete and assign projects to both students and team leaders. The admin can also add tasks and comment on tasks.
I have leveraged the diverse capabilities of Firebase Technology to add authentication and also used the firestore
to store user data


on your console run
```
npm i
```
to have all your packages installed

## What to do once you clone the repository
### Create a .env file in the root of your project directory
the file should have all te express server configurations e.g. port number
also it has all the firebase firestore config parameters
the file contains all configurations for the social media logins, port number,
secret codes for authorization as well as firebase connection configurations

### Developer Accounts
In each of the social media logins used, you are required to sign up for a developer account where you get all the client id's and 
the secret keys in order to authorize your app to access the functions

### Create a firebase application
Go to the firebase console and create a new project for this web application. After that you should get all the firebase config files you need to start this project

### create a "serviceAccountKey.json" file 
contains the private key to my firebase application

## Passport JS for OAuth 
I have used the passport library to add social login to my application.
