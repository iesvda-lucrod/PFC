const BASE_URL = 'http://localhost/PFC/backend/database/';
export default function useDatabase(endpointURL) {
    const ENDPOINT_URL = BASE_URL + endpointURL;


}

import { useState, useEffect, useCallback } from 'react';

const useDatabaseModel = (endpointURL) => {
    const ENDPOINT_URL = BASE_URL + endpointURL;
    const [token, setToken] = useState('');

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
        setToken(userInfo.JWT || '');
    }, []);

    const makeRequest = useCallback(async (method = 'GET', queryParams = '', reqBody = null) => {
        console.log(`Making ${method} request to: ${ENDPOINT_URL}?${queryParams} Payload:`, reqBody);
        
        const response = await fetch(`${ENDPOINT_URL}?${queryParams}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            mode: 'cors',
            ...(reqBody !== null ? { body: JSON.stringify(reqBody) } : {})
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`Error when fetching resource ${response.status} ${err.error}`);
        }

        const result = await response.json();
        console.log('Request result:', result);
        return result;
        
    }, [ENDPOINT_URL, token]);

    const get = useCallback(async (data) => {
        const queryParameters = queryParamsFromObject(data);
        return await makeRequest('GET', queryParameters);
    }, [makeRequest]);

    const post = useCallback(async (data, queryParams = '') => {
        return await makeRequest('POST', queryParams, data);
    }, [makeRequest]);

    const put = useCallback(async (data, queryParams = '') => {
        return await makeRequest('PUT', queryParams, data);
    }, [makeRequest]);

    const del = useCallback(async (data, queryParams = '') => {
        return await makeRequest('DELETE', queryParams, data);
    }, [makeRequest]);

    const queryParamsFromObject = (object) => {
        return Object.entries(object).map(([key, value]) =>
            Array.isArray(value)
                ? value.map(single => `&${key}[]=${single}`).join('')
                : `&${key}=${value}`
        ).join('');
    };

    return { get, post, put, del };
};