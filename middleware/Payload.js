//Payload method to check if request body is empty
function payload (req, res, next) {
    if(Object.keys(req.body).length !== 0 || Object.keys(req.query).length !== 0){
        res.status(400).send();       
    }
    if(req.headers && req.headers["content-length"] > 0){
        res.status(400).send();
    }
    if(req.url.includes('?')){
         res.status(400).send();
    }
    next();
}

module.exports = payload;