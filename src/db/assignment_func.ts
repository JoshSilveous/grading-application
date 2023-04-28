import db from './db_bridge'

function createAssignment(
    class_id: number,
    name: string, 
    description: string, 
    assignment_type: AssignmentInfo['assignment_type'], 
    is_extra_credit: boolean, 
    max_points: number
): number {

    /*  
        order_position determines the order in which assignments will be layed out in 
        the table for the user. This is stored in the database so it can persist among 
        re-loads of the database. This chunk of code gets the number of current 
        assignments in the class, to define the new assignment's position.

        I didn't end up implementing this feature in the design, so it doesn't actually do anything currently.
    */
    const sqlGetAssignmentNum = `
        SELECT * FROM Assignment WHERE class_id = ?;
    `
    const stmtGetAssignmentNum = db.prepare(sqlGetAssignmentNum)
    const order_position = stmtGetAssignmentNum.all(class_id).length


    const sqlInsert = `
        INSERT INTO Assignment VALUES 
        (NULL, ?, ?, ?, ?, ?, ?, ?);
    `
    const stmtInsert = db.prepare(sqlInsert)
    const resInsertNewID = stmtInsert.run(
        name, description, assignment_type,
        is_extra_credit ? 1 : 0,
        max_points, order_position, class_id
    ).lastInsertRowid


    // Create entries in the `Grade` table for each assignment, with a default value of 0
    const sqlGetStudentsInClass = `
        SELECT student_id FROM Enrollment WHERE class_id = ?;
    `
    const stmtGetStudentsInClass = db.prepare(sqlGetStudentsInClass)
    const studentsInClass = stmtGetStudentsInClass.all(class_id)

    const sqlInsertGrade = `
        INSERT INTO Grade VALUES (?, ?, 0, 0);
    `
    const stmtInsertGrade = db.prepare(sqlInsertGrade)
    studentsInClass.forEach(student => {
        stmtInsertGrade.run(student.student_id, resInsertNewID)
    })


    return resInsertNewID as number
}

function editAssignment(
    assignment_id: number,
    name: string, 
    description: string, 
    assignment_type: AssignmentInfo['assignment_type'], 
    is_extra_credit: boolean, 
    max_points: number
): void {
    const sql = `
        UPDATE Assignment
        SET name = ?,
            description = ?,
            assignment_type = ?,
            is_extra_credit = ?,
            max_points = ?
        WHERE assignment_id = ?;
    `
    const stmt = db.prepare(sql)
    stmt.run(
        name, description, assignment_type,
        is_extra_credit ? 1 : 0,
        max_points, assignment_id
    )
}

function deleteAssignment(assignment_id: number): void {
    const sql = `
        DELETE FROM Assignment
        WHERE assignment_id = ?;
    `
    const stmt = db.prepare(sql)
    stmt.run(assignment_id)
}

function getAssignment(assignment_id: number): AssignmentInfo {
    const sql = `
        SELECT * FROM Assignment
        WHERE assignment_id = ?;
    `
    const stmt = db.prepare(sql)
    const res: AssignmentInfo = stmt.get(assignment_id)
    return res

}

function updateAssignmentOrder(assignment_id: number, order_position: number): void {
    const sql = `
        UPDATE Assignment
        SET order_position = ?
        WHERE assignment_id = ?;
    `
    const stmt = db.prepare(sql)
    stmt.run(order_position, assignment_id)
}



declare global {
    interface AssignmentInfo {
        assignment_id: number,
        class_id: number,
        name: string,
        description: string,
        assignment_type: "HOMEWORK" | "TEST",
        is_extra_credit: boolean,
        max_points: number
    }
    interface assignment_func_exports {
        /**
         * Creates an assignment in the database.
         * @param class_id The ID of the class associated.
         * @param name The name of the assignment.
         * @param description The description of the assignment (can be blank, must be provided).
         * @param assignment_type The type of assignment. "HOMEWORK" or "TEST".
         * @param is_extra_credit boolean, whether the assignment should impact grade negatively.
         * @param max_points Total points the assignment is worth.
         * @returns The ID of the newly-created class.
         */
        createAssignment: (
            class_id: number,
            name: string, 
            description: string, 
            assignment_type: AssignmentInfo['assignment_type'], 
            is_extra_credit: boolean, 
            max_points: number
        ) => number,
        /**
         * Edit an assignment in the database.
         * @param assignment_id The ID of the assignment.
         * @param name The name of the assignment.
         * @param description The description of the assignment (can be blank, must be provided).
         * @param assignment_type The type of assignment. "HOMEWORK" or "TEST".
         * @param is_extra_credit boolean, whether the assignment should impact grade negatively.
         * @param max_points Total points the assignment is worth.
         */
        editAssignment: (
            assignment_id: number,
            name: string, 
            description: string, 
            assignment_type: AssignmentInfo['assignment_type'], 
            is_extra_credit: boolean, 
            max_points: number
        ) => void,
        /**
         * Delete an assignment from the database.
         * @param assignment_id The ID of the assignment.
         */
        deleteAssignment: (assignment_id: number) => void,
        /**
         * Get an assignment's data from the database
         * @param assignment_id The ID of the assignment.
         * @returns An object containing all of the assignment's data.
         */
        getAssignment: (assignment_id: number) => AssignmentInfo,
        /**
         * Updates the display order for the assignment in the class.
         * @param assignment_id The ID of the assignment.
         * @param order_position The display order for the assignment.
         */
        updateAssignmentOrder: (assignment_id: number, order_position: number) => void
    }
}

export default {
    createAssignment,
    editAssignment,
    deleteAssignment,
    getAssignment,
    updateAssignmentOrder
} as assignment_func_exports