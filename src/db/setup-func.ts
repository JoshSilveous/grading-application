import db from './db-bridge'

interface test {
    /**
     * Creates 'Class' table in `data.db`, if it doesn't exist already.
     */
    createClassTable: () => void
}

const createClassTable: test["createClassTable"] = () => {
    const sql = `CREATE TABLE IF NOT EXIST Class (
                    class_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT(50),
                    description TEXT(200)
                );`
    db.exec(sql)
}
export default {
    createClassTable,
} as test
