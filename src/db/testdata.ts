import db from './db_bridge'

function insertTestData() {
    const sql = `
        INSERT INTO Class VALUES
            (1, 'Biology', 'A study of biological proportions');
        INSERT INTO Class VALUES
            (2, 'Mathematics', 'Mathmatical!');
        INSERT INTO Class VALUES
            (3, 'Astrology', 'A class about, like, constellations and spirit animals soooo');
        INSERT INTO Class VALUES
            (4, 'Science', 'Bill! Bill! Bill! Bill! Bill!');
            
        INSERT INTO Student VALUES
            (1, 'Seth', 'Rains');
        INSERT INTO Student VALUES
            (2, 'Matt', 'Lorenzen');
        INSERT INTO Student VALUES
            (3, 'Noah', 'Waszak');
        INSERT INTO Student VALUES
            (4, 'Donovan', 'Avalos');
        INSERT INTO Student VALUES
            (5, 'Joshua', 'Silveous');
        INSERT INTO Student VALUES
            (6, 'Derek', 'Floyd');
        INSERT INTO Student VALUES
            (7, 'Shrimp', 'Fella');
        INSERT INTO Student VALUES
            (8, 'Jon', 'Gallagher');
            
        INSERT INTO Enrollment VALUES
            (1,1);
        INSERT INTO Enrollment VALUES
            (1,2);
        INSERT INTO Enrollment VALUES
            (1,3);
        INSERT INTO Enrollment VALUES
            (1,4);
        INSERT INTO Enrollment VALUES
            (1,5);
        INSERT INTO Enrollment VALUES
            (1,6);
        INSERT INTO Enrollment VALUES
            (1,7);
        INSERT INTO Enrollment VALUES
            (1,8);
        INSERT INTO Enrollment VALUES
            (2,1);
        INSERT INTO Enrollment VALUES
            (2,3);
        INSERT INTO Enrollment VALUES
            (2,6);
        INSERT INTO Enrollment VALUES
            (2,7);
        INSERT INTO Enrollment VALUES
            (2,8);
        INSERT INTO Enrollment VALUES
            (3,1);
        INSERT INTO Enrollment VALUES
            (3,2);
        INSERT INTO Enrollment VALUES
            (3,3);
        INSERT INTO Enrollment VALUES
            (3,7);
        INSERT INTO Enrollment VALUES
            (3,8);
        INSERT INTO Enrollment VALUES
            (4,3);
        INSERT INTO Enrollment VALUES
            (4,4);
        INSERT INTO Enrollment VALUES
            (4,6);
        INSERT INTO Enrollment VALUES
            (4,7);

        INSERT INTO Assignment VALUES
            (1,'Biological Exam','The final exam', 'TEST', 0,50,1,1);
        INSERT INTO Assignment VALUES
            (2,'Biological Exam 2','The final exam 2', 'TEST', 0,50,1,1);
        INSERT INTO Assignment VALUES
            (3,'Biological Homework','Lab assignment', 'HOMEWORK', 0,20,1,1);
        INSERT INTO Assignment VALUES
            (4,'Math Quiz','Trigger-nometrie', 'TEST', 0,40,1,2);
        INSERT INTO Assignment VALUES
            (5,'Math Quiz 2','Algebra', 'TEST', 0,40,1,2);
        INSERT INTO Assignment VALUES
            (6,'Math Lab','A math lab', 'HOMEWORK', 0,20,1,2);
        INSERT INTO Assignment VALUES
            (7,'Spring Break Packet','Good luck enjoying your break', 'HOMEWORK', 0,120,1,2);
        INSERT INTO Assignment VALUES
            (8,'Spirit Test', NULL, 'TEST', 0,120,1,3);
        INSERT INTO Assignment VALUES
            (9,'Meditation Credit', NULL, 'HOMEWORK', 0,20,1,3);
        INSERT INTO Assignment VALUES
            (10,'Science Test', NULL, 'TEST', 0,120,1,4);
        INSERT INTO Assignment VALUES
            (11,'Science Test 2', NULL, 'TEST', 0,120,1,4);
        INSERT INTO Assignment VALUES
            (12,'Science Test 3', NULL, 'TEST', 0,120,1,4);
        INSERT INTO Assignment VALUES
            (13,'Science Test 4', NULL, 'TEST', 0,120,1,4);
        INSERT INTO Assignment VALUES
            (14,'Lab', NULL, 'HOMEWORK', 0,20,1,4);
        INSERT INTO Assignment VALUES
            (15,'Lab 2', NULL, 'HOMEWORK', 0,20,1,4);
        INSERT INTO Assignment VALUES
            (16,'Lab 3', NULL, 'HOMEWORK', 0,20,1,4);
            
        INSERT INTO Grade VALUES
            (1,1,50,0);
        INSERT INTO Grade VALUES
            (2,1,40,0);
        INSERT INTO Grade VALUES
            (3,1,0,1);
        INSERT INTO Grade VALUES
            (4,1,20,0);
        INSERT INTO Grade VALUES
            (5,1,50,0);
        INSERT INTO Grade VALUES
            (6,1,25,0);
        INSERT INTO Grade VALUES
            (7,1,27,0);
        INSERT INTO Grade VALUES
            (8,1,13,1);

        INSERT INTO Grade VALUES
            (1,2,50,0);
        INSERT INTO Grade VALUES
            (2,2,40,0);
        INSERT INTO Grade VALUES
            (3,2,0,1);
        INSERT INTO Grade VALUES
            (4,2,20,0);
        INSERT INTO Grade VALUES
            (5,2,50,0);
        INSERT INTO Grade VALUES
            (6,2,25,0);
        INSERT INTO Grade VALUES
            (7,2,27,0);
        INSERT INTO Grade VALUES
            (8,2,13,1);

        INSERT INTO Grade VALUES
            (1,3,20,0);
        INSERT INTO Grade VALUES
            (2,3,16,0);
        INSERT INTO Grade VALUES
            (3,3,14,0);
        INSERT INTO Grade VALUES
            (4,3,11,0);
        INSERT INTO Grade VALUES
            (5,3,0,0);
        INSERT INTO Grade VALUES
            (6,3,15,0);
        INSERT INTO Grade VALUES
            (7,3,18,0);
        INSERT INTO Grade VALUES
            (8,3,11,0);

        INSERT INTO Grade VALUES
            (1,4,40,0);
        INSERT INTO Grade VALUES
            (3,4,15,0);
        INSERT INTO Grade VALUES
            (6,4,0,1);
        INSERT INTO Grade VALUES
            (7,4,0,1);
        INSERT INTO Grade VALUES
            (8,4,0,1);

        INSERT INTO Grade VALUES
            (1,5,40,0);
        INSERT INTO Grade VALUES
            (3,5,15,0);
        INSERT INTO Grade VALUES
            (6,5,11,0);
        INSERT INTO Grade VALUES
            (7,5,15,0);
        INSERT INTO Grade VALUES
            (8,5,14,0);

        INSERT INTO Grade VALUES
            (1,6,20,0);
        INSERT INTO Grade VALUES
            (3,6,20,0);
        INSERT INTO Grade VALUES
            (6,6,20,0);
        INSERT INTO Grade VALUES
            (7,6,17,0);
        INSERT INTO Grade VALUES
            (8,6,20,0);

        INSERT INTO Grade VALUES
            (1,7,120,0);
        INSERT INTO Grade VALUES
            (3,7,15,0);
        INSERT INTO Grade VALUES
            (6,7,115,0);
        INSERT INTO Grade VALUES
            (7,7,26,0);
        INSERT INTO Grade VALUES
            (8,7,20,0);

        INSERT INTO Grade VALUES
            (1,8,120,0);
        INSERT INTO Grade VALUES
            (2,8,15,0);
        INSERT INTO Grade VALUES
            (3,8,115,0);
        INSERT INTO Grade VALUES
            (7,8,26,0);
        INSERT INTO Grade VALUES
            (8,8,20,1);

        INSERT INTO Grade VALUES
            (1,9,13,0);
        INSERT INTO Grade VALUES
            (2,9,15,0);
        INSERT INTO Grade VALUES
            (3,9,13,0);
        INSERT INTO Grade VALUES
            (7,9,13,0);
        INSERT INTO Grade VALUES
            (8,9,13,1);

        INSERT INTO Grade VALUES
            (3,10,120,0);
        INSERT INTO Grade VALUES
            (4,10,0,0);
        INSERT INTO Grade VALUES
            (6,10,0,0);
        INSERT INTO Grade VALUES
            (7,10,0,0);

        INSERT INTO Grade VALUES
            (3,11,110,0);
        INSERT INTO Grade VALUES
            (4,11,120,0);
        INSERT INTO Grade VALUES
            (6,11,43,0);
        INSERT INTO Grade VALUES
            (7,11,15,0);

        INSERT INTO Grade VALUES
            (3,14,11,0);
        INSERT INTO Grade VALUES
            (4,14,12,0);
        INSERT INTO Grade VALUES
            (6,14,3,0);
        INSERT INTO Grade VALUES
            (7,14,15,0);

        INSERT INTO Grade VALUES
            (3,15,20,0);
        INSERT INTO Grade VALUES
            (4,15,19,0);
        INSERT INTO Grade VALUES
            (6,15,13,0);
        INSERT INTO Grade VALUES
            (7,15,13,0);

    `

    db.exec(sql)
}

declare global {
    interface testdata_exports {
        /**
         * Inserts some testing data into the database.
         * Debug purposes only.
         */
        insertTestData: () => void
    }
}

module.exports = {
    insertTestData
} as testdata_exports