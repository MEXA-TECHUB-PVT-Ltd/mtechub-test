// urls.js
const ApiUrl='http://localhost:3000'
const ApiUrl_Admin='http://localhost:3002'


// const baseUrl='https://64f08b5d1f93a1121bb51a0f--venerable-syrniki-24ae89.netlify.app'


const urls = {
    email_verification_url: `${ApiUrl}/verifyEmail`,
    login_url: `${ApiUrl}/login`,
    login_url_admin: `${ApiUrl_Admin}/login`,

    

    // Add more URLs here if needed
  };
  
  module.exports = urls;

