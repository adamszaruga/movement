const accountSid = 'AC32b884741733d6776eecfdd1d9da589d';
const authToken = 'a83cd1724599f7281b17a305bc5bcb02';
const client = require('twilio')(accountSid, authToken);


module.exports = async (message) => {
    console.log(`texting ${message}`)
    client.messages.create({
        body: message || 'oops, no message! check textAdams.js. Nicole wants something, though...',
        to: '+14045838262',  // Text this number
        from: '+19378864075' // From a valid Twilio number
    }).catch(err => {
        console.log(err)
    })
}

