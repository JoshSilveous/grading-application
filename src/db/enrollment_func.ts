import db from './db_bridge'

function addEnrollment(class_id: number, student_id: number): void {
    const sqlInsert = `
        INSERT INTO Enrollment 
            VALUES (?, ?);
    `
    const stmtInsert = db.prepare(sqlInsert)
    stmtInsert.run(class_id, student_id)

    // Add a grade of '0' for each assignment in the class to the new user.
    const sqlGetAssignmentsInClass = `
        SELECT assignment_id FROM Assignment WHERE class_id = ?;
    `
    const stmtGetAssignmentsInClass = db.prepare(sqlGetAssignmentsInClass)
    const assignmentsInClass = stmtGetAssignmentsInClass.all(class_id)

    const sqlInsertGrade = `INSERT INTO Grade VALUES (?, ?, 0, 0);`
    const stmtInsertGrades = db.prepare(sqlInsertGrade)

    assignmentsInClass.forEach(assignment => {
        stmtInsertGrades.run(student_id, assignment.assignment_id)
    })

}

function deleteEnrollment(class_id: number, student_id: number): void {
    const sql = `
        DELETE FROM Enrollment
            WHERE class_id = ?
            AND student_id = ?;
    `
    const stmt = db.prepare(sql)
    stmt.run(class_id, student_id)
}



declare global {
    interface enrollment_func_exports {
        /**
         * Adds an enrollment to the database.
         * @param class_id The ID of the class.
         * @param student_id The ID of the student.
         */
        addEnrollment: (class_id: number, student_id: number) => void,
        /**
         * Deletes an enrollment from the database.
         * @param class_id The ID of the class.
         * @param student_id The ID of the student.
         */
        deleteEnrollment: (class_id: number, student_id: number) => void
    }
}

export default {
    addEnrollment,
    deleteEnrollment
} as enrollment_func_exports