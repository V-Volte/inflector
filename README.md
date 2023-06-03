# inflector

Inflector is a project that aims to generate inflections of words based on specified rules and exceptions. The rules must be specified using Regular expressions. Language data can be fed as a JSON file.

Inflector is in the early stages of development. Any contribution is welcome.

## Usage

- Clone the repository with `git clone https://github.com/V-Volte/inflector`
- Install the dependencies with `npm install`
- Create a file called `index.js` (or anything else) in the root directory of the project.

I've prepared an example file that defines a subset of the conjugation and declension rules for Latin. You can find this file as `latin.json` in the `examplepatterns` directory.

To load the Latin language from this file, all you have to do is:
    
```js
const LanguageConstructor = require('./src/core/LanguageConstructor');

const latin = LanguageConstructor.constructLanguageFromJSONFile('./examplepatterns/latin.json');
```

Now, you can inflect any word using the `inflectNoun` or `inflectVerb` method of the `Language` class:

```ts
const augustus = "Augustus";
const amare = "Amāre";

console.log(latin.inflectNoun(augustus, "First Declension", "Plural", "Plural", "Genitive"));
console.log(
    latin.inflectVerb(amare, "First Conjugation", "Indicative", "Active", "Present", "Singular", "First")
);
```

Or, you can use the `generateMarkdownInflectionTable()` method of `InflectionClass` to generate a Markdown table of all the inflections of a word:

```js
const fs = require('fs');
fs.writeFileSync('inflections.md', latin.getNounInflectionClass("First Declension")?.generateMarkdownInflectionTable(augustus, "Masculine"))
```

## Defining a language

Currently, defining a new language and rules in JSON is very tedious and frankly, impossible for a normal human. Even generating this file took me about 15 minutes with Copilot automatically adding the inflection patterns in JavaScript. I'm currently working on a better way to define the rules, probably using a different JSON structure, or maybe something like YAML.

If, however, you have access to Copilot or any other AI that can generate code, you can use the `addInflectionPattern` function and others of its ilk to create a Language object, and save it by `stringify`ing it into a JSON file. This is how I generated the `latin.json` file:

```js
const latin = new Language(
    "Latin",
    ["Indicative", "Subjunctive", "Imperative"],
    ["Present", "Imperfect", "Future", "Perfect", "Pluperfect", "Future Perfect"],
    ["Singular", "Plural"],
    ["First", "Second", "Third"],
    ["Active", "Passive"],
    ["Masculine", "Feminine", "Neuter"],
    ["Nominative", "Genitive", "Dative", "Accusative", "Ablative", "Vocative", "Locative"]
);

const firstConjugation = new VerbInflectionClass(
    "First Conjugation",
    "(.*)(āre)",
    latin.moods,
    latin.voices,
    latin.tenses,
    latin.numbers,
    latin.persons
);

firstConjugation.addInflectionPattern(
    "Indicative",
    "Active",
    "Present",
    "Singular",
    "First",
    new InflectionPattern(firstConjugation.rootPattern, ["ō"], [1])
);
```
...and so on.

## Contributing

If you want to contribute to this project, you can do so by creating a pull request. I'll be happy to review it and merge it if it's good. If you have any suggestions, you can create an issue.

Any contribution is welcome!