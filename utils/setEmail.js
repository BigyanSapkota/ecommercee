const nodemailer=require('nodemailer')
const { options } = require('../routes/categoryRoute')

const sentEmail=options=>{
    const transport = nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT ,
        auth: {
          user:process.env.SMPT_USER,
          pass:process.env.SMPT_PASS
        }
      }); 

      const mailOptions={
        from:options.from,
        to:options.to,
        subject:options.subject,
        text:options.text,
        html:options.html
      }
      transport.sendMail(mailOptions)
}

module.exports=sentEmail