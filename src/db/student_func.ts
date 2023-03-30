import db from './db_bridge'

function deleteStudent(student_id: Number): void {
    const sql = `
        DELETE FROM Student
        WHERE student_id = ${student_id};
    `
    db.exec(sql)
}

function createStudent(first_name: String, last_name: String): Number {
    const sqlInsert = `
        INSERT INTO Student (first_name, last_name)
        VALUES ('${first_name}', '${last_name}');
    `
    console.log(sqlInsert)
    db.exec(sqlInsert)

    const sqlGetID = `
        SELECT student_id FROM Student
        WHERE first_name = '${first_name}' AND last_name = '${last_name}';
    `
    const stmt = db.prepare(sqlGetID)
    const res = stmt.all()

    /* .pop() to get the latest item in the array, just in
        case there is multiple students with the same name
        (which is allowed) */
    return res.pop().student_id
}

function getStudentEnrollments(student_id: Number): ClassInfo[] {
    const sql = `
        SELECT Class.class_id, name, description
            FROM Class INNER JOIN Enrollment
                ON Class.class_id = Enrollment.class_id
            WHERE student_id = ${student_id};
    `
    const stmt = db.prepare(sql)
    const res: ClassInfo[] = stmt.all()

    return res
}

function getStudentList(): StudentInfo[] {
    const sql = `
        SELECT * FROM Student;
    `
    const stmt = db.prepare(sql)
    const res: StudentInfo[] = stmt.all()

    return res
}

declare global {
    interface StudentInfo {
        student_id: Number,
        first_name: String,
        last_name: String
    }
    interface student_func_exports {
        /**
         * Removes a student from the database, including enrollments and grades.
         * @param student_id The ID of the student.
         */
        deleteStudent: (student_id: Number) => void,
        /**
         * Creates a new student in the database.
         * @param first_name First name of the student.
         * @param last_name Last name of the student.
         * @returns The newly-created student's ID.
         */
        createStudent: (first_name: String, last_name: String) => Number,
        /**
         * Gets an array of classes the student is in.
         * @param student_id The ID of the student.
         * @returns An array of objects containing the class's IDs, names, and descriptions.
         */
        getStudentEnrollments: (student_id: Number) => ClassInfo[],
        /**
         * Gets an array of all students in the database.
         * @returns An array of objects containing the students's IDs and names.
         */
        getStudentList: () => StudentInfo[]
    }
}

module.exports = {
    deleteStudent,
    createStudent,
    getStudentEnrollments,
    getStudentList
} as student_func_exports
