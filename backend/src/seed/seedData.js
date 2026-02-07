const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../modules/auth/user.model');
const Course = require('../modules/courses/course.model');

// Load env vars
dotenv.config();

const users = [
    {
        name: 'Super Admin',
        email: 'superadmin@example.com',
        password: 'password123',
        role: 'SuperAdmin'
    },
    {
        name: 'John Trainer',
        email: 'trainer@example.com',
        password: 'password123',
        role: 'Trainer'
    },
    {
        name: 'Jane Learner',
        email: 'learner1@example.com',
        password: 'password123',
        role: 'Learner'
    },
    {
        name: 'Bob Learner',
        email: 'learner2@example.com',
        password: 'password123',
        role: 'Learner'
    },
    {
        name: 'Alice Learner',
        email: 'learner3@example.com',
        password: 'password123',
        role: 'Learner'
    }
];

const courses = [
    {
        title: 'Introduction to React Native',
        description: 'Learn the basics of React Native development.',
        status: 'Published',
        modules: [
            {
                title: 'Getting Started',
                lessons: [
                    {
                        title: 'Setup Environment',
                        contentType: 'Video',
                        contentUrl: 'http://example.com/video1.mp4'
                    }
                ]
            }
        ]
    },
    {
        title: 'Advanced Node.js Patterns',
        description: 'Deep dive into Node.js architecture.',
        status: 'Published',
        modules: []
    },
    {
        title: 'Draft Course - MongoDB',
        description: 'Work in progress.',
        status: 'Draft',
        modules: []
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // 1. Seed Users
        console.log('--- Seeding Users ---');
        let trainerId = null;

        for (const user of users) {
            let existingUser = await User.findOne({ email: user.email });
            if (!existingUser) {
                existingUser = await User.create(user);
                console.log(`Created user: ${user.name}`);
            } else {
                console.log(`User exists: ${user.name}`);
            }

            if (user.role === 'Trainer') {
                trainerId = existingUser._id;
            }
        }

        // 2. Seed Courses
        if (!trainerId) {
            console.error('No Trainer found to assign courses to!');
            process.exit(1);
        }

        console.log('--- Seeding Courses ---');
        for (const course of courses) {
            const existingCourse = await Course.findOne({ title: course.title });
            if (!existingCourse) {
                await Course.create({
                    ...course,
                    trainerId: trainerId
                });
                console.log(`Created course: ${course.title}`);
            } else {
                console.log(`Course exists: ${course.title}`);
            }
        }

        console.log('Data Seeding Completed Successfully!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
