const {
  claim,
} = require('./lib/index.js');

if (process.env.ENV == "production") {
  exports.claim = claim
  return
}

// dev
claim({
  "receiver": "0x7Ad941fAf1227105624D3170e851Bb54FE88D558",
  "id": "id001",
  "username": "id001",
  "verified": true,
  "amount": "3001000000000000000000",
  "inviterId": "",
  "inviteAward": "2000000000000000000000",
  "sig": "0x965cb1cb9c50cb834341175ef1522608670c5bcec9f7a8565b8aeb8b8ad7507e7258b2b65c3403115431c74b226c909726ee96ffaebf474529fb2b7ff4339f6f00"
}, undefined, console.log)
