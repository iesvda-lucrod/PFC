import { createContext } from "react";

export default class MainModel {
    
    ENDPOINT_URL = "https://localhost/PFC/serverUtils/DBAccess/api.php";
    table;
    data;

    constructor(table) {
        this.table = '?table='+table;
        this.data = {};
    }

    /**
     * Intakes a js object and returns a string to pass as filters in a GET request
     * @param {*} data 
     * @returns 
     */
    queryParamsBuilder(data) {
        let queryParams = '';
        Object.entries(data).forEach(([key, value]) => {
            queryParams += '&fieldName='+key+'&fieldValue='+value;
        });
        console.log(queryParams);
        return queryParams;
    }

    ///////
    //GET//
    ///////
    async getAll() {
        let response = await fetch(this.ENDPOINT_URL+this.table, 
            {
                method: 'GET',
                headers: {"Content-Type": "application/json",}
            }
        );

        if (!response.ok) {
            let err = await response.json();
            throw new Error(err.message);
        }
        let jsonResponse = await response.json();
        return jsonResponse;
    }

    async getById(id) {
        let args = this.queryParamsBuilder({id: id}); //returns &fieldName=id&fieldValue=(argument id's value)

        let response = await fetch(this.ENDPOINT_URL+this.table+args, 
            {
                method: 'GET',
                headers: {"Content-Type": "application/json",}
            }
        );

        if (!response.ok) {
            let err = await response.json();
            throw new Error(err.message);
        }
        let jsonResponse = await response.json();
        return jsonResponse;
    }

    //Needs an object
    async getByField(field) {
        console.log("GET BY FIELD");
        let args = this.queryParamsBuilder(field); 

        console.log("PETITION", this.ENDPOINT_URL+this.table+args);

        let response = await fetch(this.ENDPOINT_URL+this.table+args, 
            {
                method: 'GET',
                headers: {"Content-Type": "application/json",}
            }
        );

        if (!response.ok) {
            let err = await response.json();
            throw new Error(err.message);
        }
        let jsonResponse = await response.json();
        return jsonResponse;
    }

    async getWithFilters(filters) {
        let args = this.queryParamsBuilder(filters); 

        let response = await fetch(this.ENDPOINT_URL+this.table+args, 
            {
                method: 'GET',
                headers: {"Content-Type": "application/json",},
            }
        );

        if (!response.ok) {
            let err = await response.json();
            throw new Error(err.message);
        }
        let jsonResponse = await response.json();
        return jsonResponse;
    }

    ////////
    //POST//
    ////////
    async insert(data) {
        

        console.log('INSERTING:', data);
        let response = await fetch(this.ENDPOINT_URL+this.table,
            {
                method: 'POST',
                headers: {"Content-Type": "application/json",},
                body: JSON.stringify(data),
            }
        );
        console.log("response:",response);

        if (!response.ok) {
            let err = await response.json();
            throw new Error(err.message);
        }
        let jsonResponse = await response.json();
        return jsonResponse;
    }


    async delete(id) {
        console.log('DELETING:', id);
        let response = await fetch(this.ENDPOINT_URL+this.table,
            {
                method: 'DELETE',
                headers: {"Content-Type": "application/json",},
                body: {
                    id
                }
            }
        );

        if (!response.ok) {
            let err = await response.json();
            throw new Error(err.message);
        }
        let jsonResponse = await response.json();
        return jsonResponse;
    }

    /**
     * Intakes an object, separated the id field from the rest, updates the row with matching id with the rest of the values
     * @param {*} data 
     * @returns 
     */
    async update(data) {
        console.log("UPDATING:", data);
        let target = data.id;
        delete data.id;

        let response = await fetch(this.ENDPOINT_URL+this.table,
            {
                method: 'PUT',
                headers: {"Content-Type": "application/json",},
                body: {
                    id: target,
                    newValues: {
                        data,
                    }
                }
            }
        );

        if (!response.ok) {
            let err = await response.json();
            throw new Error(err.message);
        }
        let jsonResponse = await response.json();
        return jsonResponse;
    }
}
