const fs = require('fs');
const glob = require("glob");
const dependencyTree = require('dependency-tree');

class OnlyChangedJestWatchPlugin {
    constructor({config}) {
        this.lastRun = new Date();
        this.watchPathIgnoreGlobs = config.watchPathIgnoreGlobs || [];
    }
    
    onFileChange(rootDir, dependencies, modifiedFiles) {
        const files =  glob.sync(rootDir + "/**/*.js", { ignore: this.watchPathIgnoreGlobs });
        files.forEach((file) => {
            // Store whether has been modified
            var stats = fs.statSync(file);
            if (stats.mtime > this.lastRun) {
                modifiedFiles.push(file);
            }
            
            // Get dependencies
            const list = dependencyTree.toList({
                filename: file,
                directory: rootDir
            });

            // Invert dependencies
            list.forEach((dependency) => {
                if (!(dependency in dependencies)) {
                    dependencies[dependency] = {};
                }

                if (!(file in dependencies[dependency])) {
                    dependencies[dependency][file] = {};
                }
            });
        });

        return { dependencies, modifiedFiles};
    }

    getModifiedDependencies(dependencies, modifiedFiles) {
        const modifiedDependencies = {};
        modifiedFiles.forEach((modifiedFile) => {
            modifiedDependencies[modifiedFile] = dependencies[modifiedFile];
        });
        return modifiedDependencies;
    }

    getTestPaths(modifiedDependencies) {
        const testPaths = [];
        Object.keys(modifiedDependencies).forEach(key => {
            // Loop over dependencies
            Object.keys(modifiedDependencies[key]).forEach(filePath => {
                // Remove file extension
                const testPath = filePath.replace(/\.[^/.]+$/, '');

                if (!testPaths.includes(testPath)) {
                    testPaths.push(testPath);
                }
            });            
        });

        return testPaths;
    }

    apply(jestHooks) {
        jestHooks.onFileChange(({projects}) => {
            // A file change has been detected by jest

            let dependencies = {};
            let modifiedFiles = [];

            // Build the inverted dependency tree and get the files that were modified
            projects.forEach((project) => {
                const result = this.onFileChange(project.config.rootDir, dependencies, modifiedFiles);
                dependencies = result.dependencies;
                modifiedFiles = result.modifiedFiles;
            });

            // Filter the dependencies down to files that were modified only
            const modifiedDependencies = this.getModifiedDependencies(dependencies, modifiedFiles);

            // Get a array of test paths that jest will check tests against to see if it should run the test
            this.testPaths = this.getTestPaths(modifiedDependencies);
        });
        
        jestHooks.shouldRunTestSuite(({testPath}) => {
            // Check to see if this test should be run
            for (let i=0;i<this.testPaths.length;i++) {
                if (testPath.includes(this.testPaths[i])) {
                    return true;
                }
            }
        });

        jestHooks.onTestRunComplete(results => {
            // Store the last run date time
            this.lastRun = new Date();
        });
    }
}

module.exports = OnlyChangedJestWatchPlugin;