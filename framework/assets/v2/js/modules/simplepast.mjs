"use strict";

import ArticleDb from './articledb.mjs'
import Fetcher from './fetcher.mjs'
import BrowserDisplay from './browser-display.mjs';

export default class Simplepast {
    static async populate() {
        await Fetcher
            .fetchJSONFile('/config.json')
            .then(json => BrowserDisplay.populate(json))
            .catch(reason => console.error(reason));
        await BrowserDisplay.renderTemplates();
        return this;
    }
    static async loadAllArticles() {
        await this.loadNextArticle()
            .then(res => {
                if (res) {
                    this.loadAllArticles()
                }
            })
            .catch(error => {
                console.log(error)
            });
    }
    static async discoverNextArticleId(year) {
        const id = BrowserDisplay.getArticlesLastChildId();
        if (id === undefined) {
            // initial call, there is no browser article display
            return await ArticleDb.discoverLatestArticleIdOf(year).then(id => { return id });
        }

        let res = undefined
        if (id > 1) {
            res = id - 1
        }
        return res
    }
    static async loadNextArticle() {
        BrowserDisplay.displaySpinner();
        BrowserDisplay.hideNextBtns();

        const year = BrowserDisplay.mustGetYear();
        const id = await Simplepast.discoverNextArticleId(year).then(id => { return id; });
        if (id === undefined) {
            return false
        }

        // indicates loading success to be able to consider no more articles to display
        let res = false;
        await ArticleDb.getArticle(year, id)
            .then(article => {
                BrowserDisplay.renderArticle(article)
                BrowserDisplay.masonry()
                BrowserDisplay.initPhotoSwipe()
                BrowserDisplay.hideSpinner();
                BrowserDisplay.displayNextBtns();
                res = true;
            })
            .catch(error => {
                BrowserDisplay.hideSpinner();
                BrowserDisplay.hideNextBtns()
                const err = 'Error to render article: ' + error
                console.log(err)
                throw Error(err)
            });
        return res
    }
}
