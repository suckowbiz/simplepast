"use strict";

import Fetcher from './fetcher.mjs'
import Article from './article.mjs'
import PhotoSwipeLightbox from 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.4/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from 'https://cdnjs.cloudflare.com/ajax/libs/photoswipe/5.3.4/photoswipe.esm.min.js';

export default class BrowserDisplay {
    static disableNextBtns() {
        this.#setNextBtnsDisabled(true);
    }
    static enableNextBtns() {
        this.#setNextBtnsDisabled();
    }
    static #setNextBtnsDisabled(disability = false) {
        document.getElementById('more-btn').disabled = disability
        document.getElementById('all-btn').disabled = disability
    }
    static hideNextBtns() {
        document.getElementById('more-btn').style.visibility = 'hidden'
        document.getElementById('all-btn').style.visibility = 'hidden'
    }
    static getArticleCount() {
        let res = undefined
        const articles = document.getElementsByTagName('article');
        if (articles) {
            res = articles.length;
        }
        return res
    }
    static getYear = function () {
        var year = new URLSearchParams(window.location.search).get("year");
        if (!year) {
            year = new Date().getFullYear();
        }
        return year
    }
    static async renderTemplates() {
        var templates = document.getElementsByTagName('template');
        for (var i = 0; i < templates.length; i++) {
            var tpl = templates[i]
            var src = tpl.getAttribute('tpl-src');
            await Fetcher.fetchTextFile(src)
                .then(html => tpl.innerHTML = html)
                .catch(reason => console.error(reason));
        }
    }
    static populate(config) {
        document.title = config.pageTitle
        document.getElementById('pageHeading').innerHTML = config.pageHeading;
        document.getElementById('btnPrevTitle').innerHTML = config.btnPrevTitle;
        document.getElementById('btnAllTitle').innerHTML = config.btnAllTitle;
        document.getElementById('linkHomeTitle').innerHTML = config.linkHomeTitle;
        document.getElementById('linkArchiveTitle').innerHTML = config.linkArchiveTitle;

        var elem = document.getElementById('navbarBrandLink');
        elem.setAttribute("href", window.location.origin);
        elem.innerHTML = window.location.hostname;

        var currentYear = new Date().getFullYear();
        for (var i = config.archiveDropDownFirstYear; i <= currentYear; i++) {
            var elem = document.createElement('li');
            elem.innerHTML = '<a class="dropdown-item" href="/?year=' + i + '"><i class="fa fa-fw fa-calendar"></i>&nbsp; ' + i + '</a></li>' + "\n";
            document.getElementById('archive').appendChild(elem);
        }

        var year = new URLSearchParams(window.location.search).get("year");
        if (!year) {
            year = new Date().getFullYear();
        }
        document.getElementById('pageYear').innerHTML = year;
        document.getElementById('copyright').innerHTML = year + ' ' + config.copyright;
    }
    static masonry() {
        var latestFigures = Array.from(document.querySelectorAll('.figures')).pop();
        if (latestFigures) {
            imagesLoaded(latestFigures, function () {
                // Init Isotope after all images have loaded to avoid image overlapping.
                var msnry = new Masonry(latestFigures, {
                    columnWidth: 20
                });
            });
        }
    }
    static initPhotoSwipe() {
        new PhotoSwipeLightbox({
            gallery: '#articles',
            children: 'a',
            pswpModule: PhotoSwipe
        }).init()
    }
    static renderArticle(article = Article()) {
        let template = document.querySelector('#article-tpl');
        let articleElem = template.content.querySelector('article');
        articleElem.id = article.getId();
        articleElem.querySelector('.date').textContent = article.getDate();
        articleElem.querySelector('.heading').textContent = article.getHeading();
        articleElem.querySelector('.article-id').textContent = article.getId();
        articleElem.querySelector('.video-count').textContent = article.getVidURLs().length;
        articleElem.querySelector('.image-count').textContent = article.getImages().length;
        articleElem.querySelector('.content').textContent = article.getContent();

        articleElem.querySelector('.videos').innerHTML = '';
        if (article.getVidURLs().length) {
            for (var i = 0; i < article.getVidURLs().length; i++) {
                var videoTemplate = document.querySelector('#article-vid-tpl');
                var video = videoTemplate.content.querySelector('video');
                video.querySelector('.video-src').src = article.getVidURLs()[i];

                var videoClone = document.importNode(videoTemplate.content, true);
                articleElem.querySelector('.videos').appendChild(videoClone);
            }
        } else {
            articleElem.querySelector('.videos').display = 'none';
        }

        articleElem.querySelector('.figures').innerHTML = '';
        let images = article.getImages();
        if (images.length) {
            for (var i = 0; i < images.length; i++) {
                const image = images[i];

                const figureTpl = document.querySelector('#article-figure-tpl');
                figureTpl.content.querySelector('img').src = image.getThumbName();

                const a = figureTpl.content.querySelector('a');
                a.href = image.getName();
                a.setAttribute('data-pswp-width', image.getWidth());
                a.setAttribute('data-pswp-height', image.getHeight());

                const figure = document.importNode(figureTpl.content, true);
                articleElem.querySelector('.figures').appendChild(figure);
            }
        } else {
            articleElem.querySelector('.figures').display = 'none';
        }

        var clone = document.importNode(template.content, true);
        document.querySelector('#articles').appendChild(clone);
    }
}
