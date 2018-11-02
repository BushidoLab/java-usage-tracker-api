import { errorHandler } from "../errors/errorHandler";
import { User } from "../db/models/User";
import { management } from '../db/models/Management';
const nodemailer = require('nodemailer');
// require('dotenv').config();
let sentEmail;
let productsArr = [];

export class MailerService {
  static async sendMail(email) {
    // let manageForms:Array<any> = await management.find();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'veratrustinfo@gmail.com', // Change to env vars
        pass: 'bushidolab2018'
      }
    });
    
    const mailOptions = {
      from: 'veratrustinfo@gmail.com',
      to: email,
      subject: 'Your support period expires in 7 days',
      html: `
      <p>Your support for ${productsArr} is about to end</p>
      `
    }

    this.checkSupport();
    if (productsArr.length > 0) {
      if (!sentEmail) {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err)
          console.log(err)
          else 
          console.log(info);
          sentEmail = true;
        });
      }
    }
  }

  static async getEmail({ email }) {
    try {
      const userEmail = await User.findOne({ email });
      this.sendMail(email); // remove after testing
      return userEmail;
    } catch (error) {
      throw errorHandler('CreateEmailError', {
        message: 'There was an error retreiving the users email',
        data: error.response.data.error
      });
    }
  }

  static async checkSupport() {
    let manageForms:Array<any> = await management.find();
    manageForms.forEach(form => {
      if (form.productSupportFee > 0) {
        let expireDate = new Date(form.supportDate).getTime() + 31540000000
        if (expireDate - Date.now() < 604800000) {
          productsArr.push(form.license);
        }
      }
    })
    return productsArr;
  }
}