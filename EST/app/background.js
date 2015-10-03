chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
   innerBounds: {
      width: 1280,
      height: 600
    }
  });
});