
const config = require('config');
const currencyConversionURL = config.get('app.currencyConversionURL');
const request = require('request');

const currencyConverter = function() {
    function convert(amount, currency) {
        return new Promise((resolve, reject) => {
            request(currencyConversionURL + '?from=EUR&to=' + currency + '&amount=' + amount, (error, response, body) => {
                if (error) reject(error);
                if (response.statusCode != 200) {
                    reject('Invalid status code <' + response.statusCode + '>');
                }
                resolve((JSON.parse(body)).result);
            });
        });
    }
    
    return {
        convert: convert
    }
}

module.exports = currencyConverter();