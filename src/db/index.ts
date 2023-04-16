import setup_func from './setup_func'
import test_data from './testdata'
import class_func from './class_func'
import student_func from './student_func'
import enrollment_func from './enrollment_func'
import assignment_func from './assignment_func'
import grade_func from './grade_func'

export default {
    /**
     * Contains functions relating to setting up the database tables.
     */
    setup: {
        generateTables: setup_func.generateTables,
        dropTables: setup_func.dropTables
    } as setup_func_exports,
    /**
     * Contains functions for testing purposes, not used in production.
     */
    test: {
        insertTestData: test_data.insertTestData
    } as testdata_exports,
    /**
     * Contains functions for interacting with classes in the database.
     */
    class: {
        getClassData: class_func.getClassData,
        createClass: class_func.createClass,
        deleteClass: class_func.deleteClass,
        getClassInfo: class_func.getClassInfo,
        getClassList: class_func.getClassList,
        editClass: class_func.editClass,
        getStudentsNotInClass: class_func.getStudentsNotInClass
    } as class_func_exports,
    /**
     * Contains functions for interacting with students in the database.
     */
    student: {
        getStudentInfo: student_func.getStudentInfo,
        deleteStudent: student_func.deleteStudent,
        createStudent: student_func.createStudent,
        editStudent: student_func.editStudent,
        getStudentEnrollments: student_func.getStudentEnrollments,
        getStudentList: student_func.getStudentList
    } as student_func_exports,
    /**
     * Contains functions for interacting with assignments in the database.
     */
    assignment: {
        createAssignment: assignment_func.createAssignment,
        editAssignment: assignment_func.editAssignment,
        deleteAssignment: assignment_func.deleteAssignment,
        getAssignment: assignment_func.getAssignment,
        updateAssignmentOrder: assignment_func.updateAssignmentOrder
    } as assignment_func_exports,
    /**
     * Contains functions for interacting with enrollments in the database.
     */
    enrollment: {
        addEnrollment: enrollment_func.addEnrollment,
        deleteEnrollment: enrollment_func.deleteEnrollment
    } as enrollment_func_exports,
    /**
     * Contains functions for updating student grades in the database.
     */
    grade: {
        editGradePoints: grade_func.editGradePoints,
        editGradeExempt: grade_func.editGradeExempt,
        applyBulkChanges: grade_func.applyBulkChanges
    } as grade_func_exports
}