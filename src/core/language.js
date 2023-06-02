class Language {
    constructor(
        name,
        moods = [],
        tenses = [],
        numbers = [],
        persons = [],
        voices = [],
        genders = [],
        cases = [],
        nounInflectionClasses = [],
        verbInflectionClasses = []
    ) {
        this.name = name;
        this.moods = moods;
        this.tenses = tenses;
        this.numbers = numbers;
        this.persons = persons;
        this.cases = cases;
        this.voices = voices;
        this.genders = genders;
        this.nounInflectionClasses = nounInflectionClasses;
        this.verbInflectionClasses = verbInflectionClasses;
    }

    addNounInflectionClass(nounInflectionClass) {
        this.nounInflectionClasses.push(nounInflectionClass);
    }

    addVerbInflectionClass(verbInflectionClass) {
        this.verbInflectionClasses.push(verbInflectionClass);
    }

    getInflectionClass(type, inflectionClassName) {
        if (type.toLowerCase() === "noun") {
            return this.nounInflectionClasses.find(
                (inflectionClass) =>
                    inflectionClass.name === inflectionClassName
            );
        } else if (type.toUpperCase() === "verb") {
            return this.verbInflectionClasses.find(
                (inflectionClass) =>
                    inflectionClass.name === inflectionClassName
            );
        }
        throw new Error("Invalid type (should be 'noun' or 'verb')");
    }

    inflect(root, inflectionClass, ...args) {
        let ret = `ReturnValueOf( ${root}, ${inflectionClass}, ${args} )`;
        try {
            ret = inflectionClass.inflect(root, ...args);
        } catch (e) {
            //console.log(e);
            ret = "";
        }
        return ret;
    }
}

module.exports = Language;
