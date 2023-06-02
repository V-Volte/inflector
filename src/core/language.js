class Language {
    constructor(name, moods=[], tenses=[], numbers=[], persons=[], cases=[], inflectionClasses = []) {
        this.name = name;
        this.moods = moods;
        this.tenses = tenses;
        this.numbers = numbers;
        this.persons = persons;
        this.cases = cases;
        this.inflectionClasses = inflectionClasses;
    }
}

module.exports = Language;