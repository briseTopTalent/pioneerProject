'use strict';
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const MAILGUN_API_KEY='key-a2e45c2ea9c863aaf63309eaac4a7ede';
const MAILGUN_DOMAIN='nycfirewireapp.com';

const shouldMock = ['1','true',true].includes(process.env.MOCK_MAILGUN);
const mailgunDomain = process.env.MAILGUN_DOMAIN || MAILGUN_DOMAIN;
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY || MAILGUN_API_KEY,
});

module.exports = class Email {
  static async sendEmail(to, subject, message) {
    if(shouldMock){
      return {mocked: true};
    }
    return await mg.messages
      .create(mailgunDomain, {
        from: `Firewire ADMIN <donotreply@${mailgunDomain}>`,
        to: [to], //, 'phil@pioneerapplications.com'],
        subject: subject,
        text: message,
      }).catch((err) => {
        console.error(err);
        return err;
      }); // logs any error
  }

  static async sendHTML(to, subject, html) {
    if(shouldMock){
      return {mocked: true};
    }
    return await mg.messages
      .create(mailgunDomain, {
        from: `Firewire App <donotreply@${mailgunDomain}>`,
        to: [to], //, 'phil@pioneerapplications.com'],
        subject: subject,
        text: html,
        html: html,
      }).catch((err) => {
        console.error(err);
        return err;
      }); // logs any error
  }
};
