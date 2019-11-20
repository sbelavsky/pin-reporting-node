const AWS = require('aws-sdk'),
    region = "us-east-1",
    secretName = "dev/debitdb";

const client = new AWS.SecretsManager({
    region: region
});

module.exports.fetchDBConfig = async () => {
    let config = {};
    try {
        const data = await client.getSecretValue({ SecretId: secretName }).promise();
        const secret = JSON.parse(data.SecretString);
        const { username: user, password, host, dbInstanceIdentifier } = secret;

        config["user"] = user;
        config["password"] = password;
        config["connectString"] = host + "/" + dbInstanceIdentifier;
        
    } catch (err) {
        console.error(err.message);
        throw err;
    }
    return config;
};