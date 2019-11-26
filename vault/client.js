const aws4 = require('aws4');
const nv = require('node-vault');
const { role, endpoint, secret, serverId } = require('./config');

const vault = nv({
    apiVersion: 'v1',
    endpoint: endpoint,
});

vault.generateFunction('awsIamLogin', {
    method: 'POST',
    path: '/auth/aws/login',
});

const fetchSecretFromVault = async () => {

    const postBody = getSignedAwsLoginBody();
    const authResult = await vault.awsIamLogin(postBody);

    // eslint-disable-next-line require-atomic-updates
    vault.token = authResult.auth.client_token;
    return vault.read(secret);
}

function getSignedAwsLoginBody() {
    var body = 'Action=GetCallerIdentity&Version=2011-06-15';
    var url = 'https://sts.amazonaws.com/';
    var signedRequest;

    signedRequest = aws4.sign({ service: 'sts', body: body, headers: { 'X-Vault-AWS-IAM-Server-ID': serverId } });

    var headers = signedRequest.headers;
    var header;
    for (header in headers) {
        if (typeof headers[header] === 'number') {
            headers[header] = headers[header].toString()
        }
        headers[header] = [headers[header]]
    }
    return {
        role: role,
        iam_http_request_method: 'POST',
        iam_request_url: Buffer.from(url).toString('base64'),
        iam_request_body: Buffer.from(body).toString('base64'),
        iam_request_headers: Buffer.from(JSON.stringify(headers)).toString('base64')
    }
}

module.exports = fetchSecretFromVault().then(response => {
    let data = response.data.data;
    let { user, password, connectString } = data;
    return {
        user: user,
        password: password,
        connectString: connectString
    }
})
