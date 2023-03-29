import db from './db_bridge'

async function generateTables() {
    console.log('trying to generate tables')
    const sqlCreateTableClass = `
        CREATE TABLE IF NOT EXISTS Class (
            class_id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT(50) NOT NULL,
            description TEXT(200)
        );`

    const sqlCreateTableAssignment = `
        CREATE TABLE Assignment (
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
        );`

    const sqlCreateTableStudent = `
        CREATE TABLE Student (
            student_id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT(25) NOT NULL,
            last_name TEXT(25) NOT NULL
        );`
    const sqlCreateTableGrade = `
        CREATE TABLE Grade (
            student_id INTEGER,
            assignment_id INTEGER,
            PRIMARY KEY (student_id, assignment_id),
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
        );`

    const sqlCreateTableEnrollment = `
        CREATE TABLE Enrollment (
            class_id INTEGER,
            student_id INTEGER,
            PRIMARY KEY (class_id, student_id),
            earned_points INTEGER NOT NULL,
            is_exempt INTEGER NOT NULL,
            CONSTRAINT fk_class_id
                FOREIGN KEY (class_id)
                REFERENCES Class(class_id)
                ON DELETE CASCADE,
            CONSTRAINT fk_student_id
                FOREIGN KEY (student_id)
                REFERENCES Student(student_id)
                ON DELETE CASCADE
        );`

    const sqlCreateAll = sqlCreateTableClass + sqlCreateTableAssignment +
        sqlCreateTableStudent + sqlCreateTableGrade + sqlCreateTableEnrollment
    try {
        db.exec(sqlCreateAll)
    }
    catch (error) {
        console.log(error)
    }
}

async function dropTables() {
    console.log('trying to drop tables')
    await db.exec("DROP TABLE IF EXISTS Enrollment;")
    await db.exec("DROP TABLE IF EXISTS Grade;")
    await db.exec("DROP TABLE IF EXISTS Student;")
    await db.exec("DROP TABLE IF EXISTS Class;")
    await db.exec("DROP TABLE IF EXISTS Assignment");
    console.log('tables dropped')
}

export interface setup_func_exports {
    /**
     * Creates the base tables in the DB.
     */
    generateTables: () => void,
    dropTables: () => void
}
module.exports = {
    generateTables,
    dropTables
} as setup_func_exports
