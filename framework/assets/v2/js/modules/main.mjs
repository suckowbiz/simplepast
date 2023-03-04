"use strict";

import Simplepast from './simplepast.mjs'

try {
    document.getElementById('more-btn').addEventListener('click', function () { Simplepast.loadNextArticle() });
    document.getElementById('all-btn').addEventListener('click', function () { Simplepast.loadAllArticles() });

    Simplepast
        .populate()
        .then(sp => {
            // First populate the website to have e.g. templates in place for article rendering.
            sp.loadNextArticle();
        });
} catch (error) {
    console.log(error)
}
