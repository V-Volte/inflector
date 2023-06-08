import RegexReplacer from "../helpers/RegexReplacer";

export default class InflectionPattern {
    public rootPattern: RegExp;
    public replacements: string[];
    public inflectionIndices: number[];
    public pattern: RegExp;

    constructor(rootPattern: string | RegExp, replacements: string[], inflectionIndices: number[]) {
        let x = RegExp(rootPattern, "").toString();
        x = x.substring(1, x.length - 1);
        this.rootPattern = RegExp(`^${x}\$`, "g");
        this.replacements = replacements;
        this.inflectionIndices = inflectionIndices;
        this.pattern = RegExp(RegexReplacer.transformRegex(rootPattern, replacements, inflectionIndices), "g");
    }

    toString() {
        return `(${this.rootPattern}, ${this.pattern})`;
    }

    inflect(root: string, caseSensitive: boolean = false): string {
        if (!caseSensitive) root = root.toLowerCase();
        if (!this.rootPattern.test(root)) {
            throw new Error(`Root ${root} does not match pattern ${this.rootPattern}`);
        }
        // DOES NOT WORK WITHOUT THIS LINE FOR SOME REASON
        root.match(this.rootPattern);

        // If the root matches the pattern, return a string converting it into the result pattern
        let result = "";

        //matches = root.matchAll(this.rootPattern);

        let cmatch = root.matchAll(this.rootPattern).next().value;

        for (let i = 1, j = 0; i < cmatch.length; i++) {
            if (this.inflectionIndices.includes(i - 1)) {
                result += this.replacements[j];
                j++;
            } else {
                result += cmatch[i];
            }
        }

        return result;
    }

    match(word: string): boolean {
        return this.pattern.test(word);
    }
}
