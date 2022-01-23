import Mailgen from 'mailgen'

const link = (env) => {
    switch (env) {
        case 'development':
            return 'http://localhost:3000/'
            break
        case 'test':
            return 'http://localhost:5000/'
            break
        case 'production':
            return 'http://heroku/'
            break
        default:
            return 'http://localhost:3000/'
    }
}

class EmailService { 
    constructor(env, sender) {
        this.sender = sender
        this.link = link(env)
    }

    createEmailTemplate(userName, verifyToken) {
        const mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                name: 'Mailgen',
                link: this.link
            }
        })

        const email = {
            body: {
                name: userName,
                intro: "Welcome! We're very excited to have you on board.",
                action: {
                    instructions: 'To get started with our API, please click here:',
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your account',
                        link: `${this.link}api/users/verify/${verifyToken}`,
                    }
                },
                outro: "Need help, or have questions? Just reply to this email, we'd love to help."
            }
        }
        return mailGenerator.generate(email)
    }

    async sendVerifyEmail(email, userName, verifyToken) {
        const emailBody = this.createEmailTemplate(userName, verifyToken)
        const msg = {
            to: email,
            subject: 'Verify email',
            html: emailBody
        }
        try {
            const result = await this.sender.send(msg)
            console.log(result );
            return true
        } catch (error) {
            console.error(error.message)
        }
    }
}

export default EmailService