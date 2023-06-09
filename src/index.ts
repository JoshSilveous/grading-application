import { app, BrowserWindow } from 'electron';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
	app.quit();
}

const createWindow = (): void => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 600,
		width: 800,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	// and load the index.html of the app.
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.removeMenu()

	// Open the DevTools.
	// mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

import { ipcMain } from 'electron'



import db from './db'

function dbtest() {
	db.setup.dropTables()
	db.setup.generateTables()
	db.test.insertTestData()

	return db.class.getClassData(1)
}

db.setup.generateTables()


app.on('ready', () => {
    ipcMain.handle('closeApp', () => app.quit())

	ipcMain.handle('dbtest', dbtest)

    ipcMain.handle('db-setup-generateTables', db.setup.generateTables)
    ipcMain.handle('db-setup-dropTables', db.setup.dropTables)

    ipcMain.handle('db-test-insertTestData', db.test.insertTestData)

    ipcMain.handle('db-class-getClassData', (e, class_id: number) => db.class.getClassData(class_id))
    ipcMain.handle('db-class-createClass', 
        (e, name: string, description: string) => db.class.createClass(name, description)
    )
    ipcMain.handle('db-class-deleteClass', (e, class_id: number) => db.class.deleteClass(class_id))
    ipcMain.handle('db-class-getClassInfo', (e, class_id: number) => db.class.getClassInfo(class_id))
    ipcMain.handle('db-class-getClassList', () => db.class.getClassList())
    ipcMain.handle('db-class-editClass', 
        (e, class_id: number, name: string, description: string) => db.class.editClass(class_id, name, description)
    )
    ipcMain.handle('db-class-getStudentsNotInClass', 
        (e, class_id: number) => db.class.getStudentsNotInClass(class_id)
    )

    ipcMain.handle('db-student-getStudentInfo', (e, student_id: number) => db.student.getStudentInfo(student_id))
    ipcMain.handle('db-student-deleteStudent', (e, student_id: number) => db.student.deleteStudent(student_id))
    ipcMain.handle('db-student-createStudent', 
        (e, first_name: string, last_name: string) => db.student.createStudent(first_name, last_name)
    )
    ipcMain.handle('db-student-editStudent', 
        (e, student_id: number, first_name: string, last_name: string) => 
            db.student.editStudent(student_id, first_name, last_name)
    )
    ipcMain.handle('db-student-getStudentEnrollments', 
        (e, student_id: number) => db.student.deleteStudent(student_id)
    )
    ipcMain.handle('db-student-getStudentList', 
        () => db.student.getStudentList()
    )

    ipcMain.handle('db-assignment-createAssignment', 
        (e, 
            class_id: number, 
            name: string, 
            description: string, 
            assignment_type: "HOMEWORK" | "TEST", 
            is_extra_credit: boolean, 
            max_points: number
        ) =>  db.assignment.createAssignment(
            class_id, name, description, assignment_type, is_extra_credit, max_points
        )
    )
    ipcMain.handle('db-assignment-editAssignment', 
    (e, 
        assignment_id: number, 
        name: string, 
        description: string, 
        assignment_type: "HOMEWORK" | "TEST", 
        is_extra_credit: boolean, 
        max_points: number
    ) =>  db.assignment.editAssignment(
        assignment_id, name, description, assignment_type, is_extra_credit, max_points
    ))
    ipcMain.handle('db-assignment-deleteAssignment', 
        (e, assignment_id: number) => db.assignment.deleteAssignment(assignment_id)
    )
    ipcMain.handle('db-assignment-getAssignment', 
        (e, assignment_id: number) => db.assignment.getAssignment(assignment_id)
    )
    ipcMain.handle('db-assignment-updateAssignmentOrder', 
        (e, assignment_id: number, order_position: number) => 
            db.assignment.updateAssignmentOrder(assignment_id, order_position)
    )
    
    ipcMain.handle('db-enrollment-addEnrollment', 
        (e, class_id: number, student_id: number) => 
            db.enrollment.addEnrollment(class_id, student_id)
    )
    ipcMain.handle('db-enrollment-deleteEnrollment', 
        (e, class_id: number, student_id: number) => 
            db.enrollment.deleteEnrollment(class_id, student_id)
    )

    ipcMain.handle('db-grade-editGradePoints', 
        (e, student_id: number, assignment_id: number, earned_points: number) => 
            db.grade.editGradePoints(student_id, assignment_id, earned_points)
    )
    ipcMain.handle('db-grade-editGradeExempt', 
        (e, student_id: number, assignment_id: number, is_exempt: boolean) => 
            db.grade.editGradeExempt(student_id, assignment_id, is_exempt)
    )
    ipcMain.handle('db-grade-applyBulkChanges', 
        (e, changes: PendingChange[]) => 
            db.grade.applyBulkChanges(changes)
    )

})