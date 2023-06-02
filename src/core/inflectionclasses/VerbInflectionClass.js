const InflectionClass = require("./inflectionclass.js");

//TODO: Add voices
class VerbInflectionClass extends InflectionClass {
    constructor(name, rootPattern, moods, voices, tenses, numbers, persons) {
        super(name);
        this.rootPattern = rootPattern;
        this.moods = moods;
        this.voices = voices;
        this.tenses = tenses;
        this.numbers = numbers;
        this.persons = persons;
        this.inflectionPatternMatrix = {};
    }

    addInflectionPattern(mood, voice, tense, number, person, replacements, inflectionIndices) {
        if (this.inflectionPatternMatrix[mood] === undefined) {
            this.inflectionPatternMatrix[mood] = {};
        }

        if (this.inflectionPatternMatrix[mood][voice] === undefined) {
            this.inflectionPatternMatrix[mood][voice] = {};
        }

        if (this.inflectionPatternMatrix[mood][voice][tense] === undefined) {
            this.inflectionPatternMatrix[mood][voice][tense] = {};
        }

        if (this.inflectionPatternMatrix[mood][voice][tense][number] === undefined) {
            this.inflectionPatternMatrix[mood][voice][tense][number] = {};
        }

        this.inflectionPatternMatrix[mood][voice][tense][number][person] = new InflectionPattern(
            this.rootPattern,
            replacements,
            inflectionIndices
        );
    }

    addInflectionPattern(mood, voice, tense, number, person, inflectionPattern) {
        if (this.inflectionPatternMatrix[mood] === undefined) {
            this.inflectionPatternMatrix[mood] = {};
        }

        if (this.inflectionPatternMatrix[mood][voice] === undefined) {
            this.inflectionPatternMatrix[mood][voice] = {};
        }

        if (this.inflectionPatternMatrix[mood][voice][tense] === undefined) {
            this.inflectionPatternMatrix[mood][voice][tense] = {};
        }
        if (this.inflectionPatternMatrix[mood][voice][tense][number] === undefined) {
            this.inflectionPatternMatrix[mood][voice][tense][number] = {};
        }

        this.inflectionPatternMatrix[mood][voice][tense][number][person] = inflectionPattern;
    }

    inflect(root, mood, voice, tense, number, person) {
        let ret = `ReturnValueOf( ${root}, ${mood}, ${voice}, ${tense}, ${number}, ${person} )`;
        try {
            ret = this.inflectionPatternMatrix[mood][voice][tense][number][person].inflect(root);
        } catch (e) {
            //console.log(e);
            ret = "";
        }
        return ret;
    }

    getInflectionPattern(mood, voice, tense, number, person) {
        return this.inflectionPatternMatrix[mood][voice][tense][number][person];
    }

    getInflectionTable(mood, voice, tense) {
        if (this.inflectionPatternMatrix[mood] === undefined) {
            throw new Error(`Mood ${mood} not found`);
        }

        if (this.inflectionPatternMatrix[mood][voice] === undefined) {
            throw new Error(`Voice ${voice} not found`);
        }

        if (this.inflectionPatternMatrix[mood][voice][tense] === undefined) {
            throw new Error(`Tense ${mood} ${voice} ${tense} not found`);
        }

        return this.inflectionPatternMatrix[mood][tense];
    }

    generateMarkdownInflectionTable(root) {
        let ret = `# Inflection Table of *${root}*\n\n`;
        for (let mood in this.inflectionPatternMatrix) {
            ret += `## ${mood}\n`;
            for (let voice in this.inflectionPatternMatrix[mood]) {
                ret += `### ${voice}\n`;
                for (let tense in this.inflectionPatternMatrix[mood][voice]) {
                    ret += `### ${tense}\n`;

                    console.error(this.numbers);

                    let header = `| Person |`;
                    header += this.numbers.map((number) => number).join("|");
                    header += "|\n|";
                    header += this.numbers.map((number) => "---").join("|");
                    header += "|---";
                    header += "|\n";

                    ret += header;

                    for (let person of this.persons) {
                        ret += `|**${person}**|`;
                        for (let number of this.numbers)
                            ret += this.inflect(root, mood, voice, tense, number, person) + "|";
                        ret += "\n";
                    }
                }
            }
        }
        return ret;
    }
}

module.exports = VerbInflectionClass;
