"use strict";

import Image from './image.mjs'

export default class Article {
    #id;
    #date;
    #year;
    #heading;
    #images = [];
    #vidURLs = [];
    #content;
    constructor(year = 0, id = 0) {
        this.#year = year
        this.#id = id
    }
    getId() { return this.#id }
    setId(id = 0) { this.#id = id }
    getContent() { return this.#content }
    setContent(content = '') { this.#content = content }
    getDate() { return this.#date }
    setDate(date = '') { this.#date = date }
    getHeading() { return this.#heading }
    setHeading(heading = '') { this.#heading = heading }
    getImages() { return this.#images }
    setImages(path = '', images = []) {
        for (let i = 0; i < images.length; i++) {
            let jsonImg = images[i]

            let img = new Image();
            img.setHeight(jsonImg.height);
            img.setWidth(jsonImg.width);
            img.setName(path + '/img/' + jsonImg.name);
            img.setThumbName(path + '/img/thumb/' + jsonImg.name);

            this.#images.push(img);
        }
    }
    getVidURLs() { return this.#vidURLs }
    setVidURLs(path = '', urls = []) {
        for (let i = 0; i < urls.length; i++) {
            this.#vidURLs.push(path + '/' + urls[i]);
        }
    }
    getYear() { return this.#year; }
    setYear(year = 0) { this.#year = year; }
}
