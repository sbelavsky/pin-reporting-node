const host = 'https://pinadminservice.awsqa.idt.net/PinAdmin',
    path = (token) => `/api/v1/User/CheckToken?token=${token}`;

module.exports.buildUserInfoUrl = (token) => {
    return host + path(token);
}