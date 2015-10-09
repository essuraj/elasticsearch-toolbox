chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        id: 'appWindow',
        frame: "none",
        state: "maximized",
        innerBounds: {
            width: 1280,
            height: 700,
            minWidth: 1024,
            minHeight: 600

        }
    });
});
