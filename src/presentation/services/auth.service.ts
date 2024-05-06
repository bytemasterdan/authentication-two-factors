import { bcryptAdapter, JwtAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
    constructor(){}
    public async registerUser(registerUserDto:RegisterUserDto){
        const existsUser = await UserModel.findOne({ email: registerUserDto.email });
        if( existsUser ) throw CustomError.forbidden('Email already exists');

        try {
            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            const { password,...userEntity} = UserEntity.fromObject(user);

            return {user: {...userEntity}, token: 'ABC123'};
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

}