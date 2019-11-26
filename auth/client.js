const fetch = require('node-fetch');
const { buildUserInfoUrl } = require('./config');

const checkToken = async (token) => {
    const url = buildUserInfoUrl(token);

    const response = await fetch(url);
    if (response.ok) {
        const json = await response.json();
        if (json.status !== 200) {
            throw Error(`Unauthorized [${token}]`);
        }
    } else {
        throw Error('Authorization service error');
    }
}

module.exports.checkToken = checkToken;
