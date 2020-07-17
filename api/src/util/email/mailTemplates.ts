
import { readdirSync, readFile } from 'fs';
import { join } from 'path';

const templates:any = {};
const directory = join(__dirname, "..", "..", "..", "..", "emailTemplates");
readdirSync(directory).forEach(file => {
    const split = file.split(".")
    if (split[split.length - 1] === "html") {
        split.splice(split.length -1, 1)
        readFile(join(directory, file), (err, data) => {
            if (err) throw err;
            templates[split.join(".")] = data;
        });
    }
});
export type templateType =  "contactUs" |"passwordReset"|"welcome"
export function fillTemplate(templateName: templateType, values: any) {
    const template  = templates[templateName];
    if (template) {
        const keys = Object.keys(values);
        let newString = `${template}`;
        for (let k of keys) {
            const exp = new RegExp(`{{${k}}}`, 'g');
            newString = newString.replace(exp, values[k])
        }
        return newString
    } else {
        throw new Error(`Failed to fill template ${templateName}! No matching template.`)
    }
}
