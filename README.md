# Serverless Student Management System

A serverless student management application built using AWS services. The application allows users to add student information and view all stored student records through a web-based frontend. Instead of using EC2 servers and a traditional relational database, the application uses Amazon S3 for static website hosting, Amazon API Gateway for API communication, AWS Lambda for backend processing, and Amazon DynamoDB as the NoSQL database.

## Architecture

```text
Internet
   |
   v
Amazon S3
Static Website
   |
   | HTTP GET / POST
   v
Amazon API Gateway
   |
   +-------------------------+
   |                         |
   | GET                     | POST
   v                         v
AWS Lambda               AWS Lambda
getStudentData          insertStudentData
   |                         |
   +------------+------------+
                |
                v
        Amazon DynamoDB
          studentData
```

## AWS Services Used

- **Amazon S3** - Hosts the static frontend of the application.
- **Amazon API Gateway** - Provides the API endpoint and handles GET and POST requests.
- **AWS Lambda** - Runs the backend logic without requiring an EC2 server.
- **Amazon DynamoDB** - Stores student information using a NoSQL data model.
- **AWS IAM** - Provides the Lambda function with permission to access DynamoDB.

## Application Workflow

The application uses a serverless request flow where the frontend is hosted directly from an Amazon S3 bucket. When a user adds a student, the frontend sends a POST request to the API Gateway endpoint. API Gateway invokes the `insertStudentData` Lambda function, which writes the student information into the `studentData` DynamoDB table.

When the user selects the option to view all students, the frontend sends a GET request to API Gateway. API Gateway invokes the `getStudentData` Lambda function, which scans the DynamoDB table and returns the stored student records to the frontend.

This creates the following complete flow:

```text
Student
   |
   v
S3 Static Website
   |
   v
API Gateway
   |
   +----------------------+
   |                      |
   v                      v
POST                   GET
   |                      |
   v                      v
insertStudentData     getStudentData
   |                      |
   +----------+-----------+
              |
              v
       DynamoDB
       studentData
```

## DynamoDB Configuration

A DynamoDB table named `studentData` was created to store the student information. The table uses `studentid` as its partition key. DynamoDB is a NoSQL database, so the application stores student records as items rather than using relational tables and SQL queries.

```text
Table Name: studentData
Partition Key: studentid
```

## IAM Configuration

An IAM role was created for the Lambda functions with permission to access DynamoDB. This allows the Lambda functions to read from and write to the `studentData` table.

## Lambda Functions

Two Python 3 Lambda functions were created for the application.

### getStudentData

The `getStudentData` function retrieves student records from the `studentData` DynamoDB table. It scans the table and returns the stored items.

### insertStudentData

The `insertStudentData` function receives student information from API Gateway and stores the data as an item in the `studentData` DynamoDB table.

The student information includes:

```text
Student ID
Name
Class
Age
```

## API Gateway Configuration

An API Gateway API named `student` was created to connect the frontend with the Lambda functions. GET and POST methods were configured and connected to the Lambda functions.

The API was deployed using a `prod` stage, and CORS was configured to allow GET and POST requests from the frontend.

The deployed API endpoint was then configured in the frontend `scripts.js` file so that the application could communicate with the backend services.

## Amazon S3 Frontend

An Amazon S3 bucket was created to host the static website. The frontend consists of four files:

```text
index.html
add_student.html
fetch_all_students.html
scripts.js
```

The S3 bucket was configured for static website hosting. A bucket policy was also configured to allow the website objects to be accessed, and CORS configuration was added for communication with the API Gateway endpoint.

## Serverless Architecture

Unlike a traditional three-tier application, this project does not require an EC2 instance for the frontend or backend. The frontend is served from Amazon S3, API requests are handled by API Gateway, backend processing is performed by Lambda, and persistent student data is stored in DynamoDB.

The complete serverless architecture is therefore:

```text
S3
 |
 v
API Gateway
 |
 v
Lambda
 |
 v
DynamoDB
```

This architecture removes the need to manage operating systems, EC2 instances, web servers, or backend application servers for the application.
