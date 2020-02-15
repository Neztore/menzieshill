import * as Api_original from '../../../js/apiFetch'
export const Api = Api_original;

export function createErrorMessage() {

}


export function unescape(str:string) {
    return str.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#x2F;/g, '/').replace(/&#x5C;/g, '\\').replace(/&#96;/g, '`');
}