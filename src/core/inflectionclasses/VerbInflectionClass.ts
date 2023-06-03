import InflectionPattern from "../InflectionPattern";
import InflectionClass from "./InflectionClass";

export default class VerbInflectionClass extends InflectionClass {
    public rootPattern: string;
    public moods: string[];
    public voices: string[];
    public tenses: string[];
    public numbers: string[];
    public persons: string[];
    public inflectionPatternMatrix: any;

    constructor(
        name: string,
        rootPattern: string,
        moods: string[],
        voices: string[],
        tenses: string[],
        numbers: string[],
        persons: string[]
    ) {
        super(name);
        this.rootPattern = rootPattern;
        this.moods = moods;
        this.voices = voices;
        this.tenses = tenses;
        this.numbers = numbers;
        this.persons = persons;
        this.inflectionPatternMatrix = {};
    }

    /**
     *
     * @param {string} mood The mood of the new inflection.
     * @param {string} voice The voice of the new inflection.
     * @param {string} tense The tense of the new inflection.
     * @param {string} number The number of the new inflection.
     * @param {string} person The person of the new inflection.
     * @param {string[]} replacements The replacements of capturing groups.
     * @param {number[]} inflectionIndices The indices of the capturing groups that must be replaced.
     *
     */

    addInflection(
        mood: string,
        voice: string,
        tense: string,
        number: string,
        person: string,
        replacements: string[],
        inflectionIndices: number[]
    ) {
        this.addInflectionPattern(
            mood,
            voice,
            tense,
            number,
            person,
            new InflectionPattern(this.rootPattern, replacements, inflectionIndices)
        );
    }
    /**
     *
     * @param {string} mood The mood of the new inflection.
     * @param {string} voice The voice of the new inflection.
     * @param {string} tense The tense of the new inflection.
     * @param {string} number The number of the new inflection.
     * @param {string} person The person of the new inflection.
     * @param {InflectionPattern} inflectionPattern The inflection pattern to add.
     */

    addInflectionPattern(
        mood: string,
        voice: string,
        tense: string,
        number: string,
        person: string,
        inflectionPattern: InflectionPattern
    ) {
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

    /**
     * Inflects a root.
     * @param {string} root The root to inflect.
     * @param {string} mood The mood of the inflection.
     * @param {string} voice The voice of the inflection.
     * @param {string} tense The tense of the inflection.
     * @param {string} number The number of the inflection.
     * @param {string} person The person of the inflection.
     *
     * @returns {string} The inflected root.
     */

    inflect(root: any, mood: string, voice: string, tense: string, number: string, person: string): string {
        let ret = `ReturnValueOf( ${root}, ${mood}, ${voice}, ${tense}, ${number}, ${person} )`;
        try {
            ret = this.inflectionPatternMatrix[mood][voice][tense][number][person].inflect(root);
        } catch (e) {
            //console.log(e);
            ret = "";
        }
        return ret;
    }

    getInflectionPattern(mood: string, voice: string, tense: string, number: string, person: string) {
        return this.inflectionPatternMatrix[mood][voice][tense][number][person];
    }

    getInflectionTable(mood: string, voice: string, tense: string) {
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

    /**
     * Generate a markdown inflection table.
     * @param {string} root The root of the inflection table.
     *
     * @returns {string} The markdown inflection table.
     */
    generateMarkdownInflectionTable(root: string) {
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
