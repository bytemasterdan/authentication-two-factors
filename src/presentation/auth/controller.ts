import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";
import { EmailService } from "../services/email.service";

 export class AuthController {
    //Faltaria la inyeccion de dependencias
  constructor(
    public readonly authService: AuthService,
  ) {}

  private handleError(error : unknown, res:Response){
    if( error instanceof CustomError ){
        return res.status(error.statusCode).json({error: error.message});
    }
    return res.status(500).json({error: 'Internal server error'});
  }

  public register = (req:Request, res:Response) => {
    const [error, registerDto] = RegisterUserDto.create(req.body);
    
    if(error) return res.status(400).json({error});

    //Llamamos al servicio
    this.authService.registerUser(registerDto!)
    .then(user => res.json(user))
    .catch(error => this.handleError(error, res));
  }

  public login = (req:Request, res:Response) => {
      const [error, loginUserDto] = LoginUserDto.signIn(req.body);

      if(error) return res.status(400).json({error});

      //Llamamos al servicio
      this.authService.loginUser(loginUserDto!)
      .then(user => res.json(user))
      .catch(error => this.handleError(error, res));
  }

  public validateEmail = (req:Request, res:Response) => {
      const { token } = req.params;

      this.authService.validateEmail(token)
      .then(() => res.json('Email Validated'))
      .catch(error => this.handleError(error,res));
  }

 }