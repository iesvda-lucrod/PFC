export default class DatabaseModel {
    baseUrl = 'http://localhost/PFC/backend/database/';
    constructor(endpointURL) {
        this.ENDPOINT_URL = this.baseUrl+endpointURL;
    }

    async makeRequest(method = 'GET', queryParams = '', reqBody = null) {
        console.log("Making ",method," request to: ", this.ENDPOINT_URL+'?'+queryParams, "Payload:", reqBody);
        try {
            let response = await fetch(this.ENDPOINT_URL+'?'+queryParams,
                {
                    method: method,
                    headers: {"Content-Type": "application/json"},
                    mode: "cors",
                    ...(reqBody !== null ? { body: JSON.stringify(reqBody) } : {})
                }
            );
            if (!response.ok) {
                let err = await response.json();
                throw new Error('Error when fetching resource: '+err.message);
            }
    
            let result = await response.json();
            console.log("Request result:",result);
            return result;
        } catch (error) {
            throw error;   
        }
    }

    async get(data) {
        let queryParameters = this.queryParamsFromObject(data);
        return await this.makeRequest('GET', queryParameters);
    }
    async post(data, queryParams = '') {
        return await this.makeRequest('POST', queryParams, data);
    }
    async delete(data, queryParams = '') {
        return await this.makeRequest('DELETE', queryParams, data);
    }
    async put(data, queryParams = '') {
        return await this.makeRequest('PUT', queryParams, data);
    }

    /**
     * Formats an object's entries into a string to place as url params
     * @param {Object} object 
     * @returns 
     */
    queryParamsFromObject(object) {
        let queryString = '';
        Object.entries(object).forEach(([key, value]) => {
            if (Array.isArray(value)) {
            value.forEach((single) => {queryString += '&'+key+'[]='+single;});
            } else {queryString += '&'+key+'='+value;}
        });
        return queryString;
    }
}