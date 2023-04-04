import db from './db_bridge'

function editGradePoints(student_id: number, assignment_id: number, earned_points: number): void {
    const sql = `
        UPDATE Grade
        SET earned_points = ${earned_points}
        WHERE student_id = ${student_id}
        AND assignment_id = ${assignment_id};
    `
    db.exec(sql)
}
function editGradeExempt(student_id: number, assignment_id: number, is_exempt: boolean): void {
    const sql = `
        UPDATE Grade
        SET is_exempt = ${is_exempt ? 1 : 0}
        WHERE student_id = ${student_id}
        AND assignment_id = ${assignment_id};
    `
    db.exec(sql)
}

function applyBulkChanges(changes: PendingChange[]) {
    console.log('t')
    let sql = ``
    changes.forEach(change => {
        if (change.newEarnedPoints) {
            sql += `
                UPDATE Grade SET earned_points = ${change.newEarnedPoints} 
                WHERE student_id = ${change.student_id}
                AND assignment_id = ${change.assignment_id};
            `
        }
        if (change.newIsExempt) {
            sql += `
                UPDATE Grade SET is_exempt = ${change.newIsExempt} 
                WHERE student_id = ${change.student_id} 
                AND assignment_id = ${change.assignment_id};
            `
        }
    })
    console.log(sql)
    db.exec(sql)
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