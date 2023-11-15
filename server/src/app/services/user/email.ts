const api_key: string ='key-a2e45c2ea9c863aaf63309eaac4a7ede';
const domain: string ='nycfirewireapp.com';
const mailgun:any = require('mailgun-js')({apiKey: api_key, domain: domain});

export function sendEmail(to, subject, message) {
  console.log('Sending Email...')
  var fromAddress = `Fire Wire App <noreply@${domain}>`

  var data = {
    from: fromAddress,
    to: to,
    subject: subject,
    text: message
  };

  mailgun.messages().send(data, function (error, body) {
    console.log('Email sent with error: ' + error);

    console.log(body);
  });
}
