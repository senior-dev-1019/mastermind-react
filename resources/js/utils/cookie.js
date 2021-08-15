/**
 *
 * Created with love By George Popescu
 * cosmin.popescu21[at]gmail.com
 */
/**
 * Changed to use localStorage
 */

export const setCookie = (cname, cvalue, exdays) => {
    return localStorage.setItem(cname, cvalue);
    /**
     * No longer in use
     */
    var exdays = exdays || 2;
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
export const getCookie = cname => {
    return localStorage.getItem(cname);
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
export const deleteCookie = name => {
    return localStorage.removeItem(name);
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/app";
};
export const deleteAllCookies = () => {
    return localStorage.clear();
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/app";
    }
}

export const hasAdminAccess = () => {
    if([2, 10].includes(parseInt(getCookie('role')))){
        return true;
    }
    return false;
}

export const isAdmin = () => {
    if(getCookie('role') == 10){
        return true;
    }
    return false;
}