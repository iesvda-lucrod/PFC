import { InvalidTokenError } from "../classes/Errors"; 

const baseUrl = 'http://localhost/PFC/backend/database/';
export default function useDatabase(endpointURL, token) {
    const FINAL_URL = baseUrl+endpointURL;

    const makeRequest = async (method = 'GET', reqBody = null, queryParams = '') => {
        console.log("Making ",method," request to: ", FINAL_URL+'?'+queryParams, "Payload:", reqBody);

        let response = await fetch(FINAL_URL+'?'+queryParams,
            {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer '+token
                },
                mode: "cors",
                ...(reqBody !== null ? { body: JSON.stringify(reqBody) } : {})
            }
        );
        
        if (!response.ok) {
            let err = await response.json();
            
            throw new Error('Error when fetching resource '+response.status+' '+err.error);
        }

        let result = await response.json();
        console.log("Request result:",result);
        return result;
    }

    const get = async (data) => {
        let queryParameters = queryParamsFromObject(data);
        return await makeRequest('GET', null, queryParameters)
    }
    const post = async (data) => {return await makeRequest('POST', data);}
    const remove = async (data) => {return await makeRequest('DELETE', data);}
    const put = async (data) => {return await makeRequest('PUT', data);}

    return {get, post, delete:remove, put};
}

/**
 * Formats an object's entries into a string to place as url params
 * @param {Object} object 
 * @returns 
 */
function queryParamsFromObject(object) {
    let queryString = '';
    Object.entries(object).forEach(([key, value]) => {
        if (Array.isArray(value)) {
        value.forEach((single) => {queryString += '&'+key+'[]='+single;});
        } else {queryString += '&'+key+'='+value;}
    });
    return queryString;
}




/*
export default class DatabaseModel {
    baseUrl = 'http://localhost/PFC/backend/database/';
    token = '';
    constructor(endpointURL) {
        this.ENDPOINT_URL = this.baseUrl+endpointURL;
        
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        this.token = userInfo.JWT || '';
    }

    async makeRequest(method = 'GET', queryParams = '', reqBody = null) {
        console.log("Making ",method," request to: ", this.ENDPOINT_URL+'?'+queryParams, "Payload:", reqBody);

        let response = await fetch(this.ENDPOINT_URL+'?'+queryParams,
            {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer '+this.token
                },
                mode: "cors",
                ...(reqBody !== null ? { body: JSON.stringify(reqBody) } : {})
            }
        );
        
        if (!response.ok) {
            let err = await response.json();
            
            throw new Error('Error when fetching resource '+response.status+' '+err.error);
        }

        let result = await response.json();
        console.log("Request result:",result);
        return result;
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

    queryParamsFromObject(object) {
        let queryString = '';
        Object.entries(object).forEach(([key, value]) => {
            if (Array.isArray(value)) {
            value.forEach((single) => {queryString += '&'+key+'[]='+single;});
            } else {queryString += '&'+key+'='+value;}
        });
        return queryString;
    }
    
}*/