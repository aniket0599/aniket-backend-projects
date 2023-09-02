const {default: axios} = require('axios');

function newsApi(url) {
    return new Promise((resolve, reject) => {
        axios.get(url).then(res => {
            return resolve(res.data);
        }).catch(err => {
            return reject(err);
        });
    });
}

module.exports = {newsApi}