import db from './db_bridge'

function generateTables() {

    const sql = `
        CREATE TABLE IF NOT EXISTS Class (
            class_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT(50) NOT NULL,
            description TEXT(200)
        );

        CREATE TABLE IF NOT EXISTS Assignment (
            assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT(50) NOT NULL,
            description INTEGER,
            assignment_type TEXT(8) NOT NULL,
            is_extra_credit INTEGER NOT NULL,
            max_points INTEGER NOT NULL,
            order_position INTEGER,
            class_id INTEGER NOT NULL,
            CONSTRAINT fk_class_id
                FOREIGN KEY (class_id)
                REFERENCES Class(class_id)
                ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS Student (
            student_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT(25) NOT NULL,
            last_name TEXT(25) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS Grade (
            student_id INTEGER,
            assignment_id INTEGER,
            earned_points INTEGER NOT NULL,
            is_exempt INTEGER NOT NULL,
            CONSTRAINT fk_student_id
                FOREIGN KEY (student_id)
                REFERENCES Student(student_id)
                ON DELETE CASCADE,
            CONSTRAINT fk_assignment_id
                FOREIGN KEY (assignment_id)
                REFERENCES Assignment(assignment_id)
                ON DELETE CASCADE,
            PRIMARY KEY (student_id, assignment_id)
        );

        CREATE TABLE IF NOT EXISTS Enrollment (
            class_id INTEGER,
            student_id INTEGER,
            CONSTRAINT fk_class_id
                FOREIGN KEY (class_id)
                REFERENCES Class(class_id)
                ON DELETE CASCADE,
            CONSTRAINT fk_student_id
                FOREIGN KEY (student_id)
                REFERENCES Student(student_id)
                ON DELETE CASCADE,
            PRIMARY KEY (class_id, student_id)
        );`

    db.exec(sql)
}

// for debug purposes
function dropTables() {
    const sql = `
        DROP TABLE IF EXISTS Enrollment;
        DROP TABLE IF EXISTS Grade;
        DROP TABLE IF EXISTS Student;
        DROP TABLE IF EXISTS Class;
        DROP TABLE IF EXISTS Assignment
    `

    db.exec(sql)
}

export interface setup_func_exports {
    /**
     * Creates all tables in the database.
     */
    generateTables: () => void,
    /**
     * Drops all tables in the database.
     * Intended for debug purposes
     */
    dropTables: () => void
}
module.exports = {
    generateTables,
    dropTables
} as setup_func_exports
