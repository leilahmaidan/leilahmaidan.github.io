'use strict';

(function () {
    // ------------------------------------
    // to add animation on scroll
    // ------------------------------------
    if (window.innerWidth >= 1280) {
        document.addEventListener("DOMContentLoaded", function () {
            var css = document.createElement('link');
            css.setAttribute('href', 'https://unpkg.com/aos@2.3.1/dist/aos.css');
            css.setAttribute('rel', 'stylesheet');
            document.head.appendChild(css);

            var script1 = document.createElement('script');
            script1.setAttribute('src', 'https://unpkg.com/aos@2.3.1/dist/aos.js');
            document.body.appendChild(script1);

            var script2 = document.createElement('script');
            script2.innerHTML += 'setTimeout(() => {\n                AOS.init();\n            }, 1000);';
            document.body.appendChild(script2);
        });
    }
})();

(function () {

    // ------------------------------------
    // remove the preloading screen
    // ------------------------------------

    window.addEventListener("load", function () {
        document.querySelector('#loading').classList.add('d-none');
        document.querySelector('#site-container').classList.remove('d-none');

        // ------------------------------------
        // navbar responsive
        // ------------------------------------

        // define all UI variable
        var navToggler = document.querySelector('.nav-toggler');
        var navMenu = document.querySelector('.nav-links');
        var navLinks = Array.from(document.querySelectorAll('.nav-links a'));

        // load all event listners
        allEventListners();

        // functions of all event listners
        function allEventListners() {
            // toggler icon click event
            navToggler.addEventListener('click', togglerClick);
            // nav links click event
            navLinks.forEach(function (elem) {
                return elem.addEventListener('click', navLinkClick);
            });
        }

        // togglerClick function
        function togglerClick() {
            navToggler.classList.toggle('toggler-open');
            navMenu.classList.toggle('open');
        }

        // navLinkClick function
        function navLinkClick() {
            if (navMenu.classList.contains('open')) {
                navToggler.click();
            }
        }

        // ------------------------------------
        // navbar active link
        // ------------------------------------

        var sections = document.querySelectorAll('.sec');
        var currentSection = void 0;
        window.onscroll = function () {

            // This code loads the IFrame Player API code asynchronously.
            if (!document.querySelector('script[src*="youtube"]') && window.innerWidth <= 1279) {
                var tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }

            // onscroll --> shrink the navbar
            if (window.innerWidth >= 1200) {
                if (document.body.scrollTop >= 200 || document.documentElement.scrollTop >= 200) {
                    document.querySelector('#navbar').classList.add("navbar-scroll");
                } else {
                    document.querySelector('#navbar').classList.remove("navbar-scroll");
                }
            }

            // change active link
            sections.forEach(function (sec) {
                if (isVisible(sec)) {
                    currentSection = sec;
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active-link');
            });
            navLinks.filter(function (link) {
                return link.href.split('#')[1] == currentSection.id;
            })[0].classList.add('active-link');
        };

        // ------------------------------------
        // fix blog style
        // ------------------------------------

        fixBlogStyle();
        window.addEventListener('resize', fixBlogStyle);

        // ------------------------------------
        // fix videos titles height
        // ------------------------------------

        if (window.innerWidth >= 1200) {
            (function () {
                var videosTitleList = Array.from(document.querySelectorAll('.videos-wrapper .element-head'));
                var max = videosTitleList[0].clientHeight;
                videosTitleList.forEach(function (el) {
                    if (el.clientHeight > max) {
                        max = el.clientHeight;
                    }
                });
                videosTitleList.forEach(function (el) {
                    el.style.height = max + 'px';
                });
            })();
        }

        // ------------------------------------
        // load / read more functionality for each section
        // ------------------------------------

        // ------------------- videos section -------------------

        var videoSections = Array.from(document.querySelectorAll('.video-wrapper'));
        var showMoreVideos = document.querySelector('#videos button');

        if (window.innerWidth >= 1200 && videoSections.length > 4) {
            showMoreFunctionality(videoSections, showMoreVideos, 4, 4);
        } else if (window.innerWidth < 1200 && videoSections.length > 2) {
            showMoreFunctionality(videoSections, showMoreVideos, 2, 2);
        }

        // ------------------- articles section -------------------

        var articleSections = Array.from(document.querySelectorAll('#blog article'));
        var showMoreArticles = document.querySelector('#blog button');

        if (articleSections.length > 3) {
            showMoreFunctionality(articleSections, showMoreArticles, 3, 3);
        }

        // ------------------- podcast section -------------------

        var audioSections = Array.from(document.querySelectorAll('#podcast .audio'));
        var showMoreAudios = document.querySelector('#podcast button');

        if (window.innerWidth >= 1200 && audioSections.length > 4) {
            showMoreFunctionality(audioSections, showMoreAudios, 4, 4);
        } else if (window.innerWidth < 1200 && audioSections.length > 2) {
            showMoreFunctionality(audioSections, showMoreAudios, 2, 2);
        }
    });

    // ------------------- show more btn function -------------------

    function showMoreFunctionality(collection, btn, start, increment) {
        for (var _i = start; _i < collection.length; _i++) {
            collection[_i].classList.add('d-none');
        }
        btn.classList.remove('d-none');
        var i = start;
        btn.addEventListener('click', function () {
            var j = i + increment < collection.length ? i + increment : collection.length;
            while (i < j) {
                if (collection[i]) {
                    collection[i].classList.remove('d-none');
                }
                i++;
            }
            if (i == collection.length) {
                btn.classList.add('d-none');
            }
        });
    }

    // function to check if the section is visible
    function isVisible(sec) {
        var windowTop = window.scrollY;
        var secTop = sec.offsetTop;
        return windowTop >= secTop;
    }

    // ------------------------------------
    // fix blog style
    // ------------------------------------

    function fixBlogStyle() {

        if (window.innerWidth >= 1200) {
            // fix last article style
            var blogArticles = document.querySelectorAll('.articles-wrapper article');
            var articleInfoList = document.querySelectorAll('.article-info');
            blogArticles[blogArticles.length - 1].querySelector('.article-info').style.paddingBottom = "0";
            blogArticles[blogArticles.length - 1].querySelector('.article-img').style.marginBottom = "0";

            // fix the points
            articleInfoList.forEach(function (el, i) {
                insertRightandTopandHeightValues(i, el.clientHeight - el.clientHeight / 1.065);
            });
        }
    }

    function insertRightandTopandHeightValues(index, top) {
        var html = '<style>\n                .article-info:nth-child(' + (index + 1) + ')::before {\n                    top: ' + top + 'px;\n                }\n                .article-info:nth-child(' + (index + 1) + ')::after {\n                    top: ' + top + 'px;\n                }\n                </style>';
        document.head.innerHTML += html;
    }
})();