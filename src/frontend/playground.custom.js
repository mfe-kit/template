(function () {
  document.addEventListener('mfe-kit-template.ready', (e) =>
    console.log('ready', e.detail),
  );
  document.addEventListener('mfe-kit-template.loaded', (e) =>
    console.log('loaded', e.detail),
  );
})();
