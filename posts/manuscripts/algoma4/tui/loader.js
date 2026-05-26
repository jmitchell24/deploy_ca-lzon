const fitAddon = new FitAddon.FitAddon();

const term = new Terminal({
    convertEol: true,
    scrollback: 1000,
    cols: 150,
    allowTransparency: true,
    fontFamily: "'CourierPrime', monospace",
    fontSize: 14,
    fontWeight: '100',
    cursorBlink: true, 
    cursorStyle: 'underline',
    theme: { background: 'rgba(0,0,0,0)' }
});




term.loadAddon(fitAddon);
term.open(document.getElementById('terminal'));

try {
    var webglAddon = new WebglAddon.WebglAddon();
    webglAddon.onContextLoss(function () { webglAddon.dispose(); });
    term.loadAddon(webglAddon);
} catch (e) { console.warn('WebGL renderer unavailable, using default:', e); }

fitAddon.fit();
term.resize(300, term.rows);

window._termCols = 300;
window._termRows = term.rows;

window.addEventListener('resize', function () {
    // fitAddon.fit();
    // term.resize(300, term.rows);
    // window._termRows = term.rows;
});

var outputBuffer = [];
var flushScheduled = false;

function flushOutput() {
    if (outputBuffer.length > 0) {
        term.write(new Uint8Array(outputBuffer));
        outputBuffer = [];
    }
    flushScheduled = false;
}

window.Module = {
    preRun: [function () {
        FS.init(null, function (c) {
            if (c === null || c === undefined) {
                flushOutput();
            } else {
                outputBuffer.push(c);
                if (!flushScheduled) {
                    flushScheduled = true;
                    setTimeout(flushOutput, 0);
                }
            }
        });
    }],
    onRuntimeInitialized: function () {
        term.onData(function (data) {
            for (var i = 0; i < data.length; i++)
                Module.ccall('em_push_char', null, ['number'], [data.charCodeAt(i)]);
        });
    }
};

var s = document.createElement('script');
s.src = 'tui/algoma4.js';
document.head.appendChild(s);
