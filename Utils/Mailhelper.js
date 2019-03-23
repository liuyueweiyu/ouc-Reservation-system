const config = {
    host: 'stu.ouc.edu.cn',
    port: 25,
    auth: {
        user: 'itstudio@stu.ouc.edu.cn',
        pass: ''
    }
};
const nodemailer = require('nodemailer');
function sendMail(mailOptions) {
    const transport = nodemailer.createTransport(config);
    return new Promise((resolve, reject) => {
        transport.sendMail(mailOptions, function (err, res) {
            if (err) reject(err);
            else resolve(res);
        })
    })
}

function sendMails(mailOptions,spacings) {
    const transport = nodemailer.createTransport(config);
    return Promise.all(mailOptions.map((v, i) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                transport.sendMail(v, function (err, res) {
                    if (err) reject(err);
                    else resolve(data);
                })
            }, spacings[i]);
        })
    }))
}

module.exports = {
    sendMail,
    sendMails
}



