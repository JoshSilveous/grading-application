// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('app', {
    closeApp: () => ipcRenderer.invoke('closeApp')
} as Window['app'])

contextBridge.exposeInMainWorld('api', {
    // An example of a function that uses the ipc context bridge.
    // The contextBridge.exposeInMainWorld will make these functions accessible to the renderer.
    // The ipcRenderer.invoke grabs the function from the main file (index.ts).
    dbtest: () => ipcRenderer.invoke('dbtest')
} as Window['api'])

contextBridge.exposeInMainWorld('setup', {
    generateTables: () => ipcRenderer.invoke('db-setup-generateTables'),
    dropTables: () => ipcRenderer.invoke('db-setup-dropTables')
} as Window['setup'])

contextBridge.exposeInMainWorld('test', {
    insertTestData: () => ipcRenderer.invoke('db-test-insertTestData')
} as Window['test'])

contextBridge.exposeInMainWorld('class', {
    getClassData: (class_id) => ipcRenderer.invoke('db-class-getClassData', class_id),
    createClass: (name, description) => ipcRenderer.invoke('db-class-createClass', name, description),
    deleteClass: (class_id) => ipcRenderer.invoke('db-class-deleteClass', class_id),
    getClassInfo: (class_id) => ipcRenderer.invoke('db-class-getClassInfo', class_id),
    getClassList: () => ipcRenderer.invoke('db-class-getClassList'),
    editClass: (class_id, name, description) => ipcRenderer.invoke('db-class-editClass', class_id, name, description),
    getStudentsNotInClass: (class_id) => ipcRenderer.invoke('db-class-getStudentsNotInClass', class_id)
} as Window['class'])

contextBridge.exposeInMainWorld('student', {
    getStudentInfo: (student_id) => ipcRenderer.invoke('db-student-getStudentInfo', student_id),
    deleteStudent: (student_id) => ipcRenderer.invoke('db-student-deleteStudent', student_id),
    createStudent: (first_name, last_name) => ipcRenderer.invoke('db-student-createStudent', first_name, last_name),
    editStudent: (student_id, first_name, last_name) => 
        ipcRenderer.invoke('db-student-editStudent', student_id, first_name, last_name),
    getStudentEnrollments: (student_id) => ipcRenderer.invoke('db-student-getStudentEnrollments', student_id),
    getStudentList: () => ipcRenderer.invoke('db-student-getStudentList'),
} as Window['student'])

contextBridge.exposeInMainWorld('assignment', {
    createAssignment: (class_id, name, description, assignment_type, is_extra_credit, max_points) => 
        ipcRenderer.invoke('db-assignment-createAssignment', 
            class_id, name, description, assignment_type, is_extra_credit, max_points
        ),
    editAssignment: (assignment_id, name, description, assignment_type, is_extra_credit, max_points) => 
        ipcRenderer.invoke('db-assignment-editAssignment', 
            assignment_id, name, description, assignment_type, is_extra_credit, max_points
        ),
    deleteAssignment: (assignment_id) => ipcRenderer.invoke('db-assignment-deleteAssignment', assignment_id),
    getAssignment: (assignment_id) => ipcRenderer.invoke('db-assignment-getAssignment', assignment_id),
    updateAssignmentOrder: (assignment_id, order_position) => 
        ipcRenderer.invoke('db-assignment-updateAssignmentOrder', assignment_id, order_position),
} as Window['assignment'])

contextBridge.exposeInMainWorld('enrollment', {
    addEnrollment: (class_id, student_id) => ipcRenderer.invoke('db-enrollment-addEnrollment', class_id, student_id),
    deleteEnrollment: (class_id, student_id) => ipcRenderer.invoke('db-enrollment-deleteEnrollment', class_id, student_id)
} as Window['enrollment'])

contextBridge.exposeInMainWorld('grade', {
    editGradePoints: (student_id, assignment_id, earned_points) => 
        ipcRenderer.invoke('db-grade-editGradePoints', student_id, assignment_id, earned_points),
    editGradeExempt: (student_id, assignment_id, is_exempt) => 
        ipcRenderer.invoke('db-grade-editGradeExempt', student_id, assignment_id, is_exempt),
    applyBulkChanges: (changes) => 
        ipcRenderer.invoke('db-grade-applyBulkChanges', changes),
} as Window['grade'])

