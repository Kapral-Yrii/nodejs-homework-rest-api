import Mailgen from 'mailgen'

const getLink = (env) => {
    let link
    switch (env) {
        case 'development':
            link = 'http://localhost:3000/'
            break
        case 'test':
            link = 'http://localhost:5000/'
            break
        case 'production':
            link = 'http://heroku/'
            break
        default:
            link = 'http://localhost:3000/'
    }
    return link
}

class EmailService { 
    constructor(env, sender) {
        this.sender = sender
        this.link = getLink(env)
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