function ScratchPanel(options){
    var container, canvas, ctx, img, endEvent, scratching, moveCount = 0, ready = false;

    options = options || {};

    var defaults = {
        elementId: "scratch-panel",
        threshold: 65,
        callback: null,
        readyCallback: null,
        foreground: "",
        background: "",
        crossOrigin: "",    // "anonymous" / "use-credentials"
        scratchSize: 40,
        enabled: true,
        backgroundLoadDelay: 300,
        autoResize: true
    };

    init();

    function init(){
        // add default values for any options not specified
        for (var key in defaults) {
            if (!options.hasOwnProperty(key)) {
                options[key] = defaults[key];
            }
        }

        setupCanvas();
        loadImages();
        addEventListeners();
        setupEndEvent();
    }

    function setupCanvas(){
        container = document.getElementById(options.elementId);
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");

        setCanvasSize();

        container.appendChild(canvas);
    }

    function setCanvasSize() {
        options.width = container.clientWidth;
        options.height = container.clientHeight;

        canvas.width = options.width;
        canvas.height = options.height;
    }

    function loadImages(){
        if (!options.foreground) return console.error("A foreground image must be specified");
        
        img = document.createElement("img");

        if (options.crossOrigin != ""){
            img.crossOrigin = options.crossOrigin;
        }

        img.src = options.foreground;

        img.onload = function(){
            drawScratchFront();

            if (options.background) {
                setTimeout(function(){
                    container.style.backgroundImage = "url('" + options.background + "')";
                    canvasReady();
                }, options.backgroundLoadDelay);
            } else {
                canvasReady();
            }
        }
    }

    function drawScratchFront() {
        ctx.drawImage(img, 0, 0, options.width, options.height);
    }

    function canvasReady(){
        ready = true;
        if (options.readyCallback) {
            options.readyCallback.apply(null);
        } 
    }

    function addEventListeners() {
        window.addEventListener("resize", resizeWindow);

        canvas.addEventListener("mousedown", down);
        canvas.addEventListener("mousemove", move);
        canvas.addEventListener("mouseup", up);

        canvas.addEventListener("touchstart", down);
        canvas.addEventListener("touchmove", move);
        canvas.addEventListener("touchend", up);
    }

    function setupEndEvent(){
        endEvent = once(function(){
            clear();
            window.removeEventListener("resize", resizeWindow);
            container.removeChild(canvas);
            if (options.callback){
                options.callback.apply(null);
            }
        });
    }

    // prevents a function being called more than once
    function once(func) {
        return function () {
            f = func;
            func = null;
            if (f != null){
                return f.apply(this, arguments);
            }
        };
    }

    function canScratch(){
        return (options.enabled && ready);
    }

    function down(e){
        if (!canScratch()) return;

        e.preventDefault();
        scratching = true;

        var pos = getEventPosition(e);

        ctx.globalCompositeOperation = 'destination-out';

        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        ctx.lineWidth = options.scratchSize;
        
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, (options.scratchSize / 2), 0, (Math.PI * 2), true);    
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    function move(e){
        if (!canScratch()) return;

        e.preventDefault();
        
        if (scratching){ 
            var pos = getEventPosition(e);
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();

            // we don't need to do this on every move, really helps with perf on some browsers
            if (moveCount % 5 === 0){
                if (getPercentScratched() >= options.threshold){
                    endEvent();
                }
            }
            moveCount++;
        }
    }

    function up(e){
        if (!canScratch()) return;

        e.preventDefault();

        scratching = false;
        ctx.closePath();
    }

    function clear(){
        ctx.clearRect(0, 0, options.width, options.height);
    }

    function getEventPosition(event){
        var canvasRect = event.target.getBoundingClientRect(); 

        if (event.clientX){ // mouse
            return {
                x: (event.clientX - canvasRect.left), 
                y: (event.clientY - canvasRect.top)
            };
        } else if (event.touches[0]) { // touch
            return {
                x: (event.touches[0].clientX - canvasRect.left), 
                y: (event.touches[0].clientY - canvasRect.top)
            };
        }
    }

    function getPercentScratched(){
        var imageData = ctx.getImageData(0, 0, options.width, options.height);

        var count = 0;
        var cleared = 0;

        for (var i = 0; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0 &&          // R
                imageData.data[i + 1] === 0 &&      // G
                imageData.data[i + 2] === 0 &&      // B
                imageData.data[i + 3] === 0){       // A
                    cleared += 1;
                }
            count += 1;
        }

        return cleared / count * 100;
    }

    function setOption(key, value){
        options[key] = value;
    }

    function getOption(key){
        return options[key];
    }

    function resizeWindow(e) {
        if (options.autoResize) {
            setCanvasSize();
            drawScratchFront();
        }
    }

    return {
        getPercentScratched: getPercentScratched,
        clear: clear,
        setOption: setOption,
        getOption: getOption
    };

}