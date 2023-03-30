import sqlite from 'better-sqlite3'

let db = sqlite('data.db')

// Potential performance buff, may apply if needed
// see https://github.com/WiseLibs/better-sqlite3/blob/master/docs/performance.md
// db.pragma('journal_mode = WAL');

// Enables enforcing foreign key constraints, such as cascade deleting
db.pragma('foreign_keys = ON')
export default db