import { bcryptAdapter, envs, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { EmailService } from "./email.service";

export class AuthService {
    constructor(
        private emailService:EmailService
    ){}
    public async registerUser(registerUserDto:RegisterUserDto){
        const existsUser = await UserModel.findOne({ email: registerUserDto.email });
        if( existsUser ) throw CustomError.forbidden('Email already exists');

        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            this.sendEmailValidationLink( registerUserDto.email );

            const { password,...userEntity} = UserEntity.fromObject(user);

            return {user: {...userEntity}};
        } catch (error) {
            throw CustomError.internalError(`${ error }`);
        }
    }

    public async loginUser(loginUserDto:LoginUserDto){
      
        try{
        
            const user = await UserModel.findOne({ email: loginUserDto.email });
        
            if( !user ) throw CustomError.notFound('User not found');

            if( !bcryptAdapter.compare(loginUserDto.password, user.password) ) 
                throw CustomError.unauthorized('Invalid credentials');

            const { password,...userEntity} = UserEntity.fromObject(user); 

            const token = await JwtAdapter.generateToken({id:userEntity.id});
            if(!token) throw CustomError.internalError('Token not generated');
                

            return {user: {...userEntity}, token}; 
        }catch(error){
            throw CustomError.internalError(`${ error }`);
        }
    }

    private sendEmailValidationLink= async( email: string )=>{
        const token = await JwtAdapter.generateToken({email});
        if(!token) throw CustomError.internalError('Token not generated');

        const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${ token }`;
        const html = `
        <h1>Validate Email</h1>
        <p> Click to validate email </p>
        <a href="${link}">Validate Email</a> 
        `

        const options = {
            to: email,
            subject: 'Apolos - Second Step : validate your email',
            html
        }

        const isSent = await this.emailService.sendEmail(options);
        if(!isSent) throw CustomError.internalError('Email not sent');

        return true;

    }

    public validateEmail= async(token:string)=>{
        const payload = await JwtAdapter.validateToken(token);
        if(!payload) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as { email:string };

        if(!email) throw CustomError.internalError('Email not in token');

        const user = await UserModel.findOne({ email });
        if(!user) throw CustomError.notFound('User not found');

        user.emailValidated = true;
        await user.save();
        return true;

    }


}