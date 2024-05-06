import nodemailer, { Transporter } from 'nodemailer';

export interface SendOptions{
    to : string | string[],
    subject : string,
    html : string,
    attachments? : Attachment[]
}

interface Attachment{
    filename : string,
    path : string
}

export class EmailService{
    private transporter :Transporter;

    constructor(
        public readonly mailerService:string,
        public readonly mailerEmail:string,
        public readonly mailerSecretKey:string
    ){
        this.transporter = nodemailer.createTransport({
            service : mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKey
            }
        })
    }
    async sendEmail(options:SendOptions):Promise<boolean>{
        try {
            // de nada me sirve desestructurar si ya me pide un Objeto Literal
            const sendInformation = await this.transporter.sendMail(options);
            console.log("Email Send");
            return true;
        } catch (error) {
            return false
        }
    }

}