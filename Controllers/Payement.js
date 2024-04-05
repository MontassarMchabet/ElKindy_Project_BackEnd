const { default: axios } = require("axios")



module.exports={
    Add: async (req, res) => {
        const url = "https://developers.flouci.com/api/generate_payment"
        const payload = {
            "app_token": "81e79f60-9241-470c-93d5-686463b9b946", 
            "app_secret": "dcef4bb9-43ed-4b2f-9f69-29e32da07dc1",
            "amount": req.body.amount,
            "accept_card": "true",
            "session_timeout_secs": 1200,
            "success_link": "http://localhost:3001/success",
            "fail_link": "http://localhost:3001/fail",
            "developer_tracking_id": "d05d34b1-4fdd-4d45-b234-6845bcee0a1d"
        }
       await axios
        .post(url, payload)
        .then(result => {
            res.send(result.data)
        })
        .catch(err => console.error(err));
    },
    Verify: async (req, res) => {
        const id_payement = req.params.id
        await axios
        .get(`https://developers.flouci.com/api/verify_payment/${id_payement}`, {
            headers: {
                'Content-Type': 'application/json',
                'apppublic': "81e79f60-9241-470c-93d5-686463b9b946",
                'appsecret': "dcef4bb9-43ed-4b2f-9f69-29e32da07dc1"
              }
            })
        .then(result => {
            res.send(result.data)
        })
        .catch(err => console.log(err.message));
        
    }
}