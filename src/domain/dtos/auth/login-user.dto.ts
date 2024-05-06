import { regularExps } from "../../../config";

export class LoginUserDto{

    constructor(
        public readonly email: string,
        public readonly password: string
    ){}

    static signIn(object: {[key:string]:any}):[string?, LoginUserDto?]{
        const {  email, password } = object;
        if(!email) return ['Missing email'];
        if(!regularExps.email.test(email)) return ['Email not valid'];
        if(!password) return ['Missing password'];
        if(password.length < 6) return ['Password not valid'];

        return [undefined, new LoginUserDto( email, password)];       
    }
}