const InflectionClass = require('./inflectionclass.js');

class NounInflectionClass {
    constructor(language, name, rootPattern, numbers, cases) {
        this.name = name;
        this.language = language;
        this.rootPattern = rootPattern;
        this.numbers = numbers;
        this.cases = cases;
        this.inflectionPatternMatrix = {};
    }

    addInflectionPattern(number, case_, inflectionPattern) {
        if (this.inflectionPatternMatrix[number] === undefined) {
            this.inflectionPatternMatrix[number] = {};
        }
        if (this.inflectionPatternMatrix[number][case_] === undefined) {
            this.inflectionPatternMatrix[number][case_] = {};
        }

        this.inflectionPatternMatrix[number][case_] = inflectionPattern;
    }

    inflect(root, number, case_) {
        let ret = `ReturnValueOf( ${root}, ${number}, ${case_} )`
        try {
            ret = this.inflectionPatternMatrix[number][case_].inflect(root);
        }
        catch (e) {
            //console.log(e);
            ret = ""
        }
        return ret;
    }

    getInflectionPattern(number, case_) {
        return this.inflectionPatternMatrix[number][case_];
    }

    getInflectionTable() {
        return this.inflectionPatternMatrix;
    }

    generateMarkdownInflectionTable(root) {
        let ret = `# Inflection Table of *${root}*\n\n`;
        
        // Print numbers in columns and cases in rows
        ret += "| Case |";
        for (let number of this.numbers) {
            ret += ` ${number} |`;
        }
        ret += "\n|";
        for (let number of this.numbers) {
            ret += " --- |";
        }
        ret += '--- |'
        ret += "\n";
        for (let case_ of this.cases) {
            ret += `| ${case_} |`;
            for (let number of this.numbers) {
                ret += ` ${this.inflect(root, number, case_)} |`;
            }
            ret += "\n";
        }

        return ret;
    }
}

module.exports = NounInflectionClass;