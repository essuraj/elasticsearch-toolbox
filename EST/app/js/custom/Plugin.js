var resultEditor, queryEditor;

$(document).ready(function () {
    initCustomWindowButtons();

    $('.modal-trigger').leanModal();

    resultEditor = initCodeMirror("resultEditor");
    queryEditor = initCodeMirror("queryEditor");
    resultEditor.setOption("readOnly", true)
    queryEditor.setValue(JSON.stringify(defaultQuery, null, 2));
    chrome.storage.sync.get("settings", function (result) {
        console.log(result);
        gs.settings = result.settings;
        if (result.settings)
            if (result.settings.theme) {
                resultEditor.setOption("theme", result.settings.theme);
                queryEditor.setOption("theme", result.settings.theme);

            }
        setTimeout(function () {
            resultEditor.refresh();
            queryEditor.refresh();
        }, 1);

    });

});

function initCodeMirror(element) {
    return CodeMirror.fromTextArea(document.getElementById(element), {
        matchBrackets: true,
        lineNumbers: true,
        autoCloseBrackets: true,
        mode: "application/ld+json",
        lineWrapping: true
    });
}

function initCustomWindowButtons() {
    $("#close-window-button").on('click', function () {
        window.close();
    });
    $("#max-window-button").on('click',function () {
        if (chrome.app.window.current().isMaximized())
            chrome.app.window.current().restore();
        else
            chrome.app.window.current().maximize();

    });
    $("#min-window-button").on('click',function () {
        chrome.app.window.current().minimize();
    });
}
