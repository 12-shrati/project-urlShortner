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

        if (!(/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/.test(longUrl))) {
            return res.status(400).send({ status: false, message: "Invalid LongURL" }) 
        }
        if (!(/^\S*$/.test(longUrl))) {
            return res.status(400).send({ status: false, message: "Not a valid LongURL" }) 
        }
        let lgUrl = await urlModel.findOne({ longUrl })
        if (lgUrl) {
            return res.status(200).send({ status: true, data: { longUrl: lgUrl.longUrl, shortUrl: lgUrl.shortUrl, urlCode: lgUrl.urlCode } })
        }
        const shortUrl = baseUrl + '/' + urlCode

        let urlData = {
            longUrl,
            shortUrl,
            urlCode
        }

        let data = await urlModel.create(urlData)
        return res.status(201).send({ status: true, data: { longUrl: data.longUrl, shortUrl: data.shortUrl, urlCode: data.urlCode } })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



let getOriginalUrl = async function (req, res) {
    try {

        let urlCode = req.params.urlCode

        if (!urlCode) { return res.status(400).send({ status: false, message: "urlCode Required" }) }

        let findUrlCode = await urlModel.findOne({ urlCode })
        if (!findUrlCode) { return res.status(400).send({ status: false, message: "urlCode not found" }) }


        return res.redirect(findUrlCode.longUrl)
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createUrl = createUrl
module.exports.getOriginalUrl = getOriginalUrl























