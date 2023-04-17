import sqlite from 'better-sqlite3'
import fs from 'fs'
import path from 'path'

const DBFileDir = path.join(process.env.USERPROFILE, 'Documents', 'josh_grading_application_data')
const DBFilePath = path.join(DBFileDir, 'data.db')

// check if directory exists, create if not
if (!fs.existsSync(DBFileDir)) {
    fs.mkdirSync(DBFileDir, { recursive: true })
}

let db = sqlite(DBFilePath)

// Potential performance buff, may apply if needed
// see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
// db.pragma('journal_mode = WAL');

// Enables enforcing foreign key constraints, such as cascade deleting
db.pragma('foreign_keys = ON')
export default db