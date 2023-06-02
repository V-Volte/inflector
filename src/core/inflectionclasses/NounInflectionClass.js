const InflectionClass = require("./inflectionclass.js");

class NounInflectionClass extends InflectionClass {
    constructor(name, rootPatterns, numbers, genders, cases) {
        super(name);
        this.rootPatterns = rootPatterns;
        this.numbers = numbers;
        this.genders = genders;
        this.cases = cases;
        this.inflectionPatternMatrix = {};
    }

    addInflectionPattern(
        number,
        gender,
        case_,
        replacements,
        inflectionIndices
    ) {
        if (this.inflectionPatternMatrix[number] === undefined) {
            this.inflectionPatternMatrix[number] = {};
        }

        if (this.inflectionPatternMatrix[number][gender] === undefined) {
            this.inflectionPatternMatrix[number][gender] = {};
        }

        if (this.inflectionPatternMatrix[number][gender][case_] === undefined) {
            this.inflectionPatternMatrix[number][gender][case_] = {};
        }

        this.inflectionPatternMatrix = new InflectionPattern(
            this.rootPatterns[this.genders.indexOf(gender)],
            replacements,
            inflectionIndices
        );
    }

    addInflectionPattern(number, gender, case_, inflectionPattern) {
        if (this.inflectionPatternMatrix[number] === undefined) {
            this.inflectionPatternMatrix[number] = {};
        }

        if (this.inflectionPatternMatrix[number][gender] === undefined) {
            this.inflectionPatternMatrix[number][gender] = {};
        }

        if (this.inflectionPatternMatrix[number][gender][case_] === undefined) {
            this.inflectionPatternMatrix[number][gender][case_] = {};
        }

        this.inflectionPatternMatrix[number][gender][case_] = inflectionPattern;
    }

    inflect(root, number, gender, case_) {
        let ret = `ReturnValueOf( ${root}, ${number}, ${gender}, ${case_} )`;
        try {
            ret =
                this.inflectionPatternMatrix[number][gender][case_].inflect(
                    root
                );
        } catch (e) {
            console.error(e);
            ret = "";
        }
        return ret;
    }

    getInflectionPattern(number, gender, case_) {
        return this.inflectionPatternMatrix[number][gender][case_];
    }

    getInflectionTable() {
        return this.inflectionPatternMatrix;
    }

    generateMarkdownInflectionTable(root, gender) {
        let ret = `# Inflection Table of *${root}*\n\n`;

        // Print numbers in columns and cases in rows
        ret += `## ${gender} gender\n\n`;
        ret += "| Case |";
        for (let number of this.numbers) {
            ret += ` ${number} |`;
        }
        ret += "\n|";
        for (let number of this.numbers) {
            ret += " --- |";
        }
        ret += "--- |";
        ret += "\n";
        for (let case_ of this.cases) {
            ret += `| ${case_} |`;
            for (let number of this.numbers) {
                ret += ` ${this.inflect(root, number, gender, case_)} |`;
            }
            ret += "\n";
        }

        return ret;
    }
}

module.exports = NounInflectionClass;
