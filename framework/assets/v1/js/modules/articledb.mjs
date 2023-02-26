"use strict";

import Fetcher from './fetcher.mjs'
import Article from './article.mjs'

export default class ArticleDb {
    static async getArticle(year = 0, id = 0) {
        const path = '/articles/' + year + '/' + id;
        let article = new Article(year, id);
        let p1 = Fetcher
            .fetchTextFile(path + '/date.txt')
            .then((txt) => article.setDate(txt));
        let p2 = Fetcher
            .fetchTextFile(path + '/heading.txt')
            .then((txt) => article.setHeading(txt));
        let p3 = Fetcher
            .fetchTextFile(path + '/content.txt')
            .then((txt) => article.setContent(txt));
        let p4 = Fetcher
            .fetchJSONFile(path + '/img/meta.json')
            .then((meta) => article.setImages(path, meta.images));
        let p5 = Fetcher
            .fetchJSONFile(path + '/vid/meta.json')
            .then(meta => article.setVidURLs(path + '/vid', meta.videos));
        await Promise
            .all([p1, p2, p3, p4, p5])
            .catch(error => {
                console.log("Error fetching article: "+error)
                article = undefined;
            });
        return article;
    }
    static async discoverLatestArticleIdOf(year) {
        let result = undefined;
        for (let id = 1, continueTrial = true; continueTrial; id++) {
            await Fetcher
                .fetchFile('/articles/' + year + '/' + id + '/heading.txt')
                .then(() => {
                    result = id;
                })
                .catch(() => {
                    // Considering last failure as end of available articles to break.
                    continueTrial = false;
                })
        }
        return result
    }
}
