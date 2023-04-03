import db from './db_bridge'

function addEnrollment(class_id: number, student_id: number): void {
    const sql = `
        INSERT INTO Enrollment 
        VALUES (${class_id}, ${student_id});
    `
    db.exec(sql)

    // Add a grade of '0' for each assignment in the class to the new user.
    const sqlGetAssignmentsInClass = `
        SELECT assignment_id FROM Assignment WHERE class_id = ${class_id};
    `
    const stmtGetAssignmentsInClass = db.prepare(sqlGetAssignmentsInClass)
    const assignmentsInClass = stmtGetAssignmentsInClass.all()

    let sqlInsertGrades = ''
    assignmentsInClass.forEach(assignment => {
        sqlInsertGrades += 
            `INSERT INTO Grade VALUES (${student_id}, ${assignment.assignment_id}, 0, 0);`
    })
    db.exec(sqlInsertGrades)

}

function deleteEnrollment(class_id: number, student_id: number): void {
    const sql = `
        DELETE FROM Enrollment
        WHERE class_id = ${class_id}
        AND student_id = ${student_id};
    `
    db.exec(sql)
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