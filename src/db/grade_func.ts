import db from './db_bridge'

function editGradePoints(student_id: number, assignment_id: number, earned_points: number): void {
    const sql = `
        UPDATE Grade
        SET earned_points = ?
        WHERE student_id = ?
        AND assignment_id = ?;
    `
    const stmt = db.prepare(sql)
    stmt.run(earned_points, student_id, assignment_id)
}

function editGradeExempt(student_id: number, assignment_id: number, is_exempt: boolean): void {
    const sql = `
        UPDATE Grade
        SET is_exempt = ${is_exempt ? 1 : 0}
        WHERE student_id = ${student_id}
        AND assignment_id = ${assignment_id};
    `
    const stmt = db.prepare(sql)
    stmt.run(
        is_exempt ? 1 : 0, 
        student_id, 
        assignment_id
    )
}

function applyBulkChanges(changes: PendingChange[]) {
    const sqlChangePoints = `
        UPDATE Grade SET earned_points = ?
            WHERE student_id = ?
            AND assignment_id = ?;
    `
    const sqlChangeExempt = `
        UPDATE Grade SET is_exempt = ? 
            WHERE student_id = ? 
            AND assignment_id = ?;
    `
    const stmtChangePoints = db.prepare(sqlChangePoints)
    const stmtChangeExempt = db.prepare(sqlChangeExempt)
    
    changes.forEach(change => {
        if (change.newEarnedPoints !== undefined) {
            stmtChangePoints.run(
                change.newEarnedPoints,
                change.student_id,
                change.assignment_id
            )
        }
        if (change.newIsExempt !== undefined) {
            stmtChangeExempt.run(
                change.newIsExempt ? 1 : 0,
                change.student_id,
                change.assignment_id
            )
        }
    })
}



declare global {
    interface PendingChange {
        student_id: number,
        assignment_id: number,
        newEarnedPoints?: number,
        newIsExempt?: boolean
    }

    interface grade_func_exports {
        /**
         * Change the points earned on an assignment for a student.
         * @param student_id The ID of the student.
         * @param assignment_id The ID of the assignment.
         * @param earned_points New value for earned_points.
         */
        editGradePoints: (student_id: number, assignment_id: number, earned_points: number) => void,
        /**
         * Edit the exempt status on an assignment for a student.
         * @param student_id The ID of the student.
         * @param assignment_id The ID of the assignment.
         * @param is_exempt Whether or not the grade is exempt.
         */
        editGradeExempt: (student_id: number, assignment_id: number, is_exempt: boolean) => void,
        /**
         * Applies a series of changes to the database (specifically grades)
         * @param changes An array of `pendingChange` objects describing the changes to make.
         */
        applyBulkChanges: (changes: PendingChange[]) => void
    }
}

export default {
    editGradePoints,
    editGradeExempt,
    applyBulkChanges
} as grade_func_exports