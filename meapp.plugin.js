/**
 * Meapp plugin for CloudStream
 * Source: rezka-ua.in
 * Categories: Фильмы, Сериалы, Аниме, Мультфильмы, ТВ-шоу
 * No ads, custom icon
 */

var plugin = new CloudStream.Plugin();

plugin.setName("meapp");
plugin.setId("meapp");
plugin.setVersion("1.0");
plugin.setIcon("https://i.imgur.com/9Jpl7Kn.png"); // буква M на фиолетовом фоне

plugin.setBaseUrl("https://rezka-ua.in");

plugin.addCategory("films", "Фильмы", "https://rezka-ua.in/films/");
plugin.addCategory("series", "Сериалы", "https://rezka-ua.in/series/");
plugin.addCategory("anime", "Аниме", "https://rezka-ua.in/anime/");
plugin.addCategory("multfilms", "Мультфильмы", "https://rezka-ua.in/multfilms/");
plugin.addCategory("tvshows", "ТВ-шоу", "https://rezka-ua.in/tvshows/");

plugin.setSearchPath("/search/?q=%s");

plugin.parseList = function(response) {
    var items = [];
    var doc = new DOMParser().parseFromString(response, "text/html");
    var cards = doc.querySelectorAll(".b-content__inline_item");
    for (var card of cards) {
        var titleElem = card.querySelector(".b-content__inline_item-link");
        var title = titleElem ? titleElem.textContent.trim() : "Без названия";
        var url = titleElem ? titleElem.href : null;
        var imgElem = card.querySelector("img");
        var img = imgElem ? imgElem.src : "";
        if (url) {
            items.push({
                title: title,
                url: url,
                poster: img,
            });
        }
    }
    return items;
};

plugin.parseVideoLinks = function(response) {
    var sources = [];
    var doc = new DOMParser().parseFromString(response, "text/html");
    var scripts = doc.querySelectorAll("script");
    for (var script of scripts) {
        if (script.textContent.includes("playerInstance.setup")) {
            var text = script.textContent;
            var jsonMatch = text.match(/file:\s*"(.*?)"/);
            if (jsonMatch) {
                sources.push({
                    url: jsonMatch[1],
                    quality: "HD",
                    isM3U8: jsonMatch[1].endsWith(".m3u8")
                });
            }
        }
    }
    return sources;
};

plugin.parseItem = function(response) {
    var doc = new DOMParser().parseFromString(response, "text/html");
    var titleElem = doc.querySelector(".b-post__title");
    var title = titleElem ? titleElem.textContent.trim() : "Без названия";
    var descriptionElem = doc.querySelector(".b-post__description_text");
    var description = descriptionElem ? descriptionElem.textContent.trim() : "";
    var posterElem = doc.querySelector(".b-sidecover__image img");
    var poster = posterElem ? posterElem.src : "";
    return {
        title: title,
        description: description,
        poster: poster
    };
};

plugin.ready();
