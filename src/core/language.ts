import InflectionClass from "./inflectionclasses/InflectionClass";
import NounInflectionClass from "./inflectionclasses/NounInflectionClass";
import VerbInflectionClass from "./inflectionclasses/VerbInflectionClass";

export default class Language {
    public name: string;
    public moods: string[];
    public tenses: string[];
    public numbers: string[];
    public persons: string[];
    public voices: string[];
    public genders: string[];
    public cases: string[];
    public nounInflectionClasses: NounInflectionClass[];
    public verbInflectionClasses: VerbInflectionClass[];

    constructor(
        name: string,
        moods: string[] = [],
        tenses: string[] = [],
        numbers: string[] = [],
        persons: string[] = [],
        voices: string[] = [],
        genders: string[] = [],
        cases: string[] = [],
        nounInflectionClasses: NounInflectionClass[] = [],
        verbInflectionClasses: VerbInflectionClass[] = []
    ) {
        this.name = name;
        this.moods = moods;
        this.tenses = tenses;
        this.numbers = numbers;
        this.persons = persons;
        this.voices = voices;
        this.genders = genders;
        this.cases = cases;
        this.nounInflectionClasses = nounInflectionClasses;
        this.verbInflectionClasses = verbInflectionClasses;
    }

    addNounInflectionClass(nounInflectionClass: NounInflectionClass): void {
        this.nounInflectionClasses.push(nounInflectionClass);
    }

    addVerbInflectionClass(verbInflectionClass: VerbInflectionClass): void {
        this.verbInflectionClasses.push(verbInflectionClass);
    }

    getNounInflectionClass(name: string): NounInflectionClass | undefined {
        return this.nounInflectionClasses.find((nounInflectionClass) => nounInflectionClass.name === name);
    }

    getVerbInflectionClass(name: string): VerbInflectionClass | undefined {
        return this.verbInflectionClasses.find((verbInflectionClass) => verbInflectionClass.name === name);
    }

    getInflectionClass(name: string): InflectionClass | undefined {
        return this.getNounInflectionClass(name) || this.getVerbInflectionClass(name);
    }

    inflectVerb(
        root: string,
        verbInflectionClassName: string,
        mood: string,
        voice: string,
        tense: string,
        number: string,
        person: string
    ) {
        const verbInflectionClass = this.getVerbInflectionClass(verbInflectionClassName);

        if (verbInflectionClass === undefined) {
            throw new Error(`Verb inflection class ${verbInflectionClassName} not found.`);
        }

        return verbInflectionClass.inflect(root, mood, voice, tense, number, person);
    }

    inflectNoun(root: string, nounInflectionClassName: string, number: string, gender: string, case_: string) {
        const nounInflectionClass = this.getNounInflectionClass(nounInflectionClassName);

        if (nounInflectionClass === undefined) {
            throw new Error(`Noun inflection class ${nounInflectionClassName} not found.`);
        }

        return nounInflectionClass.inflect(root, number, gender, case_);
    }
}

// type VerbInflectionParams = {
//     mood: "";
//     voice: "";
//     tense: "";
//     number: "";
//     person: "";
// };

// type NounInflectionParams = {
//     number: "";
//     gender: "";
//     case: "";
// };

// function verbParamsList(params: VerbInflectionParams | any) {
//     return [params.mood, params.voice, params.tense, params.number, params.person];
// }

// function nounParamsList(params: NounInflectionParams) {
//     return [params.number, params.gender, params.case];
// }
