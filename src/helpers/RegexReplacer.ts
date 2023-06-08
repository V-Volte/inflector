export default class RegexReplacer {
    static transformRegex(regex: string | RegExp, replacements: string[], replacementIndices: number[]) {
        let outstr = "";

        regex = RegExp(regex, "").toString();
        regex = regex.substring(2, regex.length - 2);
        let splitregex = /[^()]+/;
        splitregex = RegExp(splitregex, "g");
        let matches = regex.matchAll(splitregex);
        let i = 0,
            j = 0;
        for (let match of matches) {
            let matchstr = match[0];

            if (replacementIndices.includes(i)) {
                outstr += `(${replacements[j]})`;
                j++;
            } else if (matchstr.match(/\{.*\}/)) {
                outstr += `${matchstr}`;
                i = i == 0 ? 0 : i - 1;
            } else outstr += `(${matchstr})`;

            i++;
        }
        return `^${outstr}$`;
    }

    static canonize(str: string): string {
        if (str[0] == "^") str = str.substring(1);
        if (str[str.length - 1] == "$") str = str.substring(0, str.length - 1);

        return `^${str}$`;
    }
}
