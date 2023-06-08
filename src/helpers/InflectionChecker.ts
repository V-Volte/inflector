import VerbInflectionClass from "../core/inflectionclasses/VerbInflectionClass";
import InflectionClass from "../core/inflectionclasses/InflectionClass";
import NounInflectionClass from "../core/inflectionclasses/NounInflectionClass";
import Language from "../core/Language";

export default class InflectionChecker {
    static checkInflection(
        x: InflectionClass,
        word: string
    ): (NounInflectionCheckResults | VerbInflectionCheckResults)[] {
        let results: (NounInflectionCheckResults | VerbInflectionCheckResults)[] = [];
        if (x instanceof VerbInflectionClass) {
            if (RegExp(x.rootPattern).test(word))
                results.push({
                    name: x.name,
                    rootPattern: x.rootPattern,
                    mood: "undefined",
                    voice: "undefined",
                    tense: "undefined",
                    number: "undefined",
                    person: "undefined",
                } as VerbInflectionCheckResults);
            x.moods.forEach((mood) => {
                x.voices.forEach((voice) => {
                    x.tenses.forEach((tense) => {
                        x.numbers.forEach((number) => {
                            x.persons.forEach((person) => {
                                try {
                                    if (x.inflectionPatternMatrix[mood][voice][tense][number][person]) {
                                        if (x.inflectionPatternMatrix[mood][voice][tense][number][person].match(word))
                                            results.push({
                                                name: x.name,
                                                rootPattern: x.rootPattern,
                                                mood: mood,
                                                voice: voice,
                                                tense: tense,
                                                number: number,
                                                person: person,
                                            } as VerbInflectionCheckResults);
                                    }
                                } catch (e) {}
                            });
                        });
                    });
                });
            });
        }
        if (x instanceof NounInflectionClass) {
            for (let rootpattern of x.rootPatterns) {
                try {
                    if (RegExp(rootpattern).test(word))
                        results.push({
                            name: x.name,
                            rootPattern: rootpattern,
                            number: "undefined",
                            gender: x.genders[x.rootPatterns.indexOf(rootpattern)],
                            case: "undefined",
                        } as NounInflectionCheckResults);
                } catch (e) {}
            }
            x.numbers.forEach((number) => {
                x.genders.forEach((gender) => {
                    x.cases.forEach((case_) => {
                        try {
                            let y = x.getInflectionPattern(number, gender, case_);
                            if (y.match(word))
                                results.push({
                                    name: x.name,
                                    rootPattern: x.rootPatterns[x.genders.indexOf(gender)],
                                    number: number,
                                    gender: gender,
                                    case: case_,
                                } as NounInflectionCheckResults);
                        } catch (e) {}
                    });
                });
            });
        }
        return results;
    }

    static checkAllInflections(language: Language, word: string) {
        let results: (NounInflectionCheckResults | VerbInflectionCheckResults)[] = [];
        language.nounInflectionClasses.forEach((x) => {
            let y = this.checkInflection(x, word);
            if (y) results.push(...y);
        });
        language.verbInflectionClasses.forEach((x) => {
            let y = this.checkInflection(x, word);
            if (y) results.push(...y);
        });
        return results;
    }
}

export type NounInflectionCheckResults = {
    name: string;
    rootPattern: string;
    number: string;
    gender: string;
    case: string;
};

export type VerbInflectionCheckResults = {
    name: string;
    rootPattern: string;
    mood: string;
    voice: string;
    tense: string;
    number: string;
    person: string;
};
