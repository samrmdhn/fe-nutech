import Cookies from "js-cookie";

export const useCookies = () => {
    const cookies = Cookies.get("___session");

    if (!cookies) return false;

    return true;
};
