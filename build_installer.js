// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64", 
const APP_DIR = path.resolve(__dirname, './out/josh-silveous-grading-application-win32-x64');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(__dirname, './windows_installer');

// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
    appDirectory: APP_DIR,
    outputDirectory: OUT_DIR,

    // Configure metadata
    shortName:'josh-silveous-grade-app',
    description: `This is my final application for CSET4250.
    It can be used to track grades for students, for assignments, amongst many classes.`,
    exe: 'josh-silveous-grading-application.exe',
    icon: './icon.ico',
    name: `Josh's Grading Application`,
    manufacturer: 'Joshua W Silveous Inc.',
    version: '1.0.0',
    arch: 'x64',

    // Configure installer User Interface
    ui: {
        chooseDirectory: true
    },
});

// 4. Create a .wxs template file
msiCreator.create().then(function(){

    // Step 5: Compile the template to a .msi file
    msiCreator.compile();
});