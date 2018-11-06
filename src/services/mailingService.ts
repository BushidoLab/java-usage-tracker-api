import { errorHandler } from "../errors/errorHandler";
import { User } from "../db/models/User";
const nodemailer = require('nodemailer');
// require('dotenv').config();

let sentEmail;
let productsArr = [];


export class MailerService {
  static async sendMail(manageForm) {
    this.checkSupport(manageForm);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'veratrustinfo@gmail.com', // Change to env vars
        pass: 'bushidolab2018'
      }
    });
    
    const mailOptions = {
      from: 'veratrustinfo@gmail.com',
      to: manageForm.user,
      subject: 'Your support period expires in 7 days',
      html: `
      <img src="../assets/veratrust.png"></img>
      <p>Your support for ${productsArr} is about to end</p>
      <br>
      <p>Please contact your service administrator to extend your support</p>
      `
    }

    if (productsArr.length > 0) {
      if (!sentEmail) {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err)
          console.log(err)
          else 
          console.log(info);
          sentEmail = true; // Set email to false when cronjob runs
        });
      }
    }
  }

  static async getEmail(manageForm) {
    try {
      const userEmail = await User.findOne({ email: manageForm.user });
      return userEmail;
    } catch (error) {
      throw errorHandler('CreateEmailError', {
        message: 'There was an error retreiving the users email',
        data: error.response.data.error
      });
    }
  }

  static async checkSupport(form) {
    if (form.productSupportFee > 0) {
      let expireDate = new Date(form.supportDate).getTime() + 31540000000
      if (expireDate - Date.now() < 604800000 && expireDate - Date.now() > 0) {
        productsArr.push(form.license);
      }
    }
    return productsArr;
  }
}