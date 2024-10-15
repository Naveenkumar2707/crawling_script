const request = require("request");
const cheerio = require("cheerio");
const rp = require("request-promise")
let urlString: string;
let searchStrings: string[] = [];



async function init(): Promise<void> {
    const args = process.argv.slice(2)
    if (!args[0] || !args[1]) {
        throw new Error("Please specify the URL & Search string!")
    }
    this.urlString = String(args[0].split("=")[1]).trim();
    const words = String(args[1].split("=")[1]);
    this.searchStrings = words.split(",")
}
async function run(): Promise<void> {
    await init();
    const options = {
        url: this.urlString,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    const $ = await rp(options);
    let text = $.text();
    for (let item of this.searchStrings) {
        const count = await checkOccurences(text, item);
        console.log(`${item} : ${count}`);
    }
    process.exit();
}


async function checkOccurences(text: string, word: string): Promise<number> {
    text = text.replace(/\s+/g, ' ').trim().toLowerCase();
    return text.split(word.trim().toLowerCase()).length - 1;
}

module.exports.run = run

if (require.main == module) {
    run()
        .catch((error) => {
            console.log("String searching failed with error: ", error);
            process.exit();
        });
}