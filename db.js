// db.js
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

const runAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                console.error('SQL Error:', err);
                return reject(err);
            }
            resolve({ changes: this.changes, lastID: this.lastID });
        });
    });
};

const getAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                console.error('SQL Error:', err);
                return reject(err);
            }
            resolve(row);
        });
    });
};

const allAsync = (sql, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('SQL Error:', err);
                return reject(err);
            }
            resolve(rows);
        });
    });
};

const createTables = async () => {
    try {
        await runAsync(`
            CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                reset_token TEXT,
                reset_token_expiry TEXT
            )
        `);

        await runAsync(`
            CREATE TABLE IF NOT EXISTS blog_posts (
                post_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                date_posted DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        `);

        await runAsync(`
            CREATE TABLE IF NOT EXISTS contact_submissions (
                submission_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                goal TEXT,
                message TEXT,
                submission_date DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await runAsync(`CREATE TABLE IF NOT EXISTS user_goals (
            user_id INTEGER,
            workout_time REAL,
            water_intake REAL,
            calorie_intake INTEGER,
            PRIMARY KEY (user_id),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`);

        await runAsync(`CREATE TABLE IF NOT EXISTS user_progress (
            user_id INTEGER,
            date DATETIME,
            workout_progress REAL,
            water_progress REAL,
            diet_progress REAL,
            PRIMARY KEY (user_id, date),
            FOREIGN KEY (user_id) REFERENCES users(user_id)
        )`);

        await runAsync(`CREATE TABLE IF NOT EXISTS workout_plans (
            plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
            goal TEXT,
            diet_type TEXT,
            day TEXT,
            exercise TEXT
        )`);

        await runAsync(`CREATE TABLE IF NOT EXISTS diet_plans (
            plan_id INTEGER PRIMARY KEY AUTOINCREMENT,
            goal TEXT,
            diet_type TEXT,
            meal TEXT,
            food TEXT
        )`);

        console.log('Tables created/checked successfully.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

createTables();

module.exports = {
    db,
    runAsync,
    getAsync,
    allAsync,
};