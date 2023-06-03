export default class InflectionPattern {
    public rootPattern: RegExp;
    public replacements: string[];
    public inflectionIndices: number[];

    constructor(rootPattern: string | RegExp, replacements: string[], inflectionIndices: number[]) {
        this.rootPattern = RegExp(rootPattern, "g");
        this.replacements = replacements;
        this.inflectionIndices = inflectionIndices;
    }

    toString() {
        return `(${this.rootPattern}, ${this.replacements}, ${this.inflectionIndices})`;
    }

    inflect(root: string): string {
        let matches = root.matchAll(this.rootPattern);
        if (matches === null) {
            throw new Error(`Root ${root} does not match pattern ${this.rootPattern}`);
        }

        // If the root matches the pattern, return a string converting it into the result pattern
        let result = "";

        //matches = root.matchAll(this.rootPattern);

        let cmatch = matches.next().value;

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
}
