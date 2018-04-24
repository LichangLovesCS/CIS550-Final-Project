module.exports = {
    'facebookAuth' : {
        'clientID'      : '1984894625096320', // your App ID
        'clientSecret'  : 'a772f5aca1d65e84be2b9332da29e805', // your App Secret
        'callbackURL'   : 'https://localhost:9000/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },
};