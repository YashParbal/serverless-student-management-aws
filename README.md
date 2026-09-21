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

🥀 
.
## DynamoDB Configuration

The serverless application's database layer was created using **Amazon DynamoDB**, a fully managed NoSQL database service. A table named `studentData` was created in the `ap-south-1` region. The table uses `studentid` as its partition key with the data type set to String. No sort key was required because each student record can be uniquely identified using the student ID. DynamoDB was selected for this application because it allows the serverless backend to store and retrieve student records without requiring a traditional relational database server.

![DynamoDB Table Configuration](<img width="1441" height="711" alt="Screenshot 2026-09-21 143916" src="https://github.com/user-attachments/assets/f6bfcf88-15c9-4637-b014-33925d4a96b6" />
)

## IAM Role and Permissions

An IAM execution role was created for the Lambda functions so that they could securely communicate with the DynamoDB table. An inline policy was attached to the role that allows the required DynamoDB operations. The `dynamodb:Scan` permission allows the READ-DB Lambda function to retrieve student records, while `dynamodb:PutItem` allows the WRITE-DB Lambda function to insert new student records into the `studentData` table. CloudWatch Logs permissions were also included so that Lambda execution logs can be created and written for monitoring and troubleshooting.

![Lambda IAM Policy](<img width="1534" height="664" alt="Screenshot 2026-09-21 144602" src="https://github.com/user-attachments/assets/b8f6990c-e227-4704-b617-8bb66492dfe2" />
)

## READ-DB Lambda Function

The first Lambda function, named **READ-DB**, was created using Python and is responsible for retrieving student records from DynamoDB. The function initializes the DynamoDB resource in the `ap-south-1` region, selects the `studentData` table, and uses the `Scan` operation to retrieve the stored student records. The function also handles DynamoDB pagination using `LastEvaluatedKey`, allowing additional records to be retrieved when the table contains more items than can be returned in a single scan operation.

![READ-DB Lambda Function](<img width="821" height="532" alt="Screenshot 2026-09-21 145026" src="https://github.com/user-attachments/assets/8330ef88-e6c1-48e5-813d-d1925a789388" />
)

The READ-DB Lambda function was configured with the IAM execution role created for the serverless application. The Lambda configuration was kept lightweight, using 128 MB of memory, 512 MB of ephemeral storage, and a 3-second timeout. The execution role was selected under the Lambda function's basic settings so that the function could access DynamoDB and write execution logs to CloudWatch. Also do same for WRITE-DB.

![READ-DB Lambda Configuration](<img width="1417" height="626" alt="Screenshot 2026-09-21 145105" src="https://github.com/user-attachments/assets/8b7e4b79-4cf6-41d3-b511-26a58846f43f" />
)
## WRITE-DB Lambda Function

A second Lambda function named **WRITE-DB** was created to insert new student records into DynamoDB. The function receives student information from the API request, extracts the `studentid`, `name`, `class`, and `age` values, and writes the information into the `studentData` DynamoDB table using the `PutItem` operation. This function provides the write operation required by the student management application.

![WRITE-DB Lambda Function](<img width="824" height="507" alt="Screenshot 2026-09-21 145251" src="https://github.com/user-attachments/assets/33f6cd09-cc43-47ff-a660-afcf5bbf86e1" />
)

## API Gateway Configuration

After creating the Lambda functions, **Amazon API Gateway** was configured to provide HTTP access to the serverless backend. A Regional REST API named `students` was created. API Gateway acts as the communication layer between the static frontend hosted on Amazon S3 and the Lambda functions, allowing the frontend to send HTTP requests without directly accessing the Lambda functions.

![API Gateway Creation](<img width="1395" height="665" alt="Screenshot 2026-09-21 145418" src="https://github.com/user-attachments/assets/710343a9-a44f-4397-88f5-7c115dee02d7" />
)

A **GET** method was created and integrated with the `READ-DB` Lambda function. When a client sends a GET request to the API, API Gateway invokes the READ-DB Lambda function, which retrieves the student records from DynamoDB and returns them to the frontend.

![API Gateway GET Method](<img width="1457" height="621" alt="Screenshot 2026-09-21 145509" src="https://github.com/user-attachments/assets/10153c77-89cf-4af5-86d1-956fbe30d794" />
)

