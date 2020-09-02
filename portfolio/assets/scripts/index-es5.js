'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
    // to download youtube videos in speed way
    // ------------------------------------
    var videoList = void 0;
    document.addEventListener("DOMContentLoaded", function () {
        var div = void 0;
        videoList = document.querySelectorAll(".youtube-player");
        videoList.forEach(function (el, i) {
            var v = document.createElement("div");
            v.id = 'video_player' + i;
            videoList[i].appendChild(v);
            div = document.createElement("div");
            div.className = "video-thumb";
            div.setAttribute("data-id", videoList[i].dataset.id);

            var img = document.createElement('img');
            img.setAttribute('src', labnolThumb(videoList[i].dataset.id));
            img.setAttribute('alt', '');
            img.setAttribute('class', 'w-100');
            div.appendChild(img);

            div.onclick = labnolIframe;
            videoList[i].appendChild(div);
        });
    });

    function labnolThumb(id) {
        return 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
    }

    function labnolIframe() {
        // now on click on the thumb --> the behavour will be different on desktop or mobile
        if (window.innerWidth <= 1279) {

            // The API will call this function when the video player is ready.
            var onPlayerReady = function onPlayerReady(event) {
                event.target.mute();
                event.target.playVideo();
            };

            // This function creates an <iframe> (and YouTube player)
            //    after the API code downloads.
            var player = void 0;
            player = new YT.Player(this.parentNode.children[0].id, {
                videoId: this.dataset.id,
                playerVars: _defineProperty({ 'autoplay': 1, 'playsinline': 1, 'rel': 0, 'start': this.parentNode.dataset.start || 0 }, 'playsinline', 1),
                events: {
                    'onReady': onPlayerReady
                }
            });
            this.remove();
        } else {
            var div = document.createElement("div");
            div.classList.add('iframe-wrapper');

            var iframe = document.createElement("iframe");
            var embed = 'https://www.youtube.com/embed/' + this.dataset.id + '?rel=0&autoplay=1&start=' + (this.parentNode.dataset.start || 0);
            iframe.setAttribute("src", embed);
            iframe.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
            iframe.setAttribute("frameborder", "0");
            iframe.setAttribute("allowfullscreen", "1");

            div.appendChild(iframe);
            this.parentNode.replaceChild(div, this);
        }
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