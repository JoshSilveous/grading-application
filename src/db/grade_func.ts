import db from './db_bridge'

function editGradePoints(student_id: Number, assignment_id: Number, earned_points: Number): void {
    const sql = `
        UPDATE Grade
        SET earned_points = ${earned_points}
        WHERE student_id = ${student_id}
        AND assignment_id = ${assignment_id};
    `
    db.exec(sql)
}
function editGradeExempt(student_id: Number, assignment_id: Number, is_exempt: Boolean): void {
    const sql = `
        UPDATE Grade
        SET is_exempt = ${is_exempt ? 1 : 0}
        WHERE student_id = ${student_id}
        AND assignment_id = ${assignment_id};
    `
    db.exec(sql)
}

declare global {
    interface grade_func_exports {
        /**
         * Change the points earned on an assignment for a student.
         * @param student_id The ID of the student.
         * @param assignment_id The ID of the assignment.
         * @param earned_points New value for earned_points.
         */
        editGradePoints: (student_id: Number, assignment_id: Number, earned_points: Number) => void,
        /**
         * Edit the exempt status on an assignment for a student.
         * @param student_id The ID of the student.
         * @param assignment_id The ID of the assignment.
         * @param is_exempt Whether or not the grade is exempt.
         */
        editGradeExempt: (student_id: Number, assignment_id: Number, is_exempt: Boolean) => void
    }
}
export default {
    editGradePoints,
    editGradeExempt
} as grade_func_exports