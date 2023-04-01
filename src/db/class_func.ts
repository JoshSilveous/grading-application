import db from './db_bridge'

function getClassData(class_id: Number): ClassData {

    const sqlClassInfo = `
        SELECT * FROM Class WHERE class_id = ${class_id}
    `
    let stmtClassInfo = db.prepare(sqlClassInfo)
    let retClassInfo = stmtClassInfo.all()[0]


    const sqlAssignments = `
        SELECT * FROM Assignment WHERE class_id = ${class_id};
    `
    const stmtAssignments = db.prepare(sqlAssignments)
    const retAssignments: AssignmentInfo[] = stmtAssignments.all()

    // Create a list of assignment_id IN Class
    let listAssignments = ""
    retAssignments.forEach((assignment, index) => {
        listAssignments += index ? ',' + assignment.assignment_id : assignment.assignment_id
    })

    const sqlStudentNames = `
        SELECT Student.student_id, first_name, last_name
            FROM Enrollment INNER JOIN Student
                ON Enrollment.student_id = Student.student_id
            WHERE class_id = ${class_id};    
    `
    let stmtStudentNames = db.prepare(sqlStudentNames)
    let retStudentNames = stmtStudentNames.all()


    const studentInfo = retStudentNames.map(student => {
        const sqlGrades = `
            SELECT assignment_id, earned_points, is_exempt
                FROM Grade 
                WHERE student_id = ${student.student_id}
                AND assignment_id IN (${listAssignments})
                ;
        `
        const stmtGrades = db.prepare(sqlGrades)
        const resGrades = stmtGrades.all().map(grade => {
            // convert is_exempt from Number (1 or 0) to Boolean (true or false)
            return { ...grade, is_exempt: grade.is_exempt ? true : false }
        })

        return {
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            grades: resGrades
        } as StudentGrades
    })


    return {
        id: class_id,
        name: retClassInfo.name,
        description: retClassInfo.description,
        assignments: retAssignments,
        studentInfo: studentInfo
    } as ClassData

}

function createClass(name: String, description: String): Number {
    const sqlInsert = `
        INSERT INTO Class (name, description)
        VALUES ('${name}', '${description}');
    `
    db.exec(sqlInsert)

    const sqlGetID = `
        SELECT class_id FROM Class
        WHERE name = '${name}' AND description = '${description}';
    `
    const stmt = db.prepare(sqlGetID)
    const res = stmt.all()

    /* .pop(), just in case there are multiple classes with the same 
        name & description, which is allowed. this will always return 
        the latest entry. */
    return res.pop().class_id
}

function deleteClass(class_id: Number): void {
    const sql = `
        DELETE FROM Class WHERE class_id = ${class_id}
    `
    db.exec(sql)
}

function getClassInfo(class_id: Number): ClassInfo {
    const sql = `
        SELECT * FROM Class WHERE class_id = ${class_id}
    `
    const stmt = db.prepare(sql)
    const res: ClassInfo = stmt.all()[0]

    return res
}

function getClassList(): ClassInfo[] {
    const sql = `
        SELECT * FROM Class;
    `
    const stmt = db.prepare(sql)
    const res: ClassInfo[] = stmt.all()

    return res
}

function editClass(class_id: Number, name: String, description: String): void {
    const sql = `
        UPDATE Class
        SET name = '${name}',
            description = '${description}'
        WHERE class_id = ${class_id};
    `
    db.exec(sql)
}

function getStudentsNotInClass(class_id: Number): StudentInfo[] {
    const sql = `
        SELECT student_id, first_name, last_name FROM Student
            INNER JOIN Enrollment
                ON Student.student_id = Enrollment.student_id
            WHERE class_id NOT ${class_id};
    `
    const stmt = db.prepare(sql)
    const res = stmt.all()
    return res
}


declare global {
    // Type declarations must be global for type-checking in other files

    interface ClassData {
        id: Number,
        name: String,
        description: String,
        assignments: AssignmentInfo[],
        studentInfo: StudentGrades[]
    }
    interface StudentGrades {
        student_id: Number,
        class_id: Number,
        first_name: String,
        last_name: String,
        grades: GradeObject[]
    }
    interface GradeObject {
        student_id: Number,
        assignment_id: Number,
        earned_points: Number,
        is_exempt: Boolean
    }
    interface ClassInfo {
        class_id: Number,
        name: String,
        description: String
    }

    interface class_func_exports {
        /**
         * Gets verbose information about a class.
         * @param class_id the ID of the class being requested.
         * @returns Object containing all data about the class, it's assignments, it's students, and their grades.
         */
        getClassData: (class_id: Number) => ClassData,
        /**
         * Creates a class in the database.
         * @param name The name of the class. Max 50 chars.
         * @param description A brief description of the class. Max 200 chars.
         * @returns The newly-created `class_id`.
         */
        createClass: (name: String, description: String) => Number,
        /**
         * Deletes a class from the database.
         * @param class_id The ID of the class.
         */
        deleteClass: (class_id: Number) => void,
        /**
         * Gets surface-level information about the class.
         * @param class_id The ID of the class.
         * @returns Object containing `class_id`, `name`, and `description`.
         */
        getClassInfo: (class_id: Number) => ClassInfo,
        /**
         * Gets surface-level information about all classes
         * @returns Array of objects containing `class_id`, `name`, and `description`.
         */
        getClassList: () => ClassInfo[],
        /**
         * Edit a class's name & description. You must provide both parameters, so if
         * you only want to change the name, provide back the original description
         * (and vice versa).
         * @param class_id The ID of the class.
         * @param name The new name for the class. Max 50 chars.
         * @param description The new description for the class. Max 200 chars.
         */
        editClass: (class_id: Number, name?: String, description?: String) => void,
        /**
         * Gets students that are not in a class (for list)
         * @param class_id The ID of the class.
         * @returns An array of objects containing the id and names of students.
         */
        getStudentsNotInClass: (class_id: Number) => StudentInfo[]
    }
}


export default {
    getClassData,
    createClass,
    deleteClass,
    getClassInfo,
    getClassList,
    editClass,
    getStudentsNotInClass
} as class_func_exports