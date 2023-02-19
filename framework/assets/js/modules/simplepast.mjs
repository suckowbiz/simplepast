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
        const articleCount = BrowserDisplay.getArticleCount();
        const year = BrowserDisplay.getYear();
        try {
            await this.loadNextArticle()
            this.loadAllArticles()
        } catch(error) {
            console.log(error)
            return
        }
    }
    static async loadNextArticle() {
        BrowserDisplay.disableNextBtns();

        const browserArticleCount = BrowserDisplay.getArticleCount();
        const year = BrowserDisplay.getYear();

        let possibleNextArticleId = browserArticleCount + 1
        await ArticleDb.getArticle(year, possibleNextArticleId)
            .then(function(article) {
                BrowserDisplay.renderArticle(article)
                BrowserDisplay.masonry()
                BrowserDisplay.initPhotoSwipe()
                BrowserDisplay.enableNextBtns();
            })
            .catch(response => {
                BrowserDisplay.hideNextBtns()
                const err = 'Trial to fetch next article, failed. This is  intentional and marks the end of available articles.'
                console.log(err)
                throw Error(err)
            });
    }
}
