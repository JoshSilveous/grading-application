import db from './db_bridge'

function addEnrollment(class_id: Number, student_id: Number): void {
    const sql = `
        INSERT INTO Enrollment 
        VALUES (${class_id}, ${student_id});
    `
    db.exec(sql)
}

function deleteEnrollment(class_id: Number, student_id: Number): void {
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
        addEnrollment: (class_id: Number, student_id: Number) => void,
        /**
         * Deletes an enrollment from the database.
         * @param class_id The ID of the class.
         * @param student_id The ID of the student.
         */
        deleteEnrollment: (class_id: Number, student_id: Number) => void
    }
}

export default {
    addEnrollment,
    deleteEnrollment
} as enrollment_func_exports