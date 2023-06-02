class InflectionClass {
    constructor(language, name) {
        this.name = name;
        this.language = language;
    }
}

class VerbInflectionClass extends InflectionClass {
    constructor(language, name, rootPattern, moods, tenses, numbers, persons) {
        super(language, name);
        this.rootPattern = rootPattern;
        this.moods = moods;
        this.tenses = tenses;
        this.numbers = numbers;
        this.persons = persons;
        this.inflectionPatternMatrix = {};

        // for (let mood of moods) {
        //     let moodRow = [  ];
        //     for (let tense of tenses) {
        //         let tenseRow = [  ];
        //         for (let number of numbers) {
        //             let numberRow = [  ];
        //             for (let person of persons) {
        //                 numberRow.push(null);
        //             }
        //             tenseRow.push(numberRow);
        //         }
        //         moodRow.push(tenseRow);
        //     }
        //     this.inflectionPatternMatrix.push(moodRow);
        // }
    }

    addInflectionPattern(mood, tense, number, person, inflectionPattern) {
        //console.log(mood, tense, number, person, inflectionPattern)

        if (this.inflectionPatternMatrix[mood] === undefined) {
            this.inflectionPatternMatrix[mood] = {};
        }
        if (this.inflectionPatternMatrix[mood][tense] === undefined) {
            this.inflectionPatternMatrix[mood][tense] = {};
        }
        if (this.inflectionPatternMatrix[mood][tense][number] === undefined) {
            this.inflectionPatternMatrix[mood][tense][number] = {};
        }

        this.inflectionPatternMatrix[mood][tense][number][person] = inflectionPattern;
    }

    inflect(root, mood, tense, number, person) {
        let ret = `ReturnValueOf( ${root}, ${mood}, ${tense}, ${number}, ${person} )`
        try {
            ret = this.inflectionPatternMatrix[mood][tense][number][person].inflect(root);
        }
        catch (e) {
            //console.log(e);
            ret = ""
        }
        return ret;
    }

    getInflectionPattern(mood, tense, number, person) {
        return this.inflectionPatternMatrix[mood][tense][number][person];
    }

    getInflectionTable(mood, tense) {
        if (this.inflectionPatternMatrix[mood] === undefined) {
            throw new Error(`Mood ${mood} not found`);
        }
        if (this.inflectionPatternMatrix[mood][tense] === undefined) {
            throw new Error(`Tense ${mood} ${tense} not found`);
        }

        return this.inflectionPatternMatrix[mood][tense];
    }

    generateMarkdownInflectionTable(root) {
        let ret = `# Inflection Table of *${root}*\n\n`;
        for (let mood in this.inflectionPatternMatrix) {
            ret += `## ${mood}\n`;
            for (let tense in this.inflectionPatternMatrix[mood]) {
                ret += `### ${tense}\n`;

                console.error(this.numbers);

                let header = `| Person |`
                header += this.numbers.map((number) => number).join("|");
                header += "|\n|";
                header += this.numbers.map((number) => "---").join("|");
                header += '|---'
                header += "|\n";

                ret += header;

                for(let person of this.persons) {
                    ret += `|**${person}**|`;
                    for (let number of this.numbers)
                        ret += this.inflect(root, mood, tense, number, person) + "|";
                    ret += '\n';    
                }
            }
        }
        return ret;
    }

}

module.exports = VerbInflectionClass;

