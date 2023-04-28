import db from './db_bridge'

function getStudentInfo(student_id: number): StudentInfo {
    const sql = `
        SELECT * FROM Student WHERE student_id = ?;
    `
    const stmt = db.prepare(sql)
    const res: StudentInfo = stmt.get(student_id)

    return res
}

function deleteStudent(student_id: number): void {
    const sql = `
        DELETE FROM Student
        WHERE student_id = ?;
    `
    const stmt = db.prepare(sql)
    stmt.run(student_id)
}

function createStudent(first_name: string, last_name: string): number {
    const sql = `
        INSERT INTO Student (first_name, last_name)
        VALUES (?, ?);
    `
    const stmt = db.prepare(sql)
    const res = stmt.run(first_name, last_name)
    
    return res.lastInsertRowid as number
}

function editStudent(student_id: number, first_name: string, last_name: string): void {
    const sql = `
        UPDATE Student
        SET first_name = ?,
            last_name = ?
        WHERE student_id = ?;
    `
    const stmt = db.prepare(sql)
    stmt.run(first_name, last_name, student_id)
}

function getStudentEnrollments(student_id: number): ClassInfo[] {
    const sql = `
        SELECT Class.class_id, name, description
            FROM Class INNER JOIN Enrollment
                ON Class.class_id = Enrollment.class_id
            WHERE student_id = ?;
    `
    const stmt = db.prepare(sql)
    const res: ClassInfo[] = stmt.all(student_id)

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
