'use strict';
const models = require('../../models');
const config = require('../../../config');
const mailgun = require('../../../utils/email');
const tokenizer = require('../../../utils/tokenizer');
const LoginAdmin = require('../auth/login');
const generate_email = url => {
  return `<h1>Reset your password</h1><br/>
    <a href="${url}">${url}</a>
  `;
};
const ForgotPw = async (email,force=false) => {
  try {
    email = String(email).toLowerCase();
    await LoginAdmin.copyBackupDBUserToThisDB(email);
    const SERVER_URL = config.SERVER_URL;
    let user = await models.User.findOne({ where: { email } });
    if (!user) {
      return { error: true, message: 'No user with that email' };
    }
    await global.redis.refresh_user(user.id);
    let reset_pw_before = user.reset_pw_before;
    if(!force && reset_pw_before !== null && !isNaN(parseInt(reset_pw_before,10))){
      let limit = parseInt(reset_pw_before,10);
      let now = (Date.now()/1000);
      if(now < limit){
        console.debug(`*** Rate limit for email: "${email}" (${user.id}) ***`);
        return {error: true,message: 'rate-limited'};
      }
    }
    const reset_pw_hash = tokenizer(user);
    
    user.reset_pw_hash = reset_pw_hash;
    user.reset_pw_before = (Date.now()/1000) + 60 * 60 * 24;
    await user.save();
    let url = `https://${SERVER_URL}/auth/forgot-password?h=${reset_pw_hash}`;
    const html = generate_email(url);
    let mg_response = await mailgun.sendHTML(user.email, `Reset your password`, html);
    return {
      error: false,
      data: {
        url,
        html,
      },
      message: 'success',
      mg_response,
    };
  } catch (err) {
    console.error(`Reset password failed with:`,err);
    return {
      error: true,
      data: {
        url: null,
        html: '',
      },
      message: 'Unable to reset password',
    };
  }
};

module.exports = ForgotPw;
