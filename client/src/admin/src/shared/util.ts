import * as Api_original from '../../../js/apiFetch'
export const Api = Api_original;

// Calendar related
export const Months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October" , "November", "December"];
export const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const Repeats = {
    None: "None",
    Daily:"Daily",
    Weekly:"Weekly",
    Monthly:"Monthly"
};

export function createErrorMessage() {

}


export function unescape(str:string) {
    return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#x5C;/g, '\\').replace(/&#96;/g, '`');
}