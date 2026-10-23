/* Embed this small script in the head of a delivered HTML, after its styles.
   All document content remains readable before enhancement or without JavaScript. */
(() => {
  'use strict';
  const root = document.documentElement;
  const themeKey = 'html-document-theme';
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)');
  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch { /* Storage may be unavailable in a private or local-file context. */ }

  function targetFromHash(hash) {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  }

  function init() {
    const themeButtons = [...document.querySelectorAll('[data-theme-toggle]')];
    function updateThemeButtons() {
      const dark = root.dataset.theme ? root.dataset.theme === 'dark' : !!systemTheme?.matches;
      themeButtons.forEach(button => {
        const nextTheme = dark ? 'light' : 'dark';
        const fallback = /^ja(?:-|$)/i.test(root.lang)
          ? (dark ? 'ライトモードに切り替える' : 'ダークモードに切り替える')
          : (dark ? 'Switch to light mode' : 'Switch to dark mode');
        const label = button.getAttribute(`data-theme-label-${nextTheme}`)?.trim() || fallback;
        button.setAttribute('aria-label', label);
        button.dataset.tooltip = label;
        button.querySelectorAll('[data-theme-icon]').forEach(icon => {
          icon.toggleAttribute('hidden', icon.dataset.themeIcon !== (dark ? 'sun' : 'moon'));
        });
      });
    }
    themeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dark = root.dataset.theme ? root.dataset.theme === 'dark' : !!systemTheme?.matches;
        root.dataset.theme = dark ? 'light' : 'dark';
        try { localStorage.setItem(themeKey, root.dataset.theme); } catch { /* Keep the in-page choice. */ }
        updateThemeButtons();
      });
      button.hidden = false;
    });
    updateThemeButtons();
    if (systemTheme?.addEventListener) systemTheme.addEventListener('change', updateThemeButtons);
    else systemTheme?.addListener?.(updateThemeButtons);

    document.querySelectorAll('[data-print-document]').forEach(button => {
      button.addEventListener('click', () => window.print());
      button.hidden = false;
    });
    const tooltipButtons = [...document.querySelectorAll('.icon-button[data-tooltip]')];
    tooltipButtons.forEach(button => {
      ['pointerenter', 'focus'].forEach(type => button.addEventListener(type, () => {
        delete button.dataset.tooltipDismissed;
      }));
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') tooltipButtons.forEach(button => { button.dataset.tooltipDismissed = ''; });
    });

    document.querySelectorAll('[data-tabs]').forEach(enhanceTabs);

    // Print only opt-in supplemental details; do not reveal unopened exercise answers.
    const openedForPrint = new Set();
    window.addEventListener('beforeprint', () => {
      document.querySelectorAll('details[data-print="open"]:not([open])').forEach(detail => {
        openedForPrint.add(detail);
        detail.open = true;
      });
    });
    window.addEventListener('afterprint', () => {
      openedForPrint.forEach(detail => { detail.open = false; });
      openedForPrint.clear();
    });
  }

  function enhanceTabs(container) {
    const nav = container.querySelector('.document-tabs__links');
    const fullButton = container.querySelector('[data-tabs-full]');
    if (!nav || !fullButton) return;
    const links = [...nav.querySelectorAll('a[data-tab-link]')];
    const panels = links.map(link => targetFromHash(link.hash));
    if (links.length < 2 || links.some(link => !link.id) || new Set(panels).size !== panels.length ||
        panels.some(panel => !panel || !container.contains(panel) || !panel.matches('[data-tab-panel]'))) return;
    const labels = panels.map(panel => panel.getAttribute('aria-labelledby'));
    const canFindHidden = 'onbeforematch' in document.documentElement && !!window.CSS?.supports('content-visibility', 'hidden');
    let full = !canFindHidden;
    let selected = panels.findIndex(panel => panel.contains(targetFromHash(location.hash)));
    if (selected < 0) selected = 0;

    function revealTabLink(link = links[selected]) {
      if (full) return;
      // Scroll only the tab strip; leave the document's reading position alone.
      const item = link.getBoundingClientRect();
      const strip = nav.getBoundingClientRect();
      if (item.left < strip.left + 4) nav.scrollLeft += item.left - strip.left - 4;
      else if (item.right > strip.right - 4) nav.scrollLeft += item.right - strip.right + 4;
    }

    function render() {
      container.dataset.view = full ? 'all' : 'tabs';
      fullButton.setAttribute('aria-pressed', String(full));
      if (full) nav.removeAttribute('role');
      else nav.setAttribute('role', 'tablist');
      links.forEach((link, index) => {
        const panel = panels[index];
        if (full) {
          ['role', 'aria-selected', 'aria-controls', 'tabindex'].forEach(name => link.removeAttribute(name));
          ['role', 'tabindex', 'hidden'].forEach(name => panel.removeAttribute(name));
          if (labels[index]) panel.setAttribute('aria-labelledby', labels[index]);
          else panel.removeAttribute('aria-labelledby');
        } else {
          link.setAttribute('role', 'tab');
          link.setAttribute('aria-selected', String(index === selected));
          link.setAttribute('aria-controls', panel.id);
          link.tabIndex = index === selected ? 0 : -1;
          panel.setAttribute('role', 'tabpanel');
          panel.setAttribute('aria-labelledby', link.id);
          panel.tabIndex = index === selected ? 0 : -1;
          if (index === selected) panel.removeAttribute('hidden');
          else panel.setAttribute('hidden', canFindHidden ? 'until-found' : '');
        }
      });
      revealTabLink();
    }

    function writeHash(hash, replace = false) {
      if (location.hash === hash) return;
      try { history[replace ? 'replaceState' : 'pushState'](history.state, '', hash); }
      catch { location.hash = hash; }
    }

    function scrollToTarget(target, focus = false) {
      requestAnimationFrame(() => {
        // An explicit fragment may point inside nested disclosures. Reveal only its ancestors.
        for (let ancestor = target.parentElement; ancestor; ancestor = ancestor.parentElement) {
          if (ancestor.localName === 'details') ancestor.open = true;
        }
        if (focus) {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      });
    }

    function syncHash() {
      if (!location.hash) {
        selected = 0;
        render();
        return;
      }
      const target = targetFromHash(location.hash);
      const index = panels.findIndex(panel => panel.contains(target));
      if (index < 0) return;
      selected = index;
      render();
      scrollToTarget(target);
    }

    nav.addEventListener('keydown', event => {
      if (full) return;
      const current = links.indexOf(event.target);
      if (current < 0) return;
      let next = current;
      if (event.key === 'ArrowRight') next = (current + 1) % links.length;
      else if (event.key === 'ArrowLeft') next = (current + links.length - 1) % links.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = links.length - 1;
      else if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        links[current].click();
        return;
      } else return; // Keep Up/Down, Tab, and browser shortcuts untouched.
      event.preventDefault();
      links.forEach((link, index) => { link.tabIndex = index === next ? 0 : -1; });
      links[next].focus({ preventScroll: true });
      revealTabLink(links[next]);
    });
    nav.addEventListener('focusout', event => {
      if (!full && !nav.contains(event.relatedTarget)) {
        links.forEach((link, index) => { link.tabIndex = index === selected ? 0 : -1; });
      }
    });

    document.addEventListener('click', event => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target.closest('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const url = new URL(link.href, location.href);
      if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      const target = targetFromHash(url.hash);
      const index = panels.findIndex(panel => panel.contains(target));
      if (index < 0 || full) return;
      event.preventDefault();
      selected = index;
      render();
      writeHash(url.hash);
      if (links.includes(link)) link.focus({ preventScroll: true });
      else scrollToTarget(target, true);
    });

    fullButton.addEventListener('click', () => {
      full = !full;
      // Keep the current panel selected when returning from continuous reading.
      const index = panels.findIndex(panel => panel.contains(targetFromHash(location.hash)));
      if (index >= 0) selected = index;
      render();
    });

    panels.forEach((panel, index) => panel.addEventListener('beforematch', () => {
      if (full) return;
      selected = index;
      render();
      // Preserve a deep fragment that itself caused the browser to reveal this panel.
      if (!panel.contains(targetFromHash(location.hash))) writeHash(`#${encodeURIComponent(panel.id)}`, true);
      // The browser owns scrolling and search focus after beforematch.
    }));
    window.addEventListener('hashchange', syncHash);
    window.addEventListener('popstate', syncHash);

    // Apply hiding only after the links, fallback control, and handlers are ready.
    fullButton.hidden = false;
    render();
    if (location.hash) syncHash();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
