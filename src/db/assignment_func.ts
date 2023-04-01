import db from './db_bridge'

function createAssignment(
    class_id: Number,
    name: String, 
    description: String, 
    assignment_type: AssignmentInfo['assignment_type'], 
    is_extra_credit: Boolean, 
    max_points: Number
): Number {

    /*  order_position determines the order in which assignments will be layed out in 
        the table for the user. This is stored in the database so it can persist among 
        re-loads of the database. This chunk of code gets the number of current 
        assignments in the class, to define the new assignment's position.
    */
    const sqlGetAssignmentNum = `
        SELECT * FROM Assignment WHERE class_id = ${class_id};
    `
    const stmtGetAssignmentNum = db.prepare(sqlGetAssignmentNum)
    const order_position = stmtGetAssignmentNum.all().length



    const sqlInsert = `
        INSERT INTO Assignment VALUES 
        (NULL,  '${name}', '${description}', '${assignment_type}', ${is_extra_credit ? 1 : 0}, ${max_points}, ${order_position}, ${class_id});
    `
    db.exec(sqlInsert)

    
    
    const sqlGetID = `
        SELECT assignment_id FROM Assignment
        WHERE class_id = ${class_id}
        AND name = '${name}'
        AND description = '${description}'
        AND assignment_type = '${assignment_type}'
        AND is_extra_credit = ${is_extra_credit ? 1 : 0}
        AND max_points = ${max_points};
        `
        
    const stmtGetID = db.prepare(sqlGetID)
    const resGetID = stmtGetID.all().pop().assignment_id


    // Create entries in the `Grade` table for each assignment, with a default value of 0
    const sqlGetStudentsInClass = `
        SELECT student_id FROM Enrollment WHERE class_id = ${class_id}
    `
    const stmtGetStudentsInClass = db.prepare(sqlGetStudentsInClass)
    const studentsInClass = stmtGetStudentsInClass.all()

    let sqlInsertGrades = ''
    studentsInClass.forEach(student => {
        sqlInsertGrades += 
            `INSERT INTO Grade VALUES (${student.student_id}, ${resGetID}, 0, 0);`
    })
    db.exec(sqlInsertGrades)

    return resGetID
}
function editAssignment(
    assignment_id: Number,
    name: String, 
    description: String, 
    assignment_type: AssignmentInfo['assignment_type'], 
    is_extra_credit: Boolean, 
    max_points: Number
): void {
    const sql = `
        UPDATE Assignment
        SET name = '${name}',
            description = '${description}',
            assignment_type = '${assignment_type}',
            is_extra_credit = ${is_extra_credit ? 1 : 0},
            max_points = ${max_points}
        WHERE assignment_id = ${assignment_id};
    `
    db.exec(sql)
}
function deleteAssignment(assignment_id: Number): void {
    const sql = `
        DELETE FROM Assignment
        WHERE assignment_id = ${assignment_id};
    `
    db.exec(sql)
}
function getAssignment(assignment_id: Number): AssignmentInfo {
    const sql = `
        SELECT * FROM Assignment
        WHERE assignment_id = ${assignment_id};
    `
    const stmt = db.prepare(sql)
    const res: AssignmentInfo[] = stmt.all()
    return res[0]

}
function updateAssignmentOrder(assignment_id: Number, order_position: Number): void {
    const sql = `
        UPDATE Assignment
        SET order_position = ${order_position}
        WHERE assignment_id = ${assignment_id};
    `
    db.exec(sql)
}

declare global {
    interface AssignmentInfo {
        assignment_id: Number,
        class_id: Number,
        name: String,
        description: String,
        assignment_type: "HOMEWORK" | "TEST",
        is_extra_credit: Boolean,
        max_points: Number
    }
    interface assignment_func_exports {
        /**
         * Creates an assignment in the database.
         * @param class_id The ID of the class associated.
         * @param name The name of the assignment.
         * @param description The description of the assignment (can be blank, must be provided).
         * @param assignment_type The type of assignment. "HOMEWORK" or "TEST".
         * @param is_extra_credit Boolean, whether the assignment should impact grade negatively.
         * @param max_points Total points the assignment is worth.
         * @returns The ID of the newly-created class.
         */
        createAssignment: (
            class_id: Number,
            name: String, 
            description: String, 
            assignment_type: AssignmentInfo['assignment_type'], 
            is_extra_credit: Boolean, 
            max_points: Number
        ) => Number,
        /**
         * Edit an assignment in the database.
         * @param assignment_id The ID of the assignment.
         * @param name The name of the assignment.
         * @param description The description of the assignment (can be blank, must be provided).
         * @param assignment_type The type of assignment. "HOMEWORK" or "TEST".
         * @param is_extra_credit Boolean, whether the assignment should impact grade negatively.
         * @param max_points Total points the assignment is worth.
         */
        editAssignment: (
            assignment_id: Number,
            name: String, 
            description: String, 
            assignment_type: AssignmentInfo['assignment_type'], 
            is_extra_credit: Boolean, 
            max_points: Number
        ) => void,
        /**
         * Delete an assignment from the database.
         * @param assignment_id The ID of the assignment.
         */
        deleteAssignment: (assignment_id: Number) => void,
        /**
         * Get an assignment's data from the database
         * @param assignment_id The ID of the assignment.
         * @returns An object containing all of the assignment's data.
         */
        getAssignment: (assignment_id: Number) => AssignmentInfo,
        /**
         * Updates the display order for the assignment in the class.
         * @param assignment_id The ID of the assignment.
         * @param order_position The display order for the assignment.
         */
        updateAssignmentOrder: (assignment_id: Number, order_position: Number) => void
    }
}

export default {
    createAssignment,
    editAssignment,
    deleteAssignment,
    getAssignment,
    updateAssignmentOrder
} as assignment_func_exports