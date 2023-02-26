"use strict";

export default class Image {
    #name
    #thumbName
    #width
    #height
    setWidth(width = 0) { this.#width = width; }
    setHeight(height = 0) { this.#height = height; }
    setName(name = '') { this.#name = name; }
    setThumbName(name = '') { this.#thumbName = name; }
    getThumbName() { return this.#thumbName; }
    getWidth() { return this.#width; }
    getHeight() { return this.#height; }
    getName() { return this.#name; }
}
