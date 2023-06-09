import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";
export const useJWT = () => {
    const cookies = Cookies.get("___session");

    if (!cookies) return false;

    const data = jwt_decode(cookies);

    const credentials = { ...data, jwt: cookies };

    return { credentials };
};
