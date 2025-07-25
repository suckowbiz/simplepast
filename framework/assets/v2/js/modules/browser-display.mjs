"use strict";

import Fetcher from './fetcher.mjs'
import Article from './article.mjs'

export default class BrowserDisplay {
    static displaySpinner() {
        document.getElementById('spinner').style.display = 'inline';
    }
    static hideSpinner() {
        document.getElementById('spinner').style.display = 'none';
    }
    static displayNextBtns() {
        document.getElementById('more-btn').style.display = 'inline'
        document.getElementById('all-btn').style.display = 'inline'
    }
    static hideNextBtns() {
        document.getElementById('more-btn').style.display = 'none'
        document.getElementById('all-btn').style.display = 'none'
    }
    static getArticlesLastChildId() {
        let result = undefined
        let articles = document.querySelectorAll('article')
        if (articles.length) {
            result = articles[articles.length-1].getAttribute("id")
        }
        return result
    }
    static mustGetYear = function () {
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
        document.querySelector('meta[name="google-site-verification"]').setAttribute("content", config.googleSiteVerification);

        var elem = document.getElementById('navbarBrandLink');
        elem.setAttribute("href", window.location.origin);
        elem.innerHTML = window.location.hostname;

        var currentYear = new Date().getFullYear();
        var firstYear = parseInt(config.archiveStart)
        if (isNaN(firstYear)) {
            throw new Error("Cannot parse as a number: "+config.archiveStart)
        }
        for (var i = firstYear; i <= currentYear; i++) {
            var elem = document.createElement('li');
            elem.innerHTML = '<a class="dropdown-item" href="/?year=' + i + '"><i class="fa fa-fw fa-calendar"></i>&nbsp; ' + i + '</a></li>' + "\n";
            document.getElementById('archive').appendChild(elem);
        }

        var year = new URLSearchParams(window.location.search).get("year");
        if (!year) {
            year = new Date().getFullYear();
        }
        document.getElementById('pageYear').innerHTML = year;
        document.getElementById('copyright').innerHTML = currentYear + ' ' + config.copyright;
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
        // Instead of importing photo-swipe in this module, it is created as a global constant in the .html
        // page to keep all version strings in that .html file. That's way it remains  a no-brainer 
        // to keeping things up-to-date using renovate (an there is no issue with cache busting for js here).
        lightbox.init();
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
