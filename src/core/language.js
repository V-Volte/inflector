class Language {
    constructor(name, moods=[], tenses=[], numbers=[], persons=[], voices=[], genders=[], cases=[], inflectionClasses = []) {
        this.name = name;
        this.moods = moods;
        this.tenses = tenses;
        this.numbers = numbers;
        this.persons = persons;
        this.cases = cases;
        this.voices = voices;
        this.genders = genders;
        this.inflectionClasses = inflectionClasses;
    }
}

module.exports = Language;