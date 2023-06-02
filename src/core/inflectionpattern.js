class InflectionPattern {
    constructor(rootPattern, replacements, inflectionIndices) {
        this.rootPattern = rootPattern;
        this.replacements = replacements;
        this.inflectionIndices = inflectionIndices;
    }

    inflect(root) {
        let matches = root.match(this.rootPattern);
        if (matches === null) {
            throw new Error(
                `Root ${root} does not match pattern ${this.rootPattern}`
            );
        }

        // If the root matches the pattern, return a string converting it into the result pattern
        let result = "";

        matches = root.matchAll(this.rootPattern);

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

module.exports = InflectionPattern;
