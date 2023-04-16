import db from './db_bridge'

function getStudentInfo(student_id: number): StudentInfo {
    const sql = `
        SELECT * FROM Student WHERE student_id = ${student_id};
    `

    const stmt = db.prepare(sql)
    const res: StudentInfo[] = stmt.all()

    return res[0]
}

function deleteStudent(student_id: number): void {
    const sql = `
        DELETE FROM Student
        WHERE student_id = ${student_id};
    `
    db.exec(sql)
}

function createStudent(first_name: string, last_name: string): number {
    const sqlInsert = `
        INSERT INTO Student (first_name, last_name)
        VALUES ('${first_name}', '${last_name}');
    `
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

function editStudent(student_id: number, first_name: string, last_name: string): void {
    const sql = `
        UPDATE Student
        SET first_name = '${first_name}',
            last_name = '${last_name}'
        WHERE student_id = ${student_id}
    `
    db.exec(sql)
}

function getStudentEnrollments(student_id: number): ClassInfo[] {
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
        student_id: number,
        first_name: string,
        last_name: string
    }
    interface student_func_exports {
        /**
         * Get's an object containing the student's information.
         * @param student_id The ID of the student.
         * @returns object containing `student_id`, `first_name`, and `last_name`.
         */
        getStudentInfo: (student_id: number) => StudentInfo,
        /**
         * Removes a student from the database, including enrollments and grades.
         * @param student_id The ID of the student.
         */
        deleteStudent: (student_id: number) => void,
        /**
         * Creates a new student in the database.
         * @param first_name First name of the student. Max 25 chars.
         * @param last_name Last name of the student. Max 25 chars.
         * @returns The newly-created student's ID.
         */
        createStudent: (first_name: string, last_name: string) => number,
        /**
         * Edit a student's name.
         * @param student_id The ID of the student.
         * @param first_name New irst name of the student. Max 25 chars.
         * @param last_name New last name of the student. Max 25 chars.
         */
        editStudent: (student_id: number, first_name: string, last_name: string) => void
        /**
         * Gets an array of classes the student is in.
         * @param student_id The ID of the student.
         * @returns An array of objects containing the class's IDs, names, and descriptions.
         */
        getStudentEnrollments: (student_id: number) => ClassInfo[],
        /**
         * Gets an array of all students in the database.
         * @returns An array of objects containing the students's IDs and names.
         */
        getStudentList: () => StudentInfo[]
    }
}

export default {
    getStudentInfo,
    deleteStudent,
    createStudent,
    editStudent,
    getStudentEnrollments,
    getStudentList
} as student_func_exports
