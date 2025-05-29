import { useState } from "react";
import { ENDPOINT_URL } from "./globalVariables";
import { useNavigate } from "react-router-dom";

export default function useFetch(resource, authToken = null) {
    const [ isLoading, setIsLoading ] = useState(false);
    
    const FINAL_URL= ENDPOINT_URL+resource;

    const requestResource = async(reqMethod, data = null, token = authToken, contentType = 'application/json') => {
        const queryParameters = reqMethod === 'GET' ? queryParamsBuilder(data) : '';
        const reqBody = (reqMethod === 'GET' ? null : (contentType === 'application/json' ? JSON.stringify(data) : data)); 
        
        console.log("MAKING A REQUEST: \n\tURL: ", FINAL_URL+'?'+queryParameters, "\n\tMETHOD: ", reqMethod, "\n\tBODY: ", reqBody, "\n\tCONTENT-TYPE", contentType, '\n\tTOKEN:', token);
        setIsLoading(true);

        let response = await fetch(FINAL_URL+'?'+queryParameters,
            {
                method: reqMethod,
                mode: "cors",
                headers: {
                    // "Content-Type":contentType,
                    ...(contentType === 'application/json' ? {"Content-Type": contentType} : {}),
                    ...(token ? {Authorization: `Bearer ${token}`} : {})
                },
                ...(reqBody !== null ? {body: reqBody}: {})
            }
        );

        if (!response.ok) {
            let error = await response.json();
            console.error("Call to ",FINAL_URL+'?'+queryParameters,"response: \n", error);
            if (response.status >= 500) {
                console.log(error);
                alert(error.message+"\n\nAn unexpected error ocurred, please reload the page and try again later\n");
                throw new Error('There was an error in the server, please try again later');
            }
            if (response.status === 401) {
                alert('Session expired');
                window.location.reload();
                throw new Error("Authentication error: "+error.message);
            }
            throw new Error(error.message);
        }
        let responseData = await response.json();
        console.log("Call to ",FINAL_URL+'?'+queryParameters,"response: \n",responseData);
        setIsLoading(false);
        return responseData;
    }

    const get = async (filters = {}, token = authToken) => {
        let result =  await requestResource('GET', filters, token);
        return result;
    }
    const post = async (data, token = authToken) => {
       return await requestResource('POST', data, token);
    }
    const remove = async(data, token = authToken) => {
        return await requestResource('DELETE', data, token);
    }
    const put = async (data, token = authToken) => {
        return await requestResource('PUT', data, token);
    }

    return {model:{get, post, delete:remove, put}, isLoading, requestResource};
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