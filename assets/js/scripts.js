(function () {
    'use strict';

    var body = document.body;
    var desktop = window.matchMedia('(min-width: 960px)');

    function setupMenu() {
        var toggle = document.querySelector('.js-menu-toggle');

        if (!toggle) {
            return;
        }

        toggle.addEventListener('click', function () {
            var isOpen = body.classList.toggle('is-menu-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

    function setupDrawer() {
        var toggle = document.querySelector('.js-contents-toggle');
        var closeButton = document.querySelector('.js-contents-close');
        var sidebar = document.querySelector('.js-sidebar');
        var overlay = document.querySelector('.js-overlay');

        if (!toggle || !closeButton || !sidebar || !overlay) {
            return;
        }

        function isOpen() {
            return body.classList.contains('is-drawer-open');
        }

        function open() {
            body.classList.add('is-drawer-open');
            overlay.hidden = false;
            toggle.setAttribute('aria-expanded', 'true');
            sidebar.focus();
        }

        function close(returnFocus) {
            if (!isOpen()) {
                return;
            }

            body.classList.remove('is-drawer-open');
            overlay.hidden = true;
            toggle.setAttribute('aria-expanded', 'false');

            if (returnFocus) {
                toggle.focus();
            }
        }

        toggle.addEventListener('click', open);
        closeButton.addEventListener('click', function () { close(true); });
        overlay.addEventListener('click', function () { close(true); });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                close(true);
            }
        });

        sidebar.addEventListener('click', function (event) {
            if (event.target.closest('a')) {
                close(false);
            }
        });

        desktop.addEventListener('change', function (event) {
            if (event.matches) {
                close(false);
            }
        });
    }

    function slugify(text) {
        var slug = text
            .normalize('NFKD')
            .replace(/[̀-ͯ]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        return slug || 'section';
    }

    function uniqueId(base, usedIds) {
        var id = base;
        var suffix = 2;

        while (usedIds.has(id)) {
            id = base + '-' + suffix;
            suffix += 1;
        }

        usedIds.add(id);
        return id;
    }

    function buildToc() {
        var entry = document.querySelector('.js-entry');
        var toc = document.querySelector('.js-toc');
        var list = document.querySelector('.js-toc-list');

        if (body.dataset.toc !== 'true' || !entry || !toc || !list) {
            return;
        }

        var headings = entry.querySelectorAll('h2, h3');

        if (headings.length < 2) {
            return;
        }

        var usedIds = new Set(Array.prototype.map.call(document.querySelectorAll('[id]'), function (element) {
            return element.id;
        }));

        Array.prototype.forEach.call(headings, function (heading) {
            if (!heading.id) {
                heading.id = uniqueId(slugify(heading.textContent), usedIds);
            }

            var item = document.createElement('li');
            var link = document.createElement('a');

            item.className = heading.tagName === 'H3' ? 'toc__item toc__item--sub' : 'toc__item';
            link.className = 'toc__link';
            link.href = '#' + encodeURIComponent(heading.id);
            link.textContent = heading.textContent.trim();

            item.appendChild(link);
            list.appendChild(item);
        });

        toc.hidden = false;
    }

    setupMenu();
    setupDrawer();
    buildToc();
})();
