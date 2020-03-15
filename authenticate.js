function auth(req, res, next){
    console.log('Authentcating...');
    next();
}

module.exports = auth;