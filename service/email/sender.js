import sgMail from '@sendgrid/mail'

class Sender { 
    async send(msg) {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        return await sgMail.send({ ...msg, from: process.env.SENDGRID_EMAIL_SEND})
    }
}

export default Sender