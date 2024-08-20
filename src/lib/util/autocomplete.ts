export class AutoComplete {
    camelSplitter = /(?:^|[A-Z]).*?(?=[A-Z]|$)/g;
    words: string[] = [];
    split: { [key: string]: string[]} = {};


    addWord(word: string) {
        this.words.push(word);
        this.split[word] =  [...word.matchAll(this.camelSplitter)]
            .map(x => x[0].toLowerCase());
    }

    getMatches(partial: string): string[] {
        return this.words.filter(x => this.scoreMatch(partial, x));
    }

    scoreMatch(partial: string, word: string): boolean {
        return this.scoreMatchWithWordList(partial.toLowerCase(), this.split[word]);
    }

    scoreMatchWithWordList(partial: string, words: string[]): boolean {
        for (let word of words) {
            if (word.startsWith(partial)) {
                return true;
            }
        }

        for (let i = 1; i < partial.length; i++) {
            // things like: 'zi' match 'zoomIn'

            let first = partial.substring(0, i);
            let second = partial.substring(i);

            let queue: string[] = [...words];

            while (queue.length > 1) {
                let word = queue.shift();
                if (word!.startsWith(first)) {
                    if (this.scoreMatchWithWordList(second, queue)) {
                        return true;
                    }
                    else {
                        break;
                    }
                }
            }
        }

        return false;
    }
}