A **POST** method was also created and integrated with the `WRITE-DB` Lambda function. When a student record is submitted through the frontend, the information is sent to API Gateway using a POST request. API Gateway then invokes the WRITE-DB Lambda function, which stores the student information in DynamoDB.

![API Gateway POST Method](<img width="1290" height="557" alt="Screenshot 2026-09-21 145549" src="https://github.com/user-attachments/assets/996496a1-2227-42a3-93ee-d980574a398f" />
)

After configuring the GET and POST methods, the API was deployed using an API Gateway stage. The deployment makes the configured API resources and Lambda integrations available through the deployed API endpoint so that the frontend can communicate with the serverless backend.

![API Gateway Deployment](<img width="1264" height="476" alt="Screenshot 2026-09-21 145639" src="https://github.com/user-attachments/assets/08a04c5d-cdfc-42a3-ab08-8b71213fa6ff" />
)

## Amazon S3 Frontend Deployment

The frontend of the application was hosted using **Amazon S3**. The S3 bucket was configured to contain the static website files required by the application. The frontend files, including `add_student.html`, `fetch_all_students.html`, `index.html`, and the supporting JavaScript file, were uploaded to the S3 bucket.

![S3 Frontend Upload](<img width="1489" height="460" alt="Screenshot 2026-09-21 145935" src="https://github.com/user-attachments/assets/0afb648b-6433-4d36-9665-d6a7c33acec7" />
)

After the upload was completed, the S3 bucket contained the frontend application files. These files provide the user interface for adding students and viewing the student records retrieved from the serverless backend.

![S3 Bucket Objects](<img width="1531" height="546" alt="Screenshot 2026-09-21 150342" src="https://github.com/user-attachments/assets/a93b2842-dce3-4b32-98b9-8f2cd9915674" />
)

A bucket policy was configured to allow the required access to the S3 objects. The policy grants `s3:GetObject` permission for objects within the application bucket, allowing the static website files to be accessed through the S3 website endpoint.

![S3 Bucket Policy](<img width="1126" height="553" alt="Screenshot 2026-09-21 150945" src="https://github.com/user-attachments/assets/c6d061c5-aca9-4443-8269-e8e539847b66" />
)

## Serverless Application Testing

After configuring S3, API Gateway, Lambda, and DynamoDB, the deployed application was tested through the S3 website endpoint. The **Add Student** page allows a user to enter the student's ID, name, class, and age. The information is submitted through the frontend and sent to the API Gateway POST endpoint, which invokes the WRITE-DB Lambda function and stores the record in DynamoDB.

![Add Student Application](<img width="1499" height="750" alt="Screenshot 2026-09-21 151239" src="https://github.com/user-attachments/assets/fb26009b-09e9-402a-a419-a4a0ac656880" />
)

The student records can then be retrieved through the **All Students** page. When the user selects **Load Students**, the frontend sends a GET request to API Gateway. API Gateway invokes the READ-DB Lambda function, which retrieves the records from DynamoDB and returns them to the frontend. The application successfully displayed the stored student records, demonstrating communication between the frontend, API Gateway, Lambda, and DynamoDB services.

![All Students Application](<img width="1535" height="864" alt="Screenshot 2026-09-21 151333" src="https://github.com/user-attachments/assets/85837a6d-8338-40c6-9bc8-840325e8fb79" />
)

## Complete Serverless Request Flow

The completed application uses a fully serverless architecture in which Amazon S3 hosts the frontend, API Gateway provides the HTTP API, AWS Lambda performs the backend processing, and Amazon DynamoDB stores the student information.

```text
User
 |
 v
Amazon S3
Static Website
 |
 | GET / POST
 v
Amazon API Gateway
 |
 +----------------------+
 |                      |
 | GET                  | POST
 v                      v
READ-DB Lambda       WRITE-DB Lambda
 |                      |
 | Scan                 | PutItem
 |                      |
 +----------+-----------+
            |
            v
       DynamoDB
       studentData
```

The final application successfully demonstrates the complete serverless workflow. Student information submitted through the frontend is sent through API Gateway to the WRITE-DB Lambda function and stored in DynamoDB. Student records requested from the frontend are retrieved through API Gateway by the READ-DB Lambda function and displayed on the website. This demonstrates the complete communication flow between **Amazon S3 → API Gateway → AWS Lambda → Amazon DynamoDB** without requiring an EC2-based backend server.
