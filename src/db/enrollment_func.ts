import db from './db_bridge'

function addEnrollment(class_id: Number, student_id: Number): void {
    const sql = `
        INSERT INTO Enrollment 
        VALUES (${class_id}, ${student_id});
    `
    db.exec(sql)
}

function deleteEnrollment(class_id: Number, student_id: Number): void {
    const sql = `
        DELETE FROM Enrollment
        WHERE class_id = ${class_id}
        AND student_id = ${student_id};
    `
    db.exec(sql)
}