"use strict";

export default class Test {
    name
    want
    args
    constructor(name = '', args = undefined, want = undefined) {
        this.name = name
        this.args = args
        this.want = want
    }
}
