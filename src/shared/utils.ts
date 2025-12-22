/* Shared function to validate the password so can be used on client and server side */
export function getPswdValidities(name: string, email: string, pswd: string) {
    const pswdLen = pswd.length >= 8;
    const nameOrEmail =
        pswd !== "" && !(pswd.includes(name) || pswd.includes(email));
    const ul = /[A-Z]/.test(pswd);
    const ll = /[a-z]/.test(pswd);
    const nums = /\d/.test(pswd);
    const specChars = /[!-\/:-@[-`{-~]/.test(pswd); // https://stackoverflow.com/a/32311188

    return {
        pswdLen,
        nameOrEmail,
        ul,
        ll,
        nums,
        specChars,
    };
}

