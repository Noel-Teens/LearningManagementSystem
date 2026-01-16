Learning Management System (LMS)

Backend Architecture & Database Schema Documentation

Project: Learning Management System Backend Stack: Node.js, Express.js,
MongoDB, Mongoose, JWT Team: 20

1.  Backend Folder & File Structure

The backend follows a modular, scalable, and maintainable structure,
where each module owns its routes, controllers, and models.

backend/

│

├── src/

│ ├── config/

│ │ ├── db.js \# MongoDB connection

│ │ ├── env.js \# Environment variables

│ │ └── jwt.js \# JWT configuration

│ │

│ ├── modules/

│ │ ├── auth/

│ │ │ ├── auth.controller.js

│ │ │ ├── auth.routes.js

│ │ │ └── user.model.js

│ │ │

│ │ ├── organization/

│ │ │ ├── organization.controller.js

│ │ │ ├── organization.routes.js

│ │ │ └── organization.model.js

│ │ │

│ │ ├── courses/

│ │ │ ├── course.controller.js

│ │ │ ├── course.routes.js

│ │ │ └── course.model.js

│ │ │

│ │ ├── knowledgeBase/

│ │ │ ├── article.controller.js

│ │ │ ├── article.routes.js

│ │ │ └── article.model.js

│ │ │

│ │ ├── enrollment/

│ │ │ ├── enrollment.controller.js

│ │ │ ├── enrollment.routes.js

│ │ │ └── enrollment.model.js

│ │ │

│ │ ├── assessment/

│ │ │ ├── quiz.controller.js

│ │ │ ├── quiz.routes.js

│ │ │ └── quiz.model.js

│ │ │

│ │ ├── certification/

│ │ │ ├── certificate.controller.js

│ │ │ ├── certificate.routes.js

│ │ │ └── certificate.model.js

│ │ │

│ │ ├── notifications/

│ │ │ ├── notification.controller.js

│ │ │ ├── notification.routes.js

│ │ │ └── notification.model.js

│ │ │

│ │ ├── reports/

│ │ │ ├── report.controller.js

│ │ │ └── report.routes.js

│ │ │

│ │ └── dashboard/

│ │ ├── dashboard.controller.js

│ │ └── dashboard.routes.js

│ │

│ ├── middlewares/

│ │ ├── auth.middleware.js

│ │ └── role.middleware.js

│ │

│ ├── utils/

│ │ ├── errorHandler.js

│ │ └── responseHandler.js

│ │

│ ├── app.js

│ └── server.js

│

├── .env

├── package.json

└── README.md

2.  Database Schemas (Module-wise)

All schemas are defined using Mongoose and stored inside their
respective modules.

MODULE 1: Authentication & User Management

User Schema

User {

name: String

email: String (unique)

password: String

role: enum \[SuperAdmin, Admin, Trainer, Learner\]

isActive: Boolean

createdAt: Date

}

MODULE 2: Organization & Settings Management

Organization Schema

Organization {

name: String

logoUrl: String

theme: String

learningPolicies: String

createdAt: Date

}

MODULE 3: Course Management

Course Schema

Course {

title: String

description: String

trainerId: ObjectId (User)

status: enum \[Draft, Published\]

modules: \[\]

createdAt: Date

}

MODULE 4: Knowledge Base

Article Schema

Article {

title: String

content: String

category: String

tags: \[String\]

version: Number

createdBy: ObjectId (User)

createdAt: Date

}

MODULE 5: Enrollment & Learning Flow

Enrollment Schema

Enrollment {

userId: ObjectId (User)

courseId: ObjectId (Course)

progress: Number

completedLessons: \[String\]

enrolledAt: Date

}

MODULE 6: Assessment & Quiz Management

Quiz Schema

Quiz {

courseId: ObjectId (Course)

questions: \[\]

passingScore: Number

}

MODULE 7: Certification Management

Certificate Schema

Certificate {

userId: ObjectId (User)

courseId: ObjectId (Course)

certificateUrl: String

issuedAt: Date

}

MODULE 8: Notifications & Communication

Notification Schema

Notification {

userId: ObjectId (User)

type: enum \[Email, InApp\]

message: String

isRead: Boolean

createdAt: Date

}

MODULE 9: Reports & Analytics

Report Data (Derived)

No separate collection required Data is aggregated from:

Users

Courses

Enrollments

Quizzes

MODULE 10: Dashboard

Dashboard Data (Derived)

No separate schema Data is fetched dynamically based on:

User role

Enrollment progress

Course completion

Assessments
