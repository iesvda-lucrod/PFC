import { useState } from "react";

const ENDPOINT_URL = 'http://localhost/PFC/backend/database/';
export default function useDatabase(resource, token = null) {
    const [ isLoading, setIsLoading ] = useState(false);
    const FINAL_URL= ENDPOINT_URL+resource;

    const requestResource = async(reqMethod = 'GET', reqBody = null, queryParameters = '') => {
        console.log("MAKING A REQUEST: \n\tURL: ", FINAL_URL+'?'+queryParameters, "\n\tMETHOD: ", reqMethod, "\n\tBODY: ", reqBody, '\n\ttoken', token?true:false);
        setIsLoading(true);

        let response = await fetch(FINAL_URL+'?'+queryParameters,
            {
                method: reqMethod,
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? {Authorization: `Bearer ${token}`} : {})
                },
                ...(reqBody !== null? {body: JSON.stringify(reqBody)}: {})
            }
        );

        if (!response.ok) {
            let error = await response.json();
            console.error("Call to ",FINAL_URL+'?'+queryParameters,"response: \n", error);
            if (response.status >= 500) {
                throw new Error('There was an error in the server, please try again later');
            }
            if (response.status === 401) {
                throw new Error("Authentication error: "+error.message);
            }
            throw new Error(error.message);
        }
        let data = await response.json();
        console.log("Call to ",FINAL_URL+'?'+queryParameters,"response: \n",data);
        setIsLoading(false);
        return data;
    }

    const get = async (filters = {}) => {
        let queryParameters = queryParamsBuilder(filters);
        let result =  await requestResource('GET', null, queryParameters);
        return result;
    }
    const post = async (data) => {
       return await requestResource('POST', data);
    }
    const remove = async(data) => {
        return await requestResource('DELETE', data);
    }
    const put = async (data) => {
        return await requestResource('PUT', data);
    }

    return {model:{get, post, delete:remove, put}, isLoading};
}

const queryParamsBuilder = (params) => {
    //params is an object containing key => value or key => array[values]
    //console.log('BUILDING PARAMS FROM:', params);
    let query = '';
    Object.entries(params).forEach(([key, values]) => {
        //console.log(key, values, (typeof values));
        if (!(Array.isArray(values))){
            if (values.toString() !== '') {
                query += `&${key}=${values}`;    
            }
        } else {
            values.forEach(element => {
                query += `&${key}[]=${element}`;
            });
        }
    });
    //console.log('Built query', query);
    return query;
}