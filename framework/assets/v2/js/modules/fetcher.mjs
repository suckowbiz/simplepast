"use strict";

export default class Fetcher {
    static async fetchJSONFile(file = '') {
        return await this.fetchFile(file)
            .then(resp => {
                return resp.json();
            })
            .catch(reason => {
                throw new Error(reason);
            })
    }

    static async fetchTextFile(file = '') {
        return await this.fetchFile(file)
            .then(resp => {
                return resp.text();
            })
            .catch(reason => {
                throw new Error(reason);
            })
    }

    static async fetchFile(file = '') {
        return await fetch(file, { cache: "no-store" })
            .then(response => {
                if (response.ok) {
                    return response;
                }
                throw new Error(response.statusText);
            })
            .catch(error => {
                throw new Error(error);
            })
    }
}
