"use strict";

import Article from '../article.mjs';
import Image from '../image.mjs';
import Test from './test.mjs'

const imgJSON = JSON.parse('{ "images": [ { "name": "photo-1.jpg", "width": 1024, "height": 768 } ]}')

function testArticleImageContent() {
    class Args {
        images
        constructor(images = '') {
            this.images = images
        }
    }

    let image = new Image()
    image.setWidth(1024)
    image.setHeight(768)
    image.setName('/img/photo-1.jpg')
    image.setThumbName('/img/thumb/photo-1.jpg')

    let tests = [
        new Test("(testArticleImageContent) Verify image getters and setters", new Args(imgJSON.images), image),
    ]
    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];

        let article = new Article();
        article.setImages('', test.args.images);

        let iut = article.getImages()[i];
        let got = iut.getWidth();
        let err = false;
        if (got != image.getWidth()) {
            console.error("test: " + test.name + ", failed! got: " + got + ", want: " + image.getWidth())
            err = true;
        } 

        got = iut.getHeight();
        if (got != image.getHeight()) {
            console.error("test: " + test.name + ", failed! got: " + got + ", want: " + image.getHeight());
            err = true;
        }

        got = iut.getName();
        if (got != image.getName()) {
            console.error("test: " + test.name + ", failed! got: " + got + ", want: " + image.getName());
            err = true;
        }

        got = iut.getThumbName()
        if (got != image.getThumbName()) {
            console.error("test: " + test.name + ", failed! got: " + got + ", want: " + image.getThumbName());
            err = true;
        }

        if (!err) {
            console.log("test: " + test.name + " ... ok");
        }
    }
}

function testArticleImageCount() {
    class Args {
        images
        constructor(images = '') {
            this.images = images;
        }
    }

    let tests = [
        new Test("(testArticleImageCount) Verify images length equals 1", new Args(imgJSON.images), 1),
    ]
    for (let i = 0; i < tests.length; i++) {
        let test = tests[i];
        let article = new Article();
        article.setImages('', test.args.images);
        let got = article.getImages().length;
        if (got != test.want) {
            console.error("test: " + test.name + ", failed! got: " + got + ", want: " + test.want);
        } else {
            console.log("test: " + test.name + " ... ok");
        }
    }
}

testArticleImageCount();
testArticleImageContent();
