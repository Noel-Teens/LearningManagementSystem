const mongoose = require("mongoose");
const Article = require("../models/Article");

mongoose.connect("mongodb://127.0.0.1:27017/lms")
  .then(async () => {
    console.log("MongoDB connected for seeding");

    await Article.deleteMany(); // optional: clears old data

    await Article.insertMany([
      {
        title: "Introduction to React",
        content: `React is a popular JavaScript library for building modern user interfaces, especially single-page applications. It follows a component-based approach, where you build small reusable UI parts and combine them to create complex screens.

React uses JSX, which lets you write HTML-like syntax inside JavaScript. With features like props, state, and hooks such as useState and useEffect, React makes it easier to manage data changes and create interactive experiences.

Because React updates the UI efficiently using a virtual DOM, it provides better performance and a smooth user experience for dynamic applications.`,
        category: "Frontend",
        tags: ["react", "javascript", "ui"],
        createdBy: "admin"
      },
      {
        title: "Node.js Basics",
        content: `Node.js is a runtime environment that allows JavaScript to run outside the browser, mainly on the server side. It is built on Google’s V8 engine and is widely used for creating fast and scalable backend applications.

Node.js uses an event-driven, non-blocking I/O model, which makes it efficient for handling multiple requests at the same time. This is especially useful for APIs, real-time applications, and services like chat systems.

With Node.js, developers can use JavaScript for both frontend and backend, making full-stack development smoother and more consistent.`,
        category: "Backend",
        category: "Backend",
        tags: ["node", "backend"],
        createdBy: "admin"
      },
      {
        title: "MongoDB Overview",
        content: `MongoDB is a NoSQL, document-based database that stores data in flexible JSON-like documents called BSON. Unlike traditional relational databases, MongoDB does not require fixed table schemas, which makes it easier to store and update evolving data.

MongoDB is designed for scalability and performance. It supports indexing, aggregation, and replication, and it can handle large amounts of data across distributed systems using sharding.

In many MERN stack applications (MongoDB, Express, React, Node.js), MongoDB is used to store user details, articles, and application data in a fast and flexible way.`,
        category: "Database",
        tags: ["mongodb", "database"],
        createdBy: "admin"
      }
    ]);

    console.log("Articles seeded successfully");
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
