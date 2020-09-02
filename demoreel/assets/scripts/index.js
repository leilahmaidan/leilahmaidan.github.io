(function () {
    // ------------------------------------
    // to add animation on scroll
    // ------------------------------------
    if (window.innerWidth >= 1280) {
        document.addEventListener("DOMContentLoaded", function () {
            let css = document.createElement('link');
            css.setAttribute('href', 'https://unpkg.com/aos@2.3.1/dist/aos.css');
            css.setAttribute('rel', 'stylesheet');
            document.head.appendChild(css);

            let script1 = document.createElement('script');
            script1.setAttribute('src', 'https://unpkg.com/aos@2.3.1/dist/aos.js');
            document.body.appendChild(script1);

            let script2 = document.createElement('script');
            script2.innerHTML += `setTimeout(() => {
                AOS.init();
            }, 1000);`
            document.body.appendChild(script2);
        })
    }

})();

(function () {
    // ------------------------------------
    // to download youtube videos in speed way
    // ------------------------------------
    let videoList;
    document.addEventListener("DOMContentLoaded",
        function () {
            let div;
            videoList = document.querySelectorAll(".youtube-player");
            videoList.forEach((el, i) => {
                let v = document.createElement("div");
                v.id = `video_player${i}`;
                videoList[i].appendChild(v);
                div = document.createElement("div");
                div.className = "video-thumb"
                div.setAttribute("data-id", videoList[i].dataset.id);

                let img = document.createElement('img');
                img.setAttribute('src', labnolThumb(videoList[i].dataset.id));
                img.setAttribute('alt', '');
                img.setAttribute('class', 'w-100');
                div.appendChild(img);

                div.onclick = labnolIframe;
                videoList[i].appendChild(div);
            })
        });

    function labnolThumb(id) {
        return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
    }

    function labnolIframe() {
        // now on click on the thumb --> the behavour will be different on desktop or mobile
        if (window.innerWidth <= 1279) {
            // This function creates an <iframe> (and YouTube player)
            //    after the API code downloads.
            let player;
            player = new YT.Player(this.parentNode.children[0].id, {
                videoId: this.dataset.id,
                playerVars: { 'autoplay': 1, 'playsinline': 1, 'rel': 0, 'start': this.parentNode.dataset.start || 0, 'playsinline': 1 },
                events: {
                    'onReady': onPlayerReady,
                }
            });
            this.remove();

            // The API will call this function when the video player is ready.
            function onPlayerReady(event) {
                event.target.mute();
                event.target.playVideo();
            }
        } else {
            let div = document.createElement("div");
            div.classList.add('iframe-wrapper');

            let iframe = document.createElement("iframe");
            let embed = `https://www.youtube.com/embed/${this.dataset.id}?rel=0&autoplay=1&start=${this.parentNode.dataset.start || 0}`;
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
        const navToggler = document.querySelector('.nav-toggler');
        const navMenu = document.querySelector('.nav-links');
        const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

        // load all event listners
        allEventListners();

        // functions of all event listners
        function allEventListners() {
            // toggler icon click event
            navToggler.addEventListener('click', togglerClick);
            // nav links click event
            navLinks.forEach(elem => elem.addEventListener('click', navLinkClick));
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

        const sections = document.querySelectorAll('.sec');
        let currentSection;
        window.onscroll = function () {

            // This code loads the IFrame Player API code asynchronously.
            if (!(document.querySelector('script[src*="youtube"]')) && window.innerWidth <= 1279) {
                let tag = document.createElement('script');
                tag.src = "https://www.youtube.com/iframe_api";
                let firstScriptTag = document.getElementsByTagName('script')[0];
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
            sections.forEach(sec => {
                if (isVisible(sec)) {
                    currentSection = sec;
                }
            })

            navLinks.forEach(link => {
                link.classList.remove('active-link');
            })
            navLinks.filter(link => link.href.split('#')[1] == currentSection.id)[0].classList.add('active-link');
        }

        // ------------------------------------
        // fix blog style
        // ------------------------------------

        fixBlogStyle();
        window.addEventListener('resize', fixBlogStyle);

        // ------------------------------------
        // fix videos titles height
        // ------------------------------------

        if (window.innerWidth >= 1200) {
            const videosTitleList = Array.from(document.querySelectorAll('.videos-wrapper .element-head'));
            let max = videosTitleList[0].clientHeight;
            videosTitleList.forEach(el => {
                if (el.clientHeight > max) {
                    max = el.clientHeight;
                }
            });
            videosTitleList.forEach(el => {
                el.style.height = `${max}px`;
            })
        }

        // ------------------------------------
        // load / read more functionality for each section
        // ------------------------------------

        // ------------------- videos section -------------------

        const videoSections = Array.from(document.querySelectorAll('.video-wrapper'));
        const showMoreVideos = document.querySelector('#videos button');

        if (window.innerWidth >= 1200 && videoSections.length > 4) {
            showMoreFunctionality(videoSections, showMoreVideos, 4, 4);
        } else if (window.innerWidth < 1200 && videoSections.length > 2) {
            showMoreFunctionality(videoSections, showMoreVideos, 2, 2);
        }

        // ------------------- articles section -------------------

        const articleSections = Array.from(document.querySelectorAll('#blog article'));
        const showMoreArticles = document.querySelector('#blog button');

        if (articleSections.length > 3) {
            showMoreFunctionality(articleSections, showMoreArticles, 3, 3);
        }

        // ------------------- podcast section -------------------

        const audioSections = Array.from(document.querySelectorAll('#podcast .audio'));
        const showMoreAudios = document.querySelector('#podcast button');

        if (window.innerWidth >= 1200 && audioSections.length > 4) {
            showMoreFunctionality(audioSections, showMoreAudios, 4, 4);
        } else if (window.innerWidth < 1200 && audioSections.length > 2) {
            showMoreFunctionality(audioSections, showMoreAudios, 2, 2);
        }

    });

    // ------------------- show more btn function -------------------

    function showMoreFunctionality(collection, btn, start, increment) {
        for (let i = start; i < collection.length; i++) {
            collection[i].classList.add('d-none');
        }
        btn.classList.remove('d-none');
        let i = start;
        btn.addEventListener('click', function () {
            let j = (i + increment) < collection.length ? (i + increment) : collection.length;
            while (i < j) {
                if (collection[i]) {
                    collection[i].classList.remove('d-none');
                }
                i++;
            }
            if (i == collection.length) {
                btn.classList.add('d-none');
            }
        })
    }

    // function to check if the section is visible
    function isVisible(sec) {
        const windowTop = window.scrollY;
        const secTop = sec.offsetTop;
        return windowTop >= secTop;
    }

    // ------------------------------------
    // fix blog style
    // ------------------------------------

    function fixBlogStyle() {

        if (window.innerWidth >= 1200) {
            // fix last article style
            const blogArticles = document.querySelectorAll('.articles-wrapper article');
            const articleInfoList = document.querySelectorAll('.article-info');
            blogArticles[blogArticles.length - 1].querySelector('.article-info').style.paddingBottom = "0";
            blogArticles[blogArticles.length - 1].querySelector('.article-img').style.marginBottom = "0";

            // fix the points
            articleInfoList.forEach((el, i) => {
                insertRightandTopandHeightValues(i, (el.clientHeight - (el.clientHeight / 1.065)))
            })
        }
    }

    function insertRightandTopandHeightValues(index, top) {
        let html = `<style>
                .article-info:nth-child(${index + 1})::before {
                    top: ${top}px;
                }
                .article-info:nth-child(${index + 1})::after {
                    top: ${top}px;
                }
                </style>`;
        document.head.innerHTML += html;
    }
})()