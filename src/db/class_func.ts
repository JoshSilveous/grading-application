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
    const retAssignments = stmtAssignments.all()

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
    console.log(retStudentNames)
    
    
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
            return {...grade, is_exempt: grade.is_exempt ? true : false}
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
        studentInfo: studentInfo
    } as ClassData

}


// Type declarations must be global for type-checking in other files
declare global {
    interface ClassData {
        id: Number,
        name: String,
        description: String,
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
}
 


export interface class_func_exports {
    /**
     * Returns an object containing the class id, name, description, and student info.
     * @param class_id the ID of the class requesting
     * @returns Object containing all data about the class, it's students, and their grades.
     */
    getClassData: (class_id: Number) => ClassData
}
module.exports = {
    getClassData
} as class_func_exports