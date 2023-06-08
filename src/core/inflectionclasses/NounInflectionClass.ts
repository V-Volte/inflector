import InflectionClass from "./InflectionClass";
import InflectionPattern from "../InflectionPattern";
import RegexReplacer from "../../helpers/RegexReplacer";

export default class NounInflectionClass extends InflectionClass {
    public rootPatterns: string[];
    public numbers: string[];
    public genders: string[];
    public cases: string[];
    public inflectionPatternMatrix: any;

    constructor(name: string, rootPatterns: string[], numbers: string[], genders: string[], cases: string[]) {
        super(name);
        this.rootPatterns = rootPatterns;
        for (let idx in this.rootPatterns) {
            this.rootPatterns[idx] = RegexReplacer.canonize(this.rootPatterns[idx]);
        }
        this.numbers = numbers;
        this.genders = genders;
        this.cases = cases;
        this.inflectionPatternMatrix = {};
    }

    /**
     * Adds a new inflection pattern to the inflection pattern matrix.
     *
     * @param {string} number   The number of the inflection pattern.
     * @param {string} gender   The gender of the inflection pattern.
     * @param {string} case_     The case of the inflection pattern.
     * @param {InflectionPattern} inflectionPattern   The inflection pattern to add.
     */

    addInflectionPattern(number: string, gender: string, case_: string, inflectionPattern: InflectionPattern): void {
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

    /**
     * Adds a new inflection pattern to the inflection pattern matrix.
     *
     * @param {string} number   The number of the inflection pattern.
     * @param {string} gender   The gender of the inflection pattern.
     * @param {string} case_     The case of the inflection pattern.
     * @param {string[]} replacements   The replacements of capturing groups.
     * @param {number[]} inflectionIndices  The indices of the capturing groups that must be replaced.
     */

    addInflection(
        number: string,
        gender: string,
        case_: string,
        replacements: string[],
        inflectionIndices: number[]
    ): void {
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

    /**
     * Returns the inflection of a root
     *
     * @param {string} root The root word.
     * @param {string} number The number of the inflection.
     * @param {string} gender The gender of the inflection.
     * @param {string} case_ The case of the inflection.
     *
     * @returns {string} The inflection of the root.
     */

    inflect(root: string, number: string, gender: string, case_: string): string {
        let ret = `ReturnValueOf( ${root}, ${number}, ${gender}, ${case_} )`;
        try {
            ret = this.inflectionPatternMatrix[number][gender][case_].inflect(root);
        } catch (e) {
            console.error(e);
            ret = "";
        }
        return ret;
    }

    /**
     * Returns a specific inflection pattern.
     * @param {string} number The number of the inflection pattern.
     * @param {string} gender The gender of the inflection pattern.
     * @param {string} case_ The case of the inflection pattern.
     *
     * @returns {InflectionPattern} The inflection pattern.
     */

    getInflectionPattern(number: string, gender: string, case_: string): InflectionPattern {
        return this.inflectionPatternMatrix[number][gender][case_];
    }

    getInflectionTable(): any {
        return this.inflectionPatternMatrix;
    }

    /**
     * Returns a markdown table of the inflection pattern matrix.
     *
     * @param {string} root The root word.
     * @param {string} gender The gender of the word.
     *
     * @returns {string} The markdown table of the inflection pattern matrix.
     */

    generateMarkdownInflectionTable(root: string, gender: string): string {
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
