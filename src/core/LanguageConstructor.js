const Language = require("./language.js");
const NounInflectionClass = require("./inflectionclasses/NounInflectionClass.js");
const VerbInflectionClass = require("./inflectionclasses/VerbInflectionClass.js");
const InflectionPattern = require("./inflectionpattern.js");

const fs = require("fs");

class LanguageConstructor {
    static constructLanguageFromJSON(json) {
        let language = new Language(json.name);

        language.name = json.name;
        language.moods = json.moods;
        language.tenses = json.tenses;
        language.numbers = json.numbers;
        language.persons = json.persons;
        language.voices = json.voices;
        language.genders = json.genders;

        let nounInflectionClasses = json["nounInflectionClasses"];

        nounInflectionClasses.forEach((inflectionClass) => {
            let nounInflectionClass = new NounInflectionClass(
                inflectionClass.name,
                inflectionClass.rootPatterns,
                inflectionClass.numbers,
                inflectionClass.genders,
                inflectionClass.cases
            );

            let numberJSON = { ...inflectionClass.inflectionPatternMatrix };
            let genderJSON = { ...numberJSON };
            let caseJSON = { ...genderJSON };

            Object.keys(inflectionClass.inflectionPatternMatrix).forEach((number) => {
                Object.keys(inflectionClass.inflectionPatternMatrix[number]).forEach((gender) => {
                    Object.keys(inflectionClass.inflectionPatternMatrix[number][gender]).forEach((case_) => {
                        let obj = inflectionClass.inflectionPatternMatrix[number][gender][case_];

                        let inflectionPattern = new InflectionPattern(
                            obj.rootPattern,
                            obj.replacements,
                            obj.inflectionIndices
                        );
                        nounInflectionClass.addInflectionPattern(number, gender, case_, inflectionPattern);
                    });
                });
            });

            language.addNounInflectionClass(nounInflectionClass);
        });

        let verbInflectionClasses = json["verbInflectionClasses"];
        verbInflectionClasses.forEach((inflectionClass) => {
            let verbInflectionClass = new VerbInflectionClass(
                inflectionClass.name,
                inflectionClass.rootPattern,
                inflectionClass.moods,
                inflectionClass["voices"],
                inflectionClass.tenses,
                inflectionClass.numbers,
                inflectionClass["persons"]
            );

            let numberJSON = { ...inflectionClass.inflectionPatternMatrix };
            let personJSON = { ...numberJSON };
            let moodJSON = { ...personJSON };
            let tenseJSON = { ...moodJSON };
            let voiceJSON = { ...tenseJSON };

            Object.keys(inflectionClass.inflectionPatternMatrix).forEach((mood) => {
                Object.keys(inflectionClass.inflectionPatternMatrix[mood]).forEach((voice) => {
                    Object.keys(inflectionClass.inflectionPatternMatrix[mood][voice]).forEach((tense) => {
                        Object.keys(inflectionClass.inflectionPatternMatrix[mood][voice][tense]).forEach((number) => {
                            Object.keys(inflectionClass.inflectionPatternMatrix[mood][voice][tense][number]).forEach(
                                (person) => {
                                    let obj =
                                        inflectionClass.inflectionPatternMatrix[mood][voice][tense][number][person];

                                    let inflectionPattern = new InflectionPattern(
                                        obj.rootPattern,
                                        obj.replacements,
                                        obj.inflectionIndices
                                    );

                                    verbInflectionClass.addInflectionPattern(
                                        mood,
                                        voice,
                                        tense,
                                        number,
                                        person,
                                        inflectionPattern
                                    );
                                }
                            );
                        });
                    });
                });
            });

            language.addVerbInflectionClass(verbInflectionClass);
        });

        return language;
    }

    static constructLanguageFromJSONFile(path) {
        const jsonFile = fs.readFileSync(path);

        const json = JSON.parse(jsonFile);

        return LanguageConstructor.constructLanguageFromJSON(json);
    }
}

module.exports = LanguageConstructor;
