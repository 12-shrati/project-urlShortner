const urlModel = require("../model/urlModel")
var validUrl = require('valid-url');
const shortid = require('shortid')



let isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}



const baseUrl = ' http://localhost:3000'


let createUrl = async function (req, res) {
    try {
        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Enter valid Parameters" })
        }

        if (validUrl.isUri(baseUrl)) {
            return res.status(400).send({ status: false, message: "Invalid base URL" })
        }
        const urlCode = shortid.generate()

        const { longUrl } = requestBody

        if (!longUrl) { return res.status(400).send({ status: false, message: "LongUrl required" }) }

        let lUrl = await urlModel.findOne({ longUrl })
        if (lUrl) {
            return res.status(200).send({ status: true, data: lUrl })
        }
        const shortUrl = baseUrl + '/' + urlCode

        lUrl = {
            longUrl,
            shortUrl,
            urlCode
        }

        let data = await urlModel.create(lUrl)
        return res.status(201).send({ status: true, data: data })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.createUrl=createUrl























