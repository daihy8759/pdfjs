var url =
    'https://raffaelemorganti.github.io/pdf-viewer/external/pdfjs-2.1.266-dist/web/compressed.tracemonkey-pldi-09.pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc =
    'https://cdn.staticfile.org/pdf.js/2.4.456/pdf.worker.min.js';
pdfjsLib.cMapUrl = 'https://cdn.staticfile.org/pdf.js/2.4.456/cmaps/';
pdfjsLib.cMapPacked = true;

$(function () {
    $('#container').niceScroll({
        onscroll: function (x) {
            console.log(x);
        },
    });
});

var scale = 5;
var doc;

var loadingTask = pdfjsLib.getDocument(url);
loadingTask.promise.then(
    function (pdf) {
        doc = pdf;
        for (var i = 1; i < pdf.numPages + 1; i++) {
            $('#container').append(
                '<div class="page"><canvas id="view' + i + '"></canvas></div>'
            );
            renderPage(i);
        }
    },
    function (reason) {
        console.error(reason);
    }
);

function renderPage(pageNumber) {
    doc.getPage(pageNumber).then(function (page) {
        var viewport = page.getViewport({ scale: scale });

        // Prepare canvas using PDF page dimensions
        var canvas = document.getElementById('view' + pageNumber);
        var context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        // Render PDF page into canvas context
        var renderContext = {
            canvasContext: context,
            viewport: viewport,
        };
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            console.log('Page ' + pageNumber + ' rendered');
        });
    });
}
