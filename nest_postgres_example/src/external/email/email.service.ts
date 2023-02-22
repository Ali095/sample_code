import { Injectable, Logger } from "@nestjs/common";
import { NotImplementedException } from "@nestjs/common/exceptions/not-implemented.exception";
import { ConfigService } from "@nestjs/config";
import * as SendGrid from "@sendgrid/mail";
import { MailData, EmailResponse, EmailType } from "./_types";

@Injectable()
export class SendgridService {
	constructor(private readonly configService: ConfigService) {
		SendGrid.setApiKey(this.configService.get<string>("SENDGRID_API_KEY"));
	}

	private async sendMail(mail: SendGrid.MailDataRequired): Promise<any> {
		Logger.log(`Email successfully dispatched to ${mail.to}`, "Email Service");
		return SendGrid.send(mail);
	}

	public async sendMailToSingleUser(mailData: MailData, type: EmailType, data: any): Promise<any> {
		switch (type) {
			case EmailType.EMAIL_VERIFICATION:
				return this.sendMail({
					to: mailData.to,
					cc: mailData.cc,
					bcc: mailData.bcc,
					from: { email: "hali@epik.io", name: "Zinlab" },
					subject: "Please Verify Your Email",
					html: `<p>Please use following code to verify your email address</p></br><h1>${data}</h1>`,
				});
			case EmailType.PASSWORD_RECOVERY:
				return this.sendMail({
					to: mailData.to,
					cc: mailData.cc,
					bcc: mailData.bcc,
					from: { email: "hali@epik.io", name: "Zinlab" },
					subject: "Request to Recover Password",
					html: `<p>Please use following code to verify your email address</p></br><h1>${data}</h1>`,
				});
			default:
				throw new NotImplementedException(`Template for ${type} type of emial is not configured in code base. Please implement those first`);
		}
	}
}
