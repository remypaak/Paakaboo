
# Paakaboo

Welcome to **Paakaboo**! This is a website designed for photo challenges with friends. Each week, participants submit a photo based on a specific theme. After the submission period, everyone gets to vote on the photos, and a weekly winner is determined. An overall ranking is maintained, culminating in an ultimate winner at the end of 8 weeks.

## Tech Stack

### Frontend
- **Framework**: Angular
- **Technologies**: HTML, CSS, TypeScript
- **Hosting**: AWS S3 (static files), AWS CloudFront (CDN and HTTPS)

### Backend
- **Framework**: .NET Core
- **Database**: MySQL (hosted on AWS RDS)
- **Authentication**: Identity with JWT Bearer tokens
- **ORM**: Entity Framework (code-first approach with migrations)

### Infrastructure
- **Cloud Provider**: AWS
- **Frontend Hosting**:
  - **Static Files**: S3
  - **CDN**: CloudFront
  - **DNS**: Route 53
- **Backend Hosting**:
  - **Container Orchestration**: ECS (Elastic Container Service)
  - **Serverless Compute**: Fargate
  - **Load Balancer**: ALB (Application Load Balancer)
  - **Database**: RDS (Relational Database Service)

### CICD
- **CI/CD Tool**: GitHub Actions
- **Deployment**:
  - Automatically deploys frontend and backend to AWS on code push to the main repository.

## Detailed Explanation

### Frontend
The frontend of the application is built with **Angular**, leveraging HTML, CSS, and TypeScript. By using Angular, I aimed to understand the framework better, particularly the Observables and Subjects used extensively in our codebase at work. The static files generated by the Angular build are hosted in an AWS S3 bucket, served via AWS CloudFront. This setup ensures global accessibility and secure HTTPS connections, even if the main users are from a small town.

### Backend
For the backend, I chose **.NET Core** due to its cross-platform capabilities. MySQL was selected as the database engine for its cost-effectiveness and SQL-based nature. The backend uses **ASP.NET Core Identity** for authentication, with JWT Bearer tokens for secure and scalable authentication and authorization. Passwords are salted and hashed 10k times, ensuring security. Authorization checks are performed based on the role information contained in the JWT token. **Entity Framework** is used with a code-first approach, and database changes are managed through EF migrations.

### Infrastructure
To delve deeper into AWS, I structured the infrastructure using several AWS services:
- **Frontend**: The Angular application is hosted as static files in an S3 bucket. CloudFront, a popular CDN, serves these files, providing HTTPS support and caching for improved performance. Route 53 manages DNS, routing traffic to the appropriate resources.
- **Backend**: The backend runs in Docker containers orchestrated by ECS. Using **Fargate**, a serverless compute engine, eliminates the need to manage EC2 instances. The **Application Load Balancer (ALB)** distributes incoming API requests to the ECS containers. The database is hosted on an **RDS instance** running MySQL.

### CICD
To ensure seamless and automated deployment, I used **GitHub Actions** as the CI/CD tool. Whenever code is pushed to the main repository, GitHub Actions automatically deploys the frontend and backend to AWS. This ensures that any new changes are promptly reflected in the live environment without manual intervention.

## Conclusion
**Paakaboo** combines various technologies and services to provide a robust, scalable, and secure platform for weekly photo challenges. This project has been a great learning experience, allowing me to explore Angular, .NET Core, AWS services, and container orchestration with ECS.

Feel free to contribute or suggest improvements. Happy photo challenges!
