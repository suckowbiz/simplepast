"use strict";

export default class Fetcher {
    static async fetchJSONFile(file = '') {
        return await this.fetchFile(file)
            .then(function (resp) {
                if (resp) {
                    return resp.json();
                }
                return undefined;
            })
            .catch(reason => {
                throw reason;
            })
    }

    static async fetchTextFile(file = '') {
        return await this.fetchFile(file)
            .then(function (resp) {
                if (resp) {
                    return resp.text();
                }
                return undefined;
            })
            .catch(reason => {
                throw reason;
            })
    }

    static async fetchFile(file = '') {
        return await fetch(file, { cache: "no-store" })
            .then(function (response) {
                if (response.ok) {
                    return response;
                }
                return undefined;
            })
            .catch(error => {
                throw new Error(error);
            })
    }
}
