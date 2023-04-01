const db_setup_func = require('./setup_func') as setup_func_exports
const db_testdata = require('./testdata') as testdata_exports
const db_class_func = require('./class_func') as class_func_exports
const db_student_func = require('./student_func') as student_func_exports
const db_assignment_func = require('./assignment_func') as assignment_func_exports
const db_enrollment_func = require('./enrollment_func') as enrollment_func_exports

export default {
    /**
     * Contains functions relating to setting up the database tables.
     */
    setup: {
        generateTables: db_setup_func.generateTables,
        dropTables: db_setup_func.dropTables
    } as setup_func_exports,
    /**
     * Contains functions for testing purposes, not used in production.
     */
    test: {
        insertTestData: db_testdata.insertTestData
    } as testdata_exports,
    /**
     * Contains functions for interacting with classes in the database.
     */
    class: {
        getClassData: db_class_func.getClassData,
        createClass: db_class_func.createClass,
        deleteClass: db_class_func.deleteClass,
        getClassInfo: db_class_func.getClassInfo,
        getClassList: db_class_func.getClassList,
        editClass: db_class_func.editClass,
        getStudentsNotInClass: db_class_func.getStudentsNotInClass
    } as class_func_exports,
    /**
     * Contains functions for interacting with students in the database.
     */
    student: {
        deleteStudent: db_student_func.deleteStudent,
        createStudent: db_student_func.createStudent,
        editStudent: db_student_func.editStudent,
        getStudentEnrollments: db_student_func.getStudentEnrollments,
        getStudentList: db_student_func.getStudentList
    } as student_func_exports,
    /**
     * Contains functions for interacting with assignments in the database.
     */
    assignment: {
        createAssignment: db_assignment_func.createAssignment,
        editAssignment: db_assignment_func.editAssignment,
        deleteAssignment: db_assignment_func.deleteAssignment,
        getAssignment: db_assignment_func.getAssignment,
        updateAssignmentOrder: db_assignment_func.updateAssignmentOrder
    } as assignment_func_exports,
    /**
     * Contains functions for interacting with enrollments in the database.
     */
    enrollment: {
        addEnrollment: db_enrollment_func.addEnrollment,
        deleteEnrollment: db_enrollment_func.deleteEnrollment
    } as enrollment_func_exports
}