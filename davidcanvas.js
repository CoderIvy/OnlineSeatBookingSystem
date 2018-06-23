/* for-global
    window, Audio, clearInterval, clearTimeout, document, event, history, Image, location, name, navigator, Option, screen, setInterval, setTimeout, XMLHttpRequest
*/

/* global
    window, Audio, document, Image
*/

/* jshint browser: true */
/* jshint esversion: 6 */
/* jshint undef: true, freeze:true, latedef: true, maxerr: 5 */
/* jshint nonew: true, shadow: inner */
/* jshint eqeqeq: true, eqnull: true */

/* jshint unused: true */

/* canvas animation engine */

/* ------------------------- */

// shim layer with setInterval fallback
// from: http://jsfiddle.net/paul/rjbGw/3/
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function ( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            element = element;
            window.setInterval(callback, 1000 / 60);
        };
})();

// https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
function IsObject(val) {
    "use strict";
    if (val == null) { return false; }
    return ((typeof val === 'function') || (typeof val === 'object'));
}

//
function AttrClone(aBaseItem, aItem) {
    if (aBaseItem == null || aBaseItem === undefined) {
        return aItem;
    }

    if (aBaseItem.ID === aItem.ID) {
        aBaseItem.BaseClassEntity = null;
        aItem.BaseClassEntity = null;
        return aItem;
    }

    //
    if (IsObject(aBaseItem.BaseClassEntity)) {
        AttrClone(aBaseItem.BaseClassEntity, aBaseItem);
        aBaseItem.BaseClassEntity = null;
    }

    if (aItem == null) {
        aItem = {};
    }
    for (var k in aBaseItem) {
        // fastest test, or if (aItem[k]) {}
        if (aItem[k] !== undefined) {
            continue;
        }
        aItem[k] = aBaseItem[k];
    }
    aItem.BaseClassEntity = null;
    return aItem;
}

/* for random id */
function uuidv4() {
    "use strict";
    var initid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
    return initid.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//
function GetContainerMeta(thediv) {
    var metaInfo = {
        W: -1,
        H: -1,
    };
    var elm = thediv.parentNode;
    while (elm) {
        if (elm.clientWidth > 0 && elm.clientHeight > 0) {
            metaInfo.W = elm.clientWidth;
            metaInfo.H = elm.clientHeight;
            return metaInfo;
        }
        elm = elm.parentNode;
    }
    return metaInfo;
}

// https://stackoverflow.com/questions/36803176/how-to-prevent-the-play-request-was-interrupted-by-a-call-to-pause-error
function IsMediaPlaying(media) {
    "use strict";
    if (IsObject(media) === false) {
        return false;
    }
    if (media.currentTime > 0 && media.paused !== true && media.ended !== true && media.readyState > 2) {
        return true;
    }
    return false;
}

// generate a random color and provide the minimum brightness
// https://stackoverflow.com/questions/1152024/best-way-to-generate-a-random-color-in-javascript
function RandomColor(brightness) {
    "use strict";

    function randomChannel(brightness) {
        var r = 255 - brightness;
        var n = 0 | ((Math.random() * r) + brightness);
        var s = n.toString(16);
        return (s.length === 1) ? '0' + s : s;
    }
    return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

// https://stackoverflow.com/questions/3820381/need-a-basename-function-in-javascript
function Basename(path) {
    return path.split(/[\\/]/).pop();
}


// dummy items for the engine.
function DummyItem(id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "dummy-" + uuidv4() + "-" + Date.now();
    }
    var aItem = this;

    // type of item
    aItem.ItemType = "dummy";
    aItem.ItemSubType = "none";

    aItem.ID = id;

    aItem.EnableKMEvents = false;

    aItem.Visible = false;

    return aItem;
}

// 
DummyItem.prototype.OnDefaultSizeEvent = function (aEng) {
    // window.console.log("Dummy.OnDefaultSizeEvent: event = " + aEng.Event);
    aEng.UNUSED();
};

// 
DummyItem.prototype.AddItem = function (a2Item, layerIndex, aEng) {
    var aItem = this;
    a2Item.MasterItem = aItem;
    aEng.SetLayerIndex(a2Item, layerIndex);
};

// 
DummyItem.prototype.RemoveItem = function (a2Item, aEng) {
    aEng.RemoveItem(a2Item);
};

// 
DummyItem.prototype.Refresh = function (aEng) {
    aEng.ReDraw();
};

// end of DummyItem

// return an new BlockItem for canvas box.
// this is a template to create items for the Engine.
function BlockItem(x, y, w, h, color, alpha, id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "block-" + uuidv4() + "-" + Date.now();
    }

    var aItem = this;

    // type of item
    aItem.ItemType = "block";
    aItem.ItemSubType = "none";
    aItem.ID = id;
    // text show on block
    aItem.BlockText = null;

    aItem.X = x;
    aItem.Y = y;
    aItem.W = w;
    aItem.H = h;

    aItem.ConfX = x;
    aItem.ConfY = y;

    aItem.ConfW = w;
    aItem.ConfH = h;

    if (color == null) {
        color = "black";
    }

    if (alpha == null || alpha > 1 || alpha < 0) {
        alpha = 1;
    }

    aItem.Alpha = alpha; // 0 - 1
    aItem.Color = color; // 255, 0, 0

    aItem.ts = Date.now();
    aItem.PX = -1;
    aItem.PY = -1;
    aItem.DrawCount = 0;

    // by default, enable events for Block
    aItem.EnableKMEvents = true;

    //
    aItem.CrossBorder = false;

    return aItem;
}

//
BlockItem.prototype.SetAlpha = function (alpha) {
    var aItem = this;
    var CurID = this.ID;
    CurID = CurID;

    if (alpha > 1 || alpha < 0) {
        window.console.log("BlockItem.prototype.SetAlpha: invalid alpha([0 - 1]): " + alpha);
        return;
    }
    aItem.Alpha = alpha;
};

//
BlockItem.prototype.SetYOffset = function (yoffset, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aItem.ConfYOffset = yoffset;
    aItem.YOffset = aItem.ConfYOffset * aEng.PercentY;
};

//
BlockItem.prototype.EventsSwitch = function (onoff) {
    var aItem = this;
    aItem.EnableKMEvents = onoff;
};

// end of BlockItem

// the container class to hold rectItem.
function CanvasEngine(divid, x, y, w, h, bgcolor, bordercolor, auxdiv, auxbgcolor) {
    "use strict";
    /* jshint validthis: true */

    var aEng = this;

    var thediv = null;
    if (IsObject(divid)) {
        thediv = divid;
    } else {
        if (divid == null) {
            window.alert("Invalid div ID for initial Engine: " + divid);
            return null;
        }
        thediv = document.getElementById(divid);
        if (thediv == null) {
            window.alert("Can not getElementById for initial Engine: " + divid);
            return null;
        }
    }

    // my parent
    aEng.parent = thediv;

    if (auxdiv != null) {
        if (IsObject(auxdiv)) {
            thediv = auxdiv;
        } else {
            thediv = document.getElementById(auxdiv);
            if (thediv == null) {
                window.alert("Can not getElementById for initial Engine(auxdiv): " + auxdiv);
                return null;
            }
        }
        aEng.auxparent = thediv;
    } else {
        aEng.auxparent = null;
    }

    aEng.X = x;
    aEng.Y = y;
    aEng.ConfW = w;
    aEng.ConfH = h;

    aEng.BackgroundColor = bgcolor;
    aEng.BorderColor = bordercolor;

    aEng.BorderSize = 0;

    // the cavas object in page
    aEng.Canvas = null;
    aEng.AuxCanvas = null;

    // the timer for user key press
    aEng.frameTimer = null;

    // frame update time stamp
    aEng.FrameTs = Date.now();

    aEng.ActiveTs = aEng.FrameTs;

    aEng.SecondTs = aEng.FrameTs;

    aEng.CoursorTs = aEng.FrameTs;

    aEng.ResizeTs = aEng.FrameTs;

    // screen align
    aEng.screenAlignTs = 0;

    // my uuid
    aEng.ID = "CanvasEngine-" + Date.now() + uuidv4();

    // items in this canvas
    aEng.items = new Map();

    aEng.layerList = new Map();

    aEng.unknowTypes = new Map();

    // 
    aEng.itemCount = 0;

    aEng.FrameCount = 0;

    aEng.EngineStartTs = 0;

    aEng.EngineDuration = 0;

    aEng.EngineFPS = 0;

    aEng.eventFreeze = false;

    // user pressing key
    aEng.keyPressed = false;

    // user pressing mouse
    aEng.MouseDown = false;
    aEng.MouseUp = false;

    // save pressed keycode
    aEng.PressedKeys = [];

    // initial to true
    aEng.globalDrawPending = true;

    // sounds
    aEng.Sounds = new Map();

    // background images
    aEng.Images = new Map();

    // name of sound that user playing
    aEng.userPlaying = new Map();

    // name of sound that npc playing
    aEng.npcPlaying = new Map();

    // canvas X,Y in the screen
    aEng.ScreenX = 0;
    aEng.ScreenY = 0;

    aEng.ScreenPreX = 0;
    aEng.ScreenPreY = 0;

    // mouse X,Y in the screen
    aEng.MouseRelativeX = 0;
    aEng.MouseRelativeY = 0;

    // mouse X,Y in the screen
    aEng.MousePreX = -1;
    aEng.MousePreY = -1;

    //
    aEng.onKMItems = new Map();

    //
    aEng.playing = [];
    aEng.playing.name = "";
    aEng.playing.priority = 0;

    // initial engine

    // create canvas object in div
    aEng.Canvas = document.createElement("CANVAS");

    aEng.Canvas.canvasID = "mainCanvas";

    aEng.AuxCanvas = document.createElement("CANVAS");

    aEng.AuxCanvas.canvasID = "auxCanvas";

    aEng.auxdiv = auxdiv;

    aEng.AuxBackgroundColor = auxbgcolor;

    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
    aEng.CTX2d = aEng.Canvas.getContext("2d");
    aEng.CTXwebgl = aEng.Canvas.getContext("webgl");
    aEng.CTXwebgl2 = aEng.Canvas.getContext("webgl2");
    aEng.CTXbitmaprenderer = aEng.Canvas.getContext("bitmaprenderer");


    aEng.AuxCTX2d = aEng.AuxCanvas.getContext("2d");
    aEng.AuxCTXwebgl = aEng.AuxCanvas.getContext("webgl");
    aEng.AuxCTXwebgl2 = aEng.AuxCanvas.getContext("webgl2");
    aEng.AuxCTXbitmaprenderer = aEng.AuxCanvas.getContext("bitmaprenderer");

    if (document.body.style.cursor === "") {
        document.body.style.cursor = "default";
    }
    aEng.CoursorStyle = document.body.style.cursor;

    aEng.CoursorOrigStyle = document.body.style.cursor;

    aEng.NewCoursorStyle = true;

    // default to no scale
    aEng.PercentX = 1;
    aEng.PercentY = 1;

    aEng.started = false;

    aEng.TextYOffset = 0;
    aEng.TextXOffset = 0;

    aEng.ApplyResize();

    // basic sound
    var soundlist = {
        successful1s: "sounds/successful1s.mp3",
        stun2s: "sounds/stun2s.mp3",
        notice2s: "sounds/notice2s.mp3",
        happyEat3s: "sounds/happyEat3s.mp3",
        error2s: "sounds/error2s.mp3",
    };

    for (var sname in soundlist) {
        aEng.LoadSound(sname, soundlist[sname]);
    }

    return aEng;
}

//
CanvasEngine.prototype.IsManagedItem = function (aItem) {
    var aEng = this;
    if (!(aItem.ID)) {
        return false;
    }
    return aEng.items.has(aItem.ID);
};

//
CanvasEngine.prototype.scaleDetect = function () {
    var aEng = this;

    //
    aEng.setupDiv(aEng.Canvas, aEng.parent, aEng.BackgroundColor);

    if (aEng.ConfW <= 0) {
        aEng.W = GetContainerMeta(aEng.parent).W;
    } else {
        aEng.W = aEng.ConfW;
    }
    if (aEng.ConfH <= 0) {
        aEng.H = GetContainerMeta(aEng.parent).H;
    } else {
        aEng.H = aEng.ConfH;
    }

    if (aEng.auxparent != null) {
        aEng.setupDiv(aEng.AuxCanvas, aEng.auxparent, aEng.AuxBackgroundColor);
    }

    // setup scale factor base on vw/vh

    aEng.AuxCanvas.width = aEng.W;
    aEng.AuxCanvas.height = aEng.H;

    aEng.PercentW = 100;
    aEng.PercentH = 100;

    aEng.PercentX = aEng.W / aEng.PercentW;
    aEng.PercentY = aEng.H / aEng.PercentH;

    var text = 'M';
    var fontWithSize = "100px Courier New";
    var baseline = "top";
    var oxy = aEng.GetTextOffsets(text, fontWithSize, baseline);
    aEng.TextYOffset = oxy.Y;
    aEng.TextXOffset = oxy.X;

};

//
CanvasEngine.prototype.ImageData2Array = function (imageData, x, y, w) {
    var aEng = this;

    aEng.UNUSED();

    var imageArray = [
        [
            []
        ]
    ];
    var p0 = 0;
    var ax = 0;
    var ay = 0;
    var seq = 0;
    for (p0 = 0; p0 < imageData.data.length; p0 += 4) {
        seq = p0 / 4;
        ay = Math.ceil(seq / w);
        ax = (seq % w);
        if (imageArray[ay] == null) {
            imageArray[ay] = [];
            imageArray[ay][ax] = [];
        }
        for (var k = 0; k < 4; k++) {
            imageArray[ay][ax][k] = imageData.data[p0 + k];
        }
    }
    return imageArray;
};

//
CanvasEngine.prototype.GetTextOffsets = function (text, fontWithSize, baseline) {
    var aEng = this;

    aEng.AuxCanvas.width = aEng.W;
    aEng.AuxCanvas.height = aEng.H;
    aEng.ClearAuxCanvas();

    var x = 0,
        y = 0,
        w = 0,
        h = 0;

    var tsize = aEng.AuxGetTextSize(text, fontWithSize, baseline);
    w = tsize.W;
    h = tsize.H;

    var auxw = w * 3;
    var auxh = h * 3;

    aEng.AuxCanvas.width = auxw;
    aEng.AuxCanvas.height = auxh;

    aEng.DrawAuxText(text, fontWithSize, "orig", w, h, auxw, auxh, "red", 1, baseline);

    var imageData = aEng.GetAuxCanvasData(x, y, auxw, auxh);

    // w = 114 h = 114, total 51984 = 114 * 114 * 4
    var ax = 0;
    var ay = 0;
    var seq = 0;
    var xmin = -1;
    var xmax = -1;
    var ymin = -1;
    var ymax = -1;

    for (var p = 0; p < imageData.data.length; p += 4) {
        var p0 = p + 0;
        var p1 = p + 1;
        var p2 = p + 2;
        var p3 = p + 3;

        seq = p0 / 4;
        ay = Math.ceil(seq / auxw);
        ax = (seq % auxw);

        // p0 is red, 255 is full red
        if (imageData.data[p0] === 255) {
            imageData.data[p0] = 0;
            imageData.data[p1] = 255;
            if (xmin === -1 || ax < xmin) {
                xmin = ax;
            }
            if (xmax === -1 || ax > xmax) {
                xmax = ax;
            }
            if (ymin === -1 || ay < ymin) {
                ymin = ay;
            }
            if (ymax === -1 || ay > ymax) {
                ymax = ay;
            }
        } else {
            imageData.data[p0] = 0;
            imageData.data[p1] = 0;
            imageData.data[p2] = 0;
            imageData.data[p3] = 0;
        }
    }

    var xoffset = (auxw / 2) - (((xmax - xmin) / 2) + xmin);
    var yoffset = (auxh / 2) - (((ymax - ymin) / 2) + ymin);

    var oxy = {
        X: xoffset / w,
        Y: yoffset / h,
    };

    return oxy;
};

//
CanvasEngine.prototype.DrawAuxCross = function (x, y, w, h, color) {
    var aEng = this;

    if (w === 0) {
        w = aEng.AuxCanvas.width;
    }
    if (h === 0) {
        h = aEng.AuxCanvas.height;
    }

    var ctx = aEng.AuxCTX2d;

    if (color == null) {
        color = aEng.RandomColor(1);
    }

    ctx.strokeStyle = color;

    var mx = x + (w / 2);
    var my = y + (h / 2);

    ctx.moveTo(mx, y);
    ctx.lineTo(mx, y + h);
    ctx.moveTo(x, my);
    ctx.lineTo(x + w, my);
    ctx.stroke();

};

//
CanvasEngine.prototype.DrawAuxBox = function (x, y, w, h, color) {
    var aEng = this;

    if (w === 0) {
        w = aEng.AuxCanvas.width;
    }
    if (h === 0) {
        h = aEng.AuxCanvas.height;
    }

    var ctx = aEng.AuxCTX2d;

    if (color == null) {
        color = aEng.RandomColor(1);
    }

    ctx.strokeStyle = color;

    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.stroke();

};

//
CanvasEngine.prototype.DrawAuxXLine = function (x, y, w, h, color) {
    var aEng = this;

    if (w === 0) {
        w = aEng.AuxCanvas.width;
    }
    if (h === 0) {
        h = aEng.AuxCanvas.height;
    }

    var ctx = aEng.AuxCTX2d;

    if (color == null) {
        color = aEng.RandomColor(1);
    }

    ctx.strokeStyle = color;

    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.moveTo(x + w, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();

};

//
CanvasEngine.prototype.DrawAuxImage = function (aImage, x, y, w, h, alpha, drawStyle) {
    var aEng = this;

    if (aImage.W < 0 || aImage.H < 0) {
        return;
    }
    var ctx = aEng.AuxCTX2d;

    var scale = 0;

    if (drawStyle === "fitdiv") {
        if (w > aEng.W) {
            scale = aEng.W / w;
            w = aEng.W;
            h = h * scale;
        }
        if (h > aEng.H) {
            scale = aEng.H / h;
            h = aEng.H;
            w = w * scale;
        }
    } else if (drawStyle === "fitsrc") {
        w = aImage.W;
        h = aImage.H;
    }

    aEng.AuxCanvas.width = w;
    aEng.AuxCanvas.height = h;

    var preglobalAlpha = ctx.globalAlpha;
    preglobalAlpha = ctx.globalAlpha;
    if (alpha != null) {
        ctx.globalAlpha = alpha;
    }
    ctx.drawImage(aImage, x, y, w, h);
    ctx.globalAlpha = preglobalAlpha;
};

//
CanvasEngine.prototype.DrawAuxText = function (text, fontWithSize, drawStyle, x, y, w, h, color, alpha, baseline) {
    var aEng = this;

    var ctx = aEng.AuxCTX2d;

    var preglobalAlpha = ctx.globalAlpha;
    preglobalAlpha = ctx.globalAlpha;
    if (alpha != null) {
        ctx.globalAlpha = alpha;
    }
    var scale = 0;

    if (baseline == null) {
        baseline = "top";
    }
    if (fontWithSize == null) {
        fontWithSize = "1vw Courier New";
    }

    if (drawStyle === "fitdiv") {
        if (w > aEng.W) {
            scale = aEng.W / w;
            w = aEng.W;
            h = h * scale;
        }
        if (h > aEng.H) {
            scale = aEng.H / h;
            h = aEng.H;
            w = w * scale;
        }
    } else if (drawStyle === "fitsrc") {
        if (w === 0 || h === 0) {
            var tsize = aEng.AuxGetTextSize(text, fontWithSize, baseline);
            w = tsize.W;
            h = tsize.H;
        }
    }

    if (baseline == null) {
        baseline = "top";
    }

    ctx.textBaseline = baseline;

    // NOTE: MUST RESET ctx.font after aEng.AuxCanvas.width/aEng.AuxCanvas.height changed
    ctx.font = fontWithSize;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    ctx.globalAlpha = preglobalAlpha;
};

//
CanvasEngine.prototype.AuxGetTextSize = function (text, font, baseline) {
    var aEng = this;

    var ctx = aEng.AuxCTX2d;

    aEng.AuxCanvas.width = aEng.W;
    aEng.AuxCanvas.height = aEng.H;

    if (baseline == null) {
        baseline = "top";
    }
    if (font == null) {
        font = "1vw Courier New";
    }
    ctx.textBaseline = baseline;

    // NOTE: MUST RESET ctx.font after aEng.AuxCanvas.width/aEng.AuxCanvas.height changed
    ctx.font = font;

    var w = ctx.measureText(text).width;
    // how about font size by vh/vw
    // 'M' is better then 'X'
    var h = ctx.measureText('M').width;

    return {
        W: Math.round(w),
        H: Math.round(h),
    };
};


//
CanvasEngine.prototype.DivHide = function (initdivelm) {
    var aEng = this;
    if (!(initdivelm)) {
        return;
    }

    if (!(initdivelm.getElementsByTagName)) {
        return;
    }

    var childDivs = initdivelm.childNodes;
    var elm = null;
    for (var i = 0; i < childDivs.length; i++) {
        elm = childDivs[i];
        if (elm.nodeName !== "DIV") {
            continue;
        }
        if (elm.style) {
            if (elm.style.display !== "none") {
                window.console.log("warning: DivHide, change element " + elm.nodeName + ": " + elm.className + "#" + elm.id + " style.display to none.");
                elm.style.display = "none";
            }
        }
        aEng.DivHide(elm);
    }
    elm = initdivelm;
    if (elm.style) {
        if (elm.style.display !== "none") {
            window.console.log("warning: DivHide, change element " + elm.nodeName + ": " + elm.className + "#" + elm.id + " style.display to none.");
            elm.style.display = "none";
        }
    }

    return;
};

//
CanvasEngine.prototype.DivHideAll = function () {
    var aEng = this;
    aEng.DivHide(aEng.parent);
    aEng.DivHide(aEng.auxparent);
    return;
};

//
CanvasEngine.prototype.Hide = function () {
    var aEng = this;
    aEng.Visible = false;
    aEng.DivHideAll();
};

//
CanvasEngine.prototype.Show = function (force) {
    var aEng = this;
    aEng.Visible = true;
    aEng.ApplyResize(force);
};

//
CanvasEngine.prototype.ApplyResize = function (force) {
    var aEng = this;

    if (aEng.Visible === false) {
        return;
    }

    aEng.alignScreenXY(true);

    aEng.scaleDetect();

    var resized = false;
    if (aEng.W === aEng.preW && aEng.H === aEng.preH) {
        if (force !== true) {
            return;
        }
    } else {
        resized = true;
    }

    if (resized === true) {
        aEng.preW = aEng.W;
        aEng.preH = aEng.H;

        aEng.Canvas.width = aEng.W;
        aEng.Canvas.height = aEng.H;

        // limited
        aEng.XBorderLimit = aEng.X + aEng.W;
        aEng.YBorderLimit = aEng.Y + aEng.H;

        aEng.setupDiv(aEng.Canvas, aEng.parent, aEng.BackgroundColor);


        if (aEng.auxparent != null) {
            // default canvas w,h, will change by DrawAux*
            aEng.AuxCanvas.width = aEng.W;
            aEng.AuxCanvas.height = aEng.H;
            //
            aEng.auxparent.style.width = aEng.W + "px";
            aEng.auxparent.style.height = aEng.H + "px";

            aEng.setupDiv(aEng.AuxCanvas, aEng.auxparent, aEng.AuxBackgroundColor);
        }
    }

    aEng.resizeAllItems();

};


//
CanvasEngine.prototype.UNUSED = function () {
    // var holder
};

//
CanvasEngine.prototype.GetContainerMeta = function (thediv) {
    return GetContainerMeta(thediv);
};

//
CanvasEngine.prototype.IsMediaPlaying = function (media) {
    return IsMediaPlaying(media);
};

//
CanvasEngine.prototype.IsObject = function (obj) {
    return IsObject(obj);
};

//
CanvasEngine.prototype.RandomColor = function (brightness) {
    return RandomColor(brightness);
};

// clear all children in a container
CanvasEngine.prototype.ClearAllChildren = function (obj) {
    while (obj.lastChild) {
        obj.removeChild(obj.lastChild);
    }
};

//
CanvasEngine.prototype.AttrClone = function (aBaseItem, aItem) {
    var aEng = this;
    aEng.UNUSED();

    if (aBaseItem == null || aBaseItem === undefined) {
        return aItem;
    }

    if (aBaseItem.ID === aItem.ID) {
        aBaseItem.BaseClassEntity = null;
        aItem.BaseClassEntity = null;
        return aItem;
    }

    //
    if (IsObject(aBaseItem.BaseClassEntity)) {
        AttrClone(aBaseItem.BaseClassEntity, aBaseItem);
        aBaseItem.BaseClassEntity = null;
    }
    AttrClone(aBaseItem, aItem);

    return aItem;
};

//
CanvasEngine.prototype.ShowDiv = function (thediv) {

    var elm = thediv;
    while (elm) {
        if (elm.style) {
            if (elm.style.display === "" || elm.style.display === "none") {
                window.console.log("warning: ShowDiv, change element " + elm.nodeName + ": " + elm.className + "#" + elm.id + " style.display to flex.");
                elm.style.display = "flex";
            }
        }
        elm = elm.parentNode;
        if (elm == null) {
            break;
        }
        if (elm.nodeName !== "DIV") {
            continue;
        }
        if (elm.nodeName == null) {
            break;
        }
        if (elm.nodeName === "BODY") {
            break;
        }
    }
};

//
CanvasEngine.prototype.setupDiv = function (thecanvas, thediv, BackgroundColor) {
    var aEng = this;

    aEng.ShowDiv(thediv);

    thediv.style.display = "flex";
    thediv.style.justifyContent = "center";
    thediv.style.alignItems = "flex-start";
    thediv.style.padding = "0px";
    thediv.style.margin = "0px";

    if (BackgroundColor != null) {
        thecanvas.style.backgroundColor = BackgroundColor;
    }

    if (aEng.BorderColor != null) {
        if (aEng.ConfW <= 0 || aEng.ConfH <= 0) {
            // note: set border to div container
            thediv.style.border = aEng.BorderSize + "px solid " + aEng.BorderColor;
        } else {
            thecanvas.style.border = aEng.BorderSize + "px solid " + aEng.BorderColor;
        }
    }

    // this is initial, clear first
    aEng.ClearAllChildren(thediv);

    // insert into div
    thediv.appendChild(thecanvas);

};

//
CanvasEngine.prototype.ApplyItemScale = function (aItem, force) {
    var aEng = this;

    if (aItem.Visible === false) {
        return;
    }
    if (force !== true && aEng.items.has(aItem.ID) === false) {
        // deleted
        return;
    }

    aItem.ScaleApplied = true;

    if (aItem.ItemType === "text") {
        aEng.GetTextSize(aItem);
    }

    if (aItem.ItemSubType === "apple") {
        aItem.ItemType = aItem.ItemType;
    }

    //
    aItem.X = aItem.ConfX * aEng.PercentX;
    aItem.Y = aItem.ConfY * aEng.PercentY;

    //
    aItem.W = aItem.ConfW * aEng.PercentX;
    aItem.H = aItem.ConfH * aEng.PercentY;

    // auto w/h
    if (aItem.ConfW === 0) {
        aItem.W = aItem.H;
    }

    if (aItem.ConfH === 0) {
        aItem.H = aItem.W;
    }

    if (aItem.aImage != null) {
        aEng.AutoScaleImage(aItem);
    }

    aEng.ApplyBorderLimit(aItem);

    if (aItem.PreScaleX !== aItem.X ||
        aItem.PreScaleY !== aItem.Y ||
        aItem.PreScaleW !== aItem.W ||
        aItem.PreScaleH !== aItem.H
    ) {
        aEng.ReDraw();
    }

    aItem.PreScaleX = aItem.X;
    aItem.PreScaleY = aItem.Y;

    aItem.PreScaleW = aItem.W;
    aItem.PreScaleH = aItem.H;

};

//
CanvasEngine.prototype.GetTextItemOffsets = function (aItem) {
    var aEng = this;

    var oxy = {
        X: 0,
        Y: 0,
    };

    var xoffset = aItem.ConfXOffset * aItem.W;

    var yoffset = aItem.ConfYOffset * aItem.H;

    var engTextXOffset = (aEng.TextXOffset * aItem.W);

    var engTextYOffset = (aEng.TextYOffset * aItem.H);

    oxy.X += (xoffset + engTextXOffset);
    oxy.Y += (yoffset + engTextYOffset);

    return oxy;
};

//
CanvasEngine.prototype.ResizeAndScaleItem = function (aItem, force) {
    var aEng = this;
    if (aItem.Visible === false) {
        return;
    }
    if (force !== true && aEng.items.has(aItem.ID) === false) {
        // deleted
        return;
    }
    if (typeof aItem.OnDefaultSizeEvent === 'function') {
        aItem.OnDefaultSizeEvent(aEng);
    }
    if ((typeof aItem.OnPreSizeEvent === 'function')) {
        aItem.OnPreSizeEvent(aEng);
    }
    if ((typeof aItem.OnSizeEvent === 'function')) {
        aItem.OnSizeEvent(aEng);
    }
    aEng.ApplyItemScale(aItem, force);
    if ((typeof aItem.OnPostSizeEvent === 'function')) {
        aItem.OnPostSizeEvent(aEng);
    }
};

//
CanvasEngine.prototype.resizeAllItems = function () {
    var aEng = this;

    // take a snapshot of items
    var itemlist = aEng.items.values();
    for (var aItem of itemlist) {
        aEng.ResizeAndScaleItem(aItem);
    }
};

//
CanvasEngine.prototype.LoadSound = function (name, url) {
    var aEng = this;

    if (name === "") {
        window.alert("LoadSound: null name");
        return false;
    }
    if (url === "") {
        window.alert("LoadSound: null url");
        return false;
    }
    var snd = new Audio(url);
    snd.load();
    snd.autoload = true;
    snd.preload = true;
    try {
        snd.play();
    } catch (e) {
        window.alert("can not load sound: " + name + ", " + url + ", error: " + e.toString());
        return false;
    }
    snd.pause();
    snd.currentTime = 0;
    aEng.Sounds.set(name, snd);
    return true;
};

//
CanvasEngine.prototype.GetImage = function (url) {
    var aEng = this;

    var img = aEng.Images.get(url);
    if (img === undefined) {
        return null;
    }
    return img;
};

//
CanvasEngine.prototype.LoadImage = function (url, aItem, logging) {
    var aEng = this;

    if (url == null) {
        window.alert("LoadImage: null url");
        return;
    }
    var img = new Image();

    img.W = -1;
    img.H = -1;
    img.Url = url;
    if (logging) {
        window.console.log("LoadImage: " + url + " ...");
    }

    return aEng.postImageInfo(aItem, img, url, logging);
};

//
CanvasEngine.prototype.SetSoundVolume = function (name, volume) {
    var aEng = this;

    var tsnd = aEng.Sounds.get(name);
    if (tsnd === undefined) {
        window.console.log("SetSoundVolume: " + name + " not found");
        return false;
    }
    tsnd.volume = volume;
    return true;
};

//
CanvasEngine.prototype.GetAllItems = function (itemType, subType) {
    var aEng = this;
    var items = new Map();
    // take a snapshot of items
    var itemlist = aEng.items.values();
    for (var aItem of itemlist) {
        if (itemType != null && aItem.ItemType !== itemType) {
            continue;
        }
        if (subType != null && aItem.ItemSubType !== subType) {
            continue;
        }
        items.set(aItem.ID, aItem);
    }

    return items;
};

//
CanvasEngine.prototype.GetAllSounds = function () {
    var aEng = this;

    return aEng.Sounds;
};

//
CanvasEngine.prototype.GetSound = function (name) {
    var aEng = this;

    var tsnd = aEng.Sounds.get(name);
    if (tsnd === undefined) {
        window.alert("GetSound: " + name + " not found");
    }
    return tsnd;
};

// play sound base on priority
CanvasEngine.prototype.PlaySound = function (name, priority, miniTime, currentTime) {
    var aEng = this;

    var tsnd = aEng.Sounds.get(name);
    if (tsnd === undefined) {
        window.alert("playSound: " + name + " not found");
        return false;
    }

    // is any other is playing with higher priority?
    var snd = aEng.Sounds.get(aEng.playing.name);
    if (snd !== undefined) {
        if (IsMediaPlaying(snd) === true) {
            // -127 is background music
            if (priority === -127) {
                return false;
            }
            if (aEng.playing.priority > priority && snd.currentTime < aEng.playing.miniTime) {
                return false;
            }
            if (aEng.playing.priority === priority && snd.currentTime < 0.02) {
                return false;
            }
            // -127 is background music
            if (aEng.playing.priority === -127) {
                snd.volume = 0;
            }
            snd.pause();
        }
    }
    snd = tsnd;

    if (miniTime === undefined || miniTime <= 0) {
        miniTime = 0.1;
    }

    if (priority === undefined || priority <= -127) {
        miniTime = -127;
    }

    aEng.playing.name = name;
    aEng.playing.miniTime = miniTime;
    aEng.playing.priority = priority;

    // play
    if (currentTime === undefined || currentTime <= 0) {
        snd.currentTime = 0;
    } else {
        snd.currentTime = currentTime;
    }
    snd.play();
    return true;
};

//
CanvasEngine.prototype.DoItemInit = function (aItem) {
    var aEng = this;

    if (aItem == null) {
        return;
    }

    if (aItem.ID == null) {
        if (typeof aItem === 'object') {
            aItem.ID = Date.now() + "-" + uuidv4();
            window.console.log("setup random aItem.ID: " + aItem.ID);
        } else {
            window.alert("DoItemInit: can not init " + aItem + ", not an object");
            return;
        }
    }

    if (aItem.OnInited === true) {
        return;
    }

    if (aItem.ItemType === undefined) {
        window.console.log("set undefined aItem.ItemType to dummy: " + aItem.ID);
        aItem.ItemType = "dummy";
    }

    if (aItem.ItemSubType === undefined) {
        aItem.ItemSubType = "none";
    }

    // BaseClassEntity is not null or undefined
    if (aItem.BaseClassEntity != null && aItem.BaseClassEntity !== undefined) {
        AttrClone(aItem.BaseClassEntity, aItem);
        aItem.BaseClassEntity = null;
    }
    // OnInit is not null
    if (aItem.OnInit !== null) {
        if (typeof aItem.OnDefaultInit === 'function') {
            if (aItem.OnDefaultInit(aEng) === false) {
                // do not add if init failed.
                return;
            }
        }
        if (typeof aItem.OnInit === 'function') {
            if (aItem.OnInit(aEng) === false) {
                // do not add if init failed.
                return;
            }
        }
    }
    aItem.OnInited = true;

    // basic attributes
    if (aItem.LayerIndex === undefined) {
        // Z-Index, smaller in the bottom
        aItem.LayerIndex = 0;
    }
    if (aItem.Speed === undefined) {
        aItem.Speed = 0;
    }
    if (aItem.ConfX === undefined) {
        aItem.ConfX = 0;
    }
    if (aItem.ConfY === undefined) {
        aItem.ConfY = 0;
    }
    if (aItem.ConfW === undefined) {
        aItem.ConfW = 0;
    }
    if (aItem.ConfH === undefined) {
        aItem.ConfH = 0;
    }

    if (aItem.CoursorStyle === undefined) {
        aEng.SetCoursorStyle(aItem, null);
    }
};

//
CanvasEngine.prototype.AddItem = function (aItem) {
    var aEng = this;

    if (aItem == null) {
        return;
    }

    if (aItem.ID == null) {
        if (typeof aItem === 'object') {
            aItem.ID = Date.now() + "-" + uuidv4();
        } else {
            window.alert("AddItem: can not add " + aItem + ", not an object");
            return;
        }
    }

    if (aEng.eventFreeze === true) {
        window.alert("AddItem: should not call add/remove item during eventLoop.");
        window.console.log("AddItem: should not call add/remove item during eventLoop.");
        return;
    }

    var itemID = aItem.ID;
    var aZmap = null;

    if (aEng.items.has(itemID) === true) {
        aEng.RemoveItem(aItem);
    }

    aEng.DoItemInit(aItem);

    if (aItem.EnableKMEvents !== false) {
        aEng.onKMItems.set(itemID, aItem);
    }

    aZmap = aEng.layerList.get(aItem.LayerIndex);
    if (aZmap === undefined) {
        aZmap = new Map();
    }
    aZmap.set(itemID, aItem);
    aEng.layerList.set(aItem.LayerIndex, aZmap);

    aEng.items.set(itemID, aItem);

    aEng.ResizeAndScaleItem(aItem, true);

    aEng.ReDraw();
};

//
CanvasEngine.prototype.SetLayerIndex = function (aItem, layerIndex) {
    var aEng = this;

    // remove befor set LayerIndex
    aEng.RemoveItem(aItem);
    aItem.LayerIndex = layerIndex;
    aEng.AddItem(aItem);
};

//
CanvasEngine.prototype.RemoveItem = function (aItem) {
    var aEng = this;

    if (aEng.eventFreeze === true) {
        window.alert("RemoveItem: should not call add/remove item during eventLoop.");
        window.console.log("RemoveItem: should not call add/remove item during eventLoop.");
        return;
    }
    if (typeof aItem.ID === undefined) {
        window.console.log("RemoveItem: null itemID: " + aItem);
        return;
    }

    var itemID = aItem.ID;
    if (aEng.items.has(itemID) === false) {
        return;
    }

    if (typeof aItem.OnPreRemove === "function") {
        aItem.OnPreRemove(aEng);
    }

    var aZmap = aEng.layerList.get(aItem.LayerIndex);
    if (aZmap !== undefined) {
        aZmap.delete(itemID);
        aEng.layerList.set(aItem.LayerIndex, aZmap);
    }

    aEng.items.delete(itemID);

    //
    aEng.onKMItems.delete(itemID);

    if (typeof aItem.OnPostRemove === "function") {
        aItem.OnPostRemove(aEng);
    }

    aEng.ReDraw();
};

// initial/draw a canvas object in page,
CanvasEngine.prototype.ReDraw = function () {
    var aEng = this;

    aEng.globalDrawPending = true;
};

//
CanvasEngine.prototype.eventLoop = function () {
    var aEng = this;

    // aEng.eventFreeze = true;

    aEng.frameEvent();

    if ((aEng.FrameTs - aEng.SecondTs) > 1000) {
        aEng.SecondTs = aEng.FrameTs;
        aEng.secondEvent();
    }

    // 60 for 15 fps
    if ((aEng.FrameTs - aEng.ResizeTs) > 500) {
        aEng.ResizeTs = aEng.FrameTs;
        if (aEng.ResizeEvent !== null) {
            aEng.ApplyResize();
            aEng.ResizeEvent = null;
        }
    }

    // 60 for 15 fps
    if ((aEng.FrameTs - aEng.CoursorTs) > 60) {
        aEng.CoursorTs = aEng.FrameTs;
        aEng.coursorEvent();
    }

    // use 30 for 30 fps, when 16.6 is 60 fps
    if ((aEng.FrameTs - aEng.ActiveTs) > 30) {
        aEng.ActiveTs = aEng.FrameTs;
        aEng.millsecondEvent();

        // aEng.doKMEvents();

    }

    // millsecondEvent fast enough?
    aEng.doKMEvents();

    if (aEng.globalDrawPending !== false) {
        aEng.frameDraw();
    }
    aEng.FrameCount += 1;
    aEng.eventFreeze = false;
};

//
CanvasEngine.prototype.coursorEvent = function () {
    var aEng = this;
    if (aEng.NewCoursorStyle !== true) {
        return;
    }

    var keys = Array.from(aEng.layerList.keys());
    // sort by number
    keys.sort(function (a, b) { return a - b; });
    var aZmap = null;
    var zindex = null;
    var aItem = null;

    aEng.CoursorStyle = null;
    // only the top layer aItem.CoursorStyle can take effect.
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);
        // give mouseOver higher priority
        for (aItem of aZmap.values()) {
            if (aItem.CoursorStyle == null || aEng.isMouseInside(aItem) === false) {
                continue;
            }
            if (aEng.CoursorStyle !== aItem.CoursorStyle) {
                aEng.CoursorStyle = aItem.CoursorStyle;
            }
        }
    }
    if (aEng.MouseRelativeX < aEng.X || aEng.MouseRelativeX > aEng.XBorderLimit ||
        aEng.MouseRelativeY < aEng.Y || aEng.MouseRelativeY > aEng.YBorderLimit ||
        aEng.CoursorStyle == null) {
        if (document.body.style.cursor !== aEng.CoursorOrigStyle) {
            // out of canvas
            document.body.style.cursor = aEng.CoursorOrigStyle;
            aEng.ReDraw();
        }
    } else {
        // setup coursor
        if (aEng.CoursorStyle !== document.body.style.cursor) {
            document.body.style.cursor = aEng.CoursorStyle;
            aEng.ReDraw();
        }
    }
    aEng.NewCoursorStyle = false;
};

//
CanvasEngine.prototype.frameEvent = function () {
    var aEng = this;

    aEng.FrameTs = Date.now();

    // take a snapshot of items
    var itemlist = aEng.items.values();
    for (var aItem of itemlist) {
        if (aEng.items.has(aItem.ID) === false) {
            // deleted
            continue;
        }
        // aItem.On*Event = null will disable event completely
        if (aItem.OnFrameEvent === null) {
            continue;
        }
        if (typeof aItem.OnDefaultFrameEvent === 'function') {
            aItem.OnDefaultFrameEvent(aEng);
        }
        if (typeof aItem.OnFrameEvent === 'function') {
            aItem.OnFrameEvent(aEng);
        }
    }
};

//
CanvasEngine.prototype.millsecondEvent = function () {
    var aEng = this;

    // take a snapshot of items
    var itemlist = aEng.items.values();
    for (var aItem of itemlist) {
        if (aEng.items.has(aItem.ID) === false) {
            // deleted
            continue;
        }
        // aItem.On*Event = null will disable event completely
        if (aItem.OnMillsecondEvent === null) {
            continue;
        }
        if (typeof aItem.OnDefaultMillsecondEvent === 'function') {
            aItem.OnDefaultMillsecondEvent(aEng);
        }
        if (typeof aItem.OnMillsecondEvent === 'function') {
            aItem.OnMillsecondEvent(aEng);
        }
    }
};

//
CanvasEngine.prototype.secondEvent = function () {
    var aEng = this;

    // take a snapshot of items
    var itemlist = aEng.items.values();
    for (var aItem of itemlist) {
        if (aEng.items.has(aItem.ID) === false) {
            // deleted
            continue;
        }
        // aItem.On*Event = null will disable event completely
        if (aItem.OnSecondEvent === null) {
            continue;
        }
        if (typeof aItem.OnDefaultSecondEvent === 'function') {
            aItem.OnDefaultSecondEvent(aEng);
        }
        if (typeof aItem.OnSecondEvent === 'function') {
            aItem.OnSecondEvent(aEng);
        }
    }

    aEng.EngineDuration = aEng.FrameTs - aEng.EngineFPSTs;

    if (aEng.EngineDuration > 0) {
        aEng.EngineFPS = (aEng.FrameCount * 1000) / aEng.EngineDuration;
        aEng.FrameCount = 0;
        aEng.EngineFPSTs = aEng.FrameTs;
    }
};

//
CanvasEngine.prototype.FollowMouseMove = function (aItem, noX, noY) {
    var aEng = this;

    if (aEng.keyPressed === true) {
        return;
    }

    if (aItem.EnableKMEvents === false) {
        window.alert("FollowMouseMove: error, EnableKMEvents === false: " + aItem.ID);
        return;
    }

    var x = aEng.MouseRelativeX;

    var y = aEng.MouseRelativeY;

    if (aItem.MouseMiddlePoint !== false) {
        // - (aItem.W / 2) and - (aItem.H / 2) so mouse point to middle of item
        x = aEng.MouseRelativeX - (aItem.W / 2);
        y = aEng.MouseRelativeY - (aItem.H / 2);
    }
    if (noX !== true) {
        if (x !== aItem.X) {
            //aItem.X = x;
            aItem.DeltaX = aItem.ConfX;
            aItem.ConfX = x / aEng.PercentX;
            aItem.DeltaX = aItem.ConfX - aItem.DeltaX;
            aEng.ReDraw();
        }
    }
    if (noY !== true) {
        if (y !== aItem.Y) {
            //aItem.Y = y;
            aItem.DeltaY = aItem.ConfY;
            aItem.ConfY = y / aEng.PercentY;
            aItem.DeltaY = aItem.ConfY - aItem.DeltaY;
            aEng.ReDraw();
        }
    }
};

//
CanvasEngine.prototype.FollowArrowKey = function (aItem, noX, noY) {
    var aEng = this;

    if (aItem.EnableKMEvents === false) {
        window.alert("FollowArrowKey: error, EnableKMEvents === false: " + aItem.ID);
        return;
    }

    var delta = 0;
    if (noX !== true) {
        delta = 0;
        aItem.DeltaX = aItem.ConfX;
        // move to left
        if (37 in aEng.PressedKeys) {
            delta = -aItem.Speed;
        }
        // move to right
        if (39 in aEng.PressedKeys) {
            delta = aItem.Speed;
        }
        aItem.ConfX += delta;
        //aItem.X = aItem.ConfX * aEng.PercentX;
        aItem.DeltaX = aItem.ConfX - aItem.DeltaX;
        if (aItem.DeltaX !== 0) {
            aEng.ReDraw();
        }
    }

    if (noY !== true) {
        delta = 0;
        aItem.DeltaY = aItem.ConfY;
        // move up
        if (38 in aEng.PressedKeys) {
            delta = -aItem.Speed;
        }

        // move down
        if (40 in aEng.PressedKeys) {
            delta = aItem.Speed;
        }
        aItem.ConfY += delta;
        //aItem.Y = aItem.ConfY * aEng.PercentY;
        aItem.DeltaY = aItem.ConfY - aItem.DeltaY;
        if (aItem.DeltaY !== 0) {
            aEng.ReDraw();
        }
    }
};

//
CanvasEngine.prototype.keyEvent = function () {
    var aEng = this;

    // no key pressed
    if (aEng.PressedKeys.length === 0) {
        return;
    }
    // take a snapshot of items
    var keys = Array.from(aEng.layerList.keys());
    // sort by number
    keys.sort(function (a, b) { return a - b; });
    var aZmap = null;
    var zindex = null;
    var aItem = null;
    // only the top layer aItem.CoursorStyle can take effect.
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);
        // give mouseOver higher priority
        for (aItem of aZmap.values()) {
            if (aEng.onKMItems.has(aItem.ID) === false) {
                // deleted or not enabled
                continue;
            }
            // aItem.On*Event = null will disable event completely
            if (aItem.OnKeyEvent === null) {
                continue;
            }
            if (typeof aItem.OnDefaultKeyEvent === 'function') {
                aItem.OnDefaultKeyEvent(aEng);
                if (aEng.globalDrawPending) {
                    aEng.ApplyItemScale(aItem);
                }
            }
            // aItem.OnKeyEvent = null will disable event completely
            if ((typeof aItem.OnKeyEvent === 'function')) {
                aItem.OnKeyEvent(aEng);
                if (aEng.globalDrawPending) {
                    aEng.ApplyItemScale(aItem);
                }
            }
        }
    }
};

//
CanvasEngine.prototype.doKMEvents = function () {
    var aEng = this;

    // disable mouse events when user pressing key down and do not release yet.
    if (aEng.keyPressed === true) {
        aEng.keyEvent();
        return;
    }

    if (aEng.MouseUp === false && aEng.MouseDown === false && aEng.MousePreX === aEng.MouseRelativeX && aEng.MousePreY === aEng.MouseRelativeY) {
        return;
    }
    // take a snapshot of items
    var keys = Array.from(aEng.layerList.keys());
    // sort by number
    keys.sort(function (a, b) { return a - b; });
    var aZmap = null;
    var zindex = null;
    var aItem = null;
    // only the top layer aItem.CoursorStyle can take effect.
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);
        // give mouseOver higher priority
        for (aItem of aZmap.values()) {
            if (aEng.onKMItems.has(aItem.ID) === false) {
                // deleted or not enabled
                continue;
            }
            // aItem.On*Event = null will disable event completely
            if (aItem.OnMouseEvent === null) {
                continue;
            }
            if (typeof aItem.OnDefaultMouseEvent === 'function') {
                aItem.OnDefaultMouseEvent(aEng);
            }
            // aItem.OnMouseEvent = null will disable event completely
            if (typeof aItem.OnMouseEvent === 'function') {
                aItem.OnMouseEvent(aEng);
            }
        }
    }

    aEng.MousePreX = aEng.MouseRelativeX;
    aEng.MousePreY = aEng.MouseRelativeY;
    aEng.MouseUp = false;
    aEng.MouseDown = false;
};

// called every frame
CanvasEngine.prototype.frameTimefunc = function () {
    var aEng = this;

    var userTimefunc = function () {
        aEng.eventLoop();

        // looping
        aEng.frameTimer = window.requestAnimFrame(userTimefunc);
    };

    // start loop
    userTimefunc();
};

CanvasEngine.prototype.clearAnimFrame = function () {
    var aEng = this;

    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(aEng.frameTimer);
    }
    window.clearInterval(aEng.frameTimer);
};
//
CanvasEngine.prototype.clickEvent = function (event) {
    var aEng = this;

    aEng.onMouseChanged(event);

    var itemXBorder = 0;
    var itemYBorder = 0;

    // take a snapshot of items
    var keys = Array.from(aEng.layerList.keys());
    // sort by number
    keys.sort(function (a, b) { return a - b; });
    var aZmap = null;
    var zindex = null;
    var aItem = null;
    // only the top layer aItem.CoursorStyle can take effect.
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);
        // give mouseOver higher priority
        for (aItem of aZmap.values()) {
            if (aEng.onKMItems.has(aItem.ID) === false) {
                // deleted or not enabled
                continue;
            }
            // aItem.On*Event = null will disable event completely
            if (aItem.OnClickEvent === null) {
                continue;
            }
            itemXBorder = aItem.X + aItem.W;
            itemYBorder = aItem.Y + aItem.H;
            // check aEng.MouseRelativeX, aEng.MouseRelativeY
            if (aEng.MouseRelativeX < aItem.X || aEng.MouseRelativeX > itemXBorder ||
                aEng.MouseRelativeY < aItem.Y || aEng.MouseRelativeY > itemYBorder) {
                continue;
            }
            if (typeof aItem.OnDefaultClickEvent === 'function') {
                aItem.OnDefaultClickEvent(aEng);
            }
            if (typeof aItem.OnClickEvent === 'function') {
                aItem.OnClickEvent(aEng);
            }
        }
    }
};

//
CanvasEngine.prototype.dblclickEvent = function (event) {
    var aEng = this;

    aEng.onMouseChanged(event);

    var itemXBorder = 0;
    var itemYBorder = 0;
    // take a snapshot of items
    var keys = Array.from(aEng.layerList.keys());
    // sort by number
    keys.sort(function (a, b) { return a - b; });
    var aZmap = null;
    var zindex = null;
    var aItem = null;
    // only the top layer aItem.CoursorStyle can take effect.
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);
        // give mouseOver higher priority
        for (aItem of aZmap.values()) {
            if (aEng.onKMItems.has(aItem.ID) === false) {
                // deleted or not enabled
                continue;
            }
            // aItem.On*Event = null will disable event completely
            if (aItem.OnDblClickEvent === null) {
                continue;
            }
            itemXBorder = aItem.X + aItem.W;
            itemYBorder = aItem.Y + aItem.H;
            // check aEng.MouseRelativeX, aEng.MouseRelativeY
            if (aEng.MouseRelativeX < aItem.X || aEng.MouseRelativeX > itemXBorder ||
                aEng.MouseRelativeY < aItem.Y || aEng.MouseRelativeY > itemYBorder) {
                continue;
            }
            if (typeof aItem.OnDefaultDblClickEvent === 'function') {
                aItem.OnDefaultDblClickEvent(aEng);
            }
            if (typeof aItem.OnDblClickEvent === 'function') {
                aItem.OnDblClickEvent(aEng);
            }
        }
    }
};

//
CanvasEngine.prototype.contextmenuEvent = function (event) {
    var aEng = this;

    event = event || window.event;

    aEng.onMouseChanged(event);

    var itemXBorder = 0;
    var itemYBorder = 0;
    // take a snapshot of items
    var keys = Array.from(aEng.layerList.keys());
    // sort by number
    keys.sort(function (a, b) { return a - b; });
    var aZmap = null;
    var zindex = null;
    var aItem = null;
    // only the top layer aItem.CoursorStyle can take effect.
    var disableContextmenu = false;
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);
        // give mouseOver higher priority
        for (aItem of aZmap.values()) {
            if (aEng.onKMItems.has(aItem.ID) === false) {
                // deleted or not enabled
                continue;
            }
            // aItem.On*Event = null will disable event completely
            if (aItem.OnContextmenuEvent === null) {
                continue;
            }
            itemXBorder = aItem.X + aItem.W;
            itemYBorder = aItem.Y + aItem.H;
            // check aEng.MouseRelativeX, aEng.MouseRelativeY
            if (aEng.MouseRelativeX < aItem.X || aEng.MouseRelativeX > itemXBorder ||
                aEng.MouseRelativeY < aItem.Y || aEng.MouseRelativeY > itemYBorder) {
                continue;
            }
            if (typeof aItem.OnDefaultContextmenuEvent === 'function') {
                aItem.OnDefaultContextmenuEvent(aEng);
            }
            if (typeof aItem.OnContextmenuEvent === 'function') {
                aItem.OnContextmenuEvent(aEng);
            }
            if (aItem.DisableContextmenu === true) {
                disableContextmenu = true;
            }
        }
    }
    if (disableContextmenu === true) {
        // TODO: fix not works
        if (event.stopPropagation) {
            event.stopPropagation();
        }
        event.cancelBubble = true;
        return false;
    }
    return true;
};

CanvasEngine.prototype.onResize = function (event) {
    var aEng = this;
    aEng.ResizeEvent = event;
};

// start animation
CanvasEngine.prototype.Run = function () {
    var aEng = this;
    aEng.Event = {};

    aEng.started = true;

    window.addEventListener('resize', function (event) {
        aEng.Event = event;
        aEng.onResize(event);
    });

    window.addEventListener('keydown', function (event) {
        aEng.Event = event;
        aEng.onKeyDown(event);
    });

    window.addEventListener('keyup', function (event) {
        aEng.Event = event;
        aEng.onKeyUp(event);
    });

    window.addEventListener('dblclick', function (event) {
        aEng.Event = event;
        aEng.dblclickEvent(event);
    });

    window.addEventListener('contextmenu', function (event) {
        aEng.Event = event;
        aEng.contextmenuEvent(event);
    });

    window.addEventListener('click', function (event) {
        aEng.Event = event;
        aEng.clickEvent(event);
    });

    window.addEventListener('mousedown', function (event) {
        aEng.Event = event;
        aEng.onMouseDown(event);
    });

    window.addEventListener('mouseup', function (event) {
        aEng.Event = event;
        aEng.onMouseUp(event);
    });

    window.addEventListener('mousemove', function (event) {
        aEng.Event = event;
        aEng.onMouseMove(event);
    });

    // launch timer
    aEng.EngineStartTs = Date.now();
    aEng.EngineFPSTs = aEng.EngineStartTs;
    aEng.frameTimefunc();
};

// method of box, to render/renew the box
CanvasEngine.prototype.isCollision = function (a1Item, a2Item) {
    var aEng = this;

    if (a1Item.ID === a2Item.ID) {
        window.console.log("isCollision: a1Item and a2Item are the same items: " + a1Item.ID + ", " + a2Item.ID);
        return false;
    }

    switch (a1Item.ItemType) {
    case "text":
        // text never collision
        return false;
    default:
        switch (a2Item.ItemType) {
        case "text":
            // text never collision
            return false;
        case "rect":
            return aEng.isRectCollision(a1Item, a2Item);
        default:
            if (a1Item.X === undefined || a1Item.Y === undefined || a1Item.W === undefined || a1Item.H === undefined ||
                a2Item.X === undefined || a2Item.Y === undefined || a2Item.W === undefined || a2Item.H === undefined) {
                window.console.log("isCollision: unknow item types: " + a1Item.ItemType + ", " + a2Item.ItemType);
                return false;
            }
            return aEng.isRectCollision(a1Item, a2Item);
        }
    }
    return false;
};

// method of box, to render/renew the box
CanvasEngine.prototype.isRectCollision = function (a1Item, a2Item) {
    var aEng = this;
    aEng.UNUSED();

    var xOver = false;
    var t1xw = a1Item.ConfX + a1Item.ConfW;
    var t2xw = a2Item.ConfX + a2Item.ConfW;
    if ((a2Item.ConfX >= a1Item.ConfX && a2Item.ConfX <= t1xw) || (t2xw >= a1Item.ConfX && t2xw <= t1xw)) {
        xOver = true;
    }
    var yOver = false;
    var t1yh = a1Item.ConfY + a1Item.ConfH;
    var t2yh = a2Item.ConfY + a2Item.ConfH;
    if ((a2Item.ConfY >= a1Item.ConfY && a2Item.ConfY <= t1yh) || (t2yh >= a1Item.ConfY && t2yh <= t1yh)) {
        yOver = true;
    }
    if (xOver === true && yOver === true) {
        return true;
    }
    return false;
};

// method of box, to render/renew the box
CanvasEngine.prototype.GetItemIDs = function () {
    var aEng = this;

    var ids = new Map();
    for (var aItemID of aEng.items.keys()) {
        ids.set(aItemID, aItemID);
    }
    return ids;
};

//
CanvasEngine.prototype.SetCoursorStyle = function (aItem, coursorStyle) {
    var aEng = this;
    aItem.CoursorStyle = coursorStyle;
    aEng.NewCoursorStyle = true;
};

// method of box, to render/renew the box
CanvasEngine.prototype.ApplyBorderLimit = function (aItem) {
    var aEng = this;

    if (aItem.CrossBorder !== true) {

        var itemXLimit = aEng.XBorderLimit - aItem.W;
        var itemYLimit = aEng.YBorderLimit - aItem.H;

        if (aItem.X > itemXLimit) {
            aItem.X = itemXLimit;
        }
        if (aItem.Y > itemYLimit) {
            aItem.Y = itemYLimit;
        }

        if (aItem.X < aEng.X) {
            aItem.X = aEng.X;
        }
        if (aItem.Y < aEng.Y) {
            aItem.Y = aEng.Y;
        }
        if (aItem.ConfX > 100) {
            aItem.ConfX = 100;
        }
        if (aItem.ConfY > 100) {
            aItem.ConfY = 100;
        }

        if (aItem.ConfX < 0) {
            aItem.ConfX = 0;
        }
        if (aItem.ConfY < 0) {
            aItem.ConfY = 0;
        }
    }
};

// method of box, to render/renew the box
CanvasEngine.prototype.frameDraw = function () {
    var aEng = this;

    // clear all

    aEng.ClearCanvas();

    var itemXLimit = aEng.XBorderLimit;
    var itemYLimit = aEng.YBorderLimit;

    // position events
    var aItem = null;
    var BorderLimit = -1;
    var out = false;
    var hit = false;
    // take a snapshot of items
    var itemlist = aEng.items.values();
    for (aItem of itemlist) {
        if (aEng.items.has(aItem.ID) === false) {
            // deleted
            continue;
        }

        // invisible item
        if (aItem.Visible === false) {
            continue;
        }

        // invisible item
        if (aItem.OnDraw === null) {
            continue;
        }

        // works for rect and text only
        // TODO: handle all type of items

        if (aItem.X === aItem.PX && aItem.Y === aItem.PY) {
            continue;
        }

        // item X moved
        if (aItem.X !== aItem.PX) {
            BorderLimit = -1;
            out = false;
            hit = false;
            itemXLimit = aEng.XBorderLimit - aItem.W;
            if (aItem.X > aEng.XBorderLimit) {
                out = true;
                hit = true;
                BorderLimit = itemXLimit;
            } else if (aItem.X < aEng.X) {
                out = true;
                hit = true;
                BorderLimit = aEng.X;
            } else if (aItem.X > itemXLimit) {
                out = false;
                hit = true;
                BorderLimit = itemXLimit;
            }
            if (out === true && aItem.HitBorderX === true) {
                // aItem.On*Event = null will disable event completely
                if (aItem.OnOutOfBorderX !== null) {
                    if (typeof aItem.OnDefaultOutOfBorderX === 'function') {
                        aItem.OnDefaultOutOfBorderX(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                    if (typeof aItem.OnOutOfBorderX === 'function') {
                        aItem.OnOutOfBorderX(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                }
                if (aItem.CrossBorder !== true) {
                    aItem.X = BorderLimit;
                }
            } else if (hit === true) {
                // aItem.On*Event = null will disable event completely
                if (aItem.OnHitBorderX !== null) {
                    if (aItem.HitBorderX !== true && (typeof aItem.OnDefaultHitBorderX === 'function')) {
                        // call once
                        aItem.OnDefaultHitBorderX(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                    if (aItem.HitBorderX !== true && (typeof aItem.OnHitBorderX === 'function')) {
                        // call once
                        aItem.OnHitBorderX(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                }
                if (aItem.CrossBorder !== true) {
                    aItem.X = BorderLimit;
                }
                aItem.HitBorderX = true;
            } else {
                aItem.HitBorderX = false;
            }
        }
        // item Y moved
        if (aItem.Y !== aItem.PY) {
            BorderLimit = -1;
            out = false;
            hit = false;
            itemYLimit = aEng.YBorderLimit - aItem.H;
            if (aItem.Y > aEng.YBorderLimit) {
                out = true;
                hit = true;
                BorderLimit = itemYLimit;
            } else if (aItem.Y < aEng.Y) {
                out = true;
                hit = true;
                BorderLimit = aEng.Y;
            } else if (aItem.Y > itemYLimit) {
                out = false;
                hit = true;
                BorderLimit = itemYLimit;
            }
            if (out === true && aItem.HitBorderY === true) {
                // aItem.On*Event = null will disable event completely
                if (aItem.OnOutOfBorderY !== null) {
                    if (typeof aItem.OnDefaultOutOfBorderY === 'function') {
                        aItem.OnDefaultOutOfBorderY(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                    if (typeof aItem.OnOutOfBorderY === 'function') {
                        aItem.OnOutOfBorderY(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                }
                if (aItem.CrossBorder !== true) {
                    aItem.Y = BorderLimit;
                }
            } else if (hit === true) {
                // aItem.On*Event = null will disable event completely
                if (aItem.OnHitBorderY !== null) {
                    if (aItem.HitBorderY !== true && (typeof aItem.OnDefaultHitBorderY === 'function')) {
                        // call once
                        aItem.OnDefaultHitBorderY(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                    if (aItem.HitBorderY !== true && (typeof aItem.OnHitBorderY === 'function')) {
                        // call once
                        aItem.OnHitBorderY(aEng);
                    }
                    if (aEng.items.has(aItem.ID) === false) {
                        // deleted
                        continue;
                    }
                }
                if (aItem.CrossBorder !== true) {
                    aItem.Y = BorderLimit;
                }
                aItem.HitBorderY = true;
            } else {
                aItem.HitBorderY = false;
            }
        }
    }

    // collision detect
    // take a snapshot of items
    var a1Itemlist = aEng.items.values();
    for (var a1Item of a1Itemlist) {
        if (a1Item.Colliding !== true) {
            continue;
        }
        if (aEng.items.has(a1Item.ID) === false) {
            // deleted
            continue;
        }

        // invisible item
        if (a1Item.Visible === false) {
            continue;
        }

        // invisible item
        if (a1Item.OnDraw === null) {
            continue;
        }
        // take a snapshot of items
        var a2Itemlist = aEng.items.values();
        for (var a2Item of a2Itemlist) {
            if (a2Item.Colliding !== true) {
                continue;
            }
            if (aEng.items.has(a2Item.ID) === false) {
                // deleted
                continue;
            }
            // invisible item
            if (a2Item.Visible === false) {
                continue;
            }
            // invisible item
            if (a2Item.OnDraw === null) {
                continue;
            }
            if (a1Item.ID === a2Item.ID) {
                continue;
            }
            if (aEng.isCollision(a1Item, a2Item) === true) {
                if ((typeof a1Item.OnDefaultCollision === 'function')) {
                    a1Item.OnDefaultCollision(a2Item, aEng);
                    if (aEng.items.has(a1Item.ID) === false || aEng.items.has(a2Item.ID) === false) {
                        // deleted
                        continue;
                    }
                }
                if ((typeof a1Item.OnCollision === 'function')) {
                    a1Item.OnCollision(a2Item, aEng);
                    if (aEng.items.has(a1Item.ID) === false || aEng.items.has(a2Item.ID) === false) {
                        // deleted
                        continue;
                    }
                }
                if ((typeof a2Item.OnDefaultCollision === 'function')) {
                    a2Item.OnDefaultCollision(a1Item, aEng);
                    if (aEng.items.has(a1Item.ID) === false || aEng.items.has(a2Item.ID) === false) {
                        // deleted
                        continue;
                    }
                }
                if ((typeof a2Item.OnCollision === 'function')) {
                    a2Item.OnCollision(a1Item, aEng);
                    if (aEng.items.has(a1Item.ID) === false || aEng.items.has(a2Item.ID) === false) {
                        // deleted
                        continue;
                    }
                }
            }
        }
    }

    // reDraw all items
    var keys = Array.from(aEng.layerList.keys());

    // sort by number
    keys.sort(function (a, b) { return a - b; });

    var aZmap = null;
    var zindex = null;
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);
        // window.console.log("draw layer#" + zindex + ", size: " + aZmap.size);
        for (aItem of aZmap.values()) {

            aEng.DrawItem(aItem);

        }
    }

    aEng.globalDrawPending = false;
};

//
CanvasEngine.prototype.DefaultDrawItem = function (aItem) {
    var aEng = this;

    aEng.InitDraw(aItem);

    switch (aItem.ItemType) {
    case "text":
        aEng.DrawText(aItem);
        break;
    case "block":
        aEng.DrawBlock(aItem);
        break;
    case "rect":
        aEng.DrawRect(aItem);
        break;
    case "image":
        aEng.DrawImage(aItem);
        break;
    case "dummy":
        break;
    default:
        if (aEng.unknowTypes.has(aItem.ItemType) !== true) {
            window.console.log("DefaultDrawItem: unknow item type: " + aItem.ItemType);
            aEng.unknowTypes.set(aItem.ItemType, true);
        }
    }
};

//
CanvasEngine.prototype.InitDraw = function (aItem) {
    var aEng = this;

    aEng.UNUSED(aItem);

    var ctx = aEng.CTX2d;

    // reset for all items
    ctx.moveTo(aEng.X, aEng.Y);
    // beginPath is IMPORTANT
    ctx.beginPath();
    ctx.scale(1, 1);

    // https://www.w3schools.com/tags/canvas_rotate.asp
    ctx.rotate(0);

};

//
CanvasEngine.prototype.DrawItem = function (aItem) {
    var aEng = this;
    // invisible item
    if (aItem.Visible === false) {
        return;
    }
    //
    if (aItem.PX === aItem.X && aItem.PY === aItem.Y && aEng.globalDrawPending === false) {
        return;
    }
    // invisible item
    if (aItem.OnDraw === null) {
        return;
    }

    if ((typeof aItem.OnPreDraw === 'function')) {

        aEng.InitDraw(aItem);

        aItem.OnPreDraw(aEng);
    }

    if ((typeof aItem.OnDraw === 'function')) {

        aEng.InitDraw(aItem);

        aItem.OnDraw(aEng);

    } else {

        aEng.DefaultDrawItem(aItem);

    }

    if ((typeof aItem.OnPostDraw === 'function')) {
        // draw handle by item
        aItem.OnPostDraw(aEng);
    }

    aEng.DrawGridLine(aItem);

    aItem.PX = aItem.X;
    aItem.PY = aItem.Y;
    aItem.DrawCount += 1;
};

//
CanvasEngine.prototype.DrawGridLine = function (aItem) {
    var aEng = this;

    if (aItem.EnableXLine) {
        aEng.DrawXLine(aItem);
    }
    if (aItem.EnableXBox) {
        aEng.DrawXBox(aItem);
    }
    if (aItem.EnableXCross) {
        aEng.DrawXCross(aItem);
    }
};

//
CanvasEngine.prototype.ClearItemArea = function (aItem) {
    var aEng = this;
    aEng.ClearCanvasBlock(aItem.X, aItem.Y, aItem.W, aItem.H);
};

//
CanvasEngine.prototype.ClearCanvasBlock = function (x, y, w, h) {
    var aEng = this;

    var ctx = aEng.CTX2d;
    ctx.beginPath();
    if (aEng.BackgroundColor) {
        ctx.fillStyle = aEng.BackgroundColor;
        ctx.fillRect(x, y, w, h);
    } else {
        ctx.clearRect(x, y, w, h);
    }
};

//
CanvasEngine.prototype.ClearCanvas = function () {
    var aEng = this;

    var ctx = aEng.CTX2d;
    var canvas = aEng.Canvas;
    if (aEng.BackgroundColor) {
        ctx.fillStyle = aEng.BackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

//
CanvasEngine.prototype.ClearAuxCanvas = function (fill) {
    var aEng = this;

    var ctx = aEng.AuxCTX2d;
    var canvas = aEng.AuxCanvas;
    if (fill) {
        ctx.fillStyle = aEng.AuxBackgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};

//
CanvasEngine.prototype.DrawImage = function (aItem) {
    var aEng = this;

    if (aItem.NextImage != null && aItem.NextImage.W >= 0 && aItem.NextImage.H >= 0) {
        aItem.aImage = aItem.NextImage;
        aItem.NextImage = null;
    }
    if (aItem.aImage == null) {
        return;
    }
    if (aItem.aImage.W < 0 || aItem.aImage.H < 0) {
        return;
    }
    if (aItem.ItemType !== "image") {
        return;
    }
    var ctx = aEng.CTX2d;
    var preglobalAlpha = ctx.globalAlpha;
    preglobalAlpha = ctx.globalAlpha;
    if (aItem.Alpha !== undefined) {
        ctx.globalAlpha = aItem.Alpha;
    }
    ctx.drawImage(aItem.aImage, aItem.X, aItem.Y, aItem.W, aItem.H);

    ctx.globalAlpha = preglobalAlpha;

};

//
CanvasEngine.prototype.DrawAuxRect = function (x, y, w, h, color, alpha, drawStyle) {
    var aEng = this;

    var ctx = aEng.AuxCTX2d;
    var preglobalAlpha = ctx.globalAlpha;
    preglobalAlpha = ctx.globalAlpha;
    if (alpha != null) {
        ctx.globalAlpha = alpha;
    }
    var scale = 0;

    if (drawStyle === "fitdiv") {
        if (w > aEng.W) {
            scale = aEng.W / w;
            w = aEng.W;
            h = h * scale;
        }
        if (h > aEng.H) {
            scale = aEng.H / h;
            h = aEng.H;
            w = w * scale;
        }
    }

    if (color != null) {
        ctx.fillStyle = color;
    }
    ctx.fillRect(x, y, w, h);
    ctx.globalAlpha = preglobalAlpha;
};

//
CanvasEngine.prototype.GetCanvasData = function (aItem, aux) {
    var aEng = this;

    var data = null;
    if (aItem.W <= 0 || aItem.H <= 0 || isNaN(aItem.W) || isNaN(aItem.H)) {
        data = new window.ImageData(1, 1);
    } else {
        var ctx = aEng.CTX2d;
        if (aux === true) {
            ctx = aEng.AuxCTX2d;
        }
        data = ctx.getImageData(aItem.X, aItem.Y, aItem.W, aItem.H);
    }
    return data;
};

//
CanvasEngine.prototype.GetAuxCanvasData = function (x, y, w, h) {
    var aEng = this;

    var data = null;
    if (w <= 0 || h <= 0 || isNaN(w) || isNaN(h)) {
        data = new window.ImageData(1, 1);
    } else {
        var ctx = aEng.AuxCTX2d;
        data = ctx.getImageData(x, y, w, h);
    }
    return data;
};

//
CanvasEngine.prototype.GetCanvasImage = function (aItem, logging) {
    var aEng = this;

    var img = new Image();

    img.W = -1;
    img.H = -1;
    img.Url = "image-" + aEng.Canvas.canvasID + "-" + aEng.FrameTs;
    return aEng.postImageInfo(aItem, img, aEng.Canvas.toDataURL("image/png"), logging);
};

//
CanvasEngine.prototype.postImageInfo = function (aItem, img, src, logging) {
    var aEng = this;

    img.RefItem = aItem;
    img.onload = function () {
        img.W = this.width;
        img.H = this.height;
        // img.RefItem = aItem;
        if (img.RefItem != null) {
            if (logging) {
                window.console.log("postImageInfo: for " + img.RefItem.ID.substr(0, 10) + ", img.W, " + img.W + ", img.H, " + img.H + ", Url " + img.Url);
            }
            aEng.ResizeAndScaleItem(img.RefItem, true);
        } else {
            if (logging) {
                window.console.log("postImageInfo: img.W, " + img.W + ", img.H, " + img.H + ", Url " + img.Url);
            }
        }
    };

    img.src = src;

    if (aItem) {
        aItem.aImage = img;
    }

    aEng.Images.set(img.Url, img);

    return img;

};
//
CanvasEngine.prototype.GetAuxCanvasImage = function (aItem, logging) {
    var aEng = this;

    var img = new Image();

    img.W = -1;
    img.H = -1;
    img.Url = "image-" + aEng.AuxCanvas.canvasID + "-" + Date.now();

    return aEng.postImageInfo(aItem, img, aEng.AuxCanvas.toDataURL("image/png"), logging);
};

//
CanvasEngine.prototype.PutCanvasData = function (data, aItem) {
    var aEng = this;

    var ctx = aEng.CTX2d;
    try {
        ctx.putImageData(data, aItem.X, aItem.Y);
    } catch (err) {
        window.console.log("PutCanvasData(" + aItem.ID + "): " + err);
    }
};

//
CanvasEngine.prototype.PutAuxCanvasData = function (data, x, y) {
    var aEng = this;

    var ctx = aEng.AuxCTX2d;
    try {
        ctx.putImageData(data, x, y);
    } catch (err) {
        window.console.log("PutAuxCanvasData(" + x + "," + y + "): " + err);
    }
};

//
CanvasEngine.prototype.DrawText = function (aItem) {
    var aEng = this;

    var ctx = aEng.CTX2d;

    var preglobalAlpha = ctx.globalAlpha;
    // draw text
    if (aItem.Alpha !== undefined) {
        ctx.globalAlpha = aItem.Alpha;
    }

    if (aItem.FontSize == null) {
        aItem.FontSize = 1;
    }
    if (aItem.Font == null) {
        aItem.Font = "Courier New";
    }
    if (aItem.FontSize > 0) {

        // aItem.FontSize is percent of aEng.W
        var vwsize = (aItem.FontSize * aEng.W) / 100;

        var nfont = Math.round(vwsize) + "px " + aItem.Font.trim().replace(/^\d+\w+\W+/, '');
        if (nfont !== aItem.Font) {
            window.console.log("warning: DrawText, font change from " + aItem.Font + " to " + nfont);
            aItem.Font = nfont;
        }
    }

    ctx.font = aItem.Font;

    ctx.fillStyle = aItem.Color;

    // https://www.w3schools.com/tags/canvas_textbaseline.asp
    ctx.textBaseline = "top";

    var oxy = aEng.GetTextItemOffsets(aItem);

    ctx.fillText(aItem.Text, aItem.X + oxy.X, aItem.Y + oxy.Y);
    ctx.globalAlpha = preglobalAlpha;

};

//
CanvasEngine.prototype.DrawXCross = function (aItem) {
    var aEng = this;

    var x = aItem.X;
    var y = aItem.Y;
    var w = aItem.W;
    var h = aItem.H;

    var ctx = aEng.CTX2d;

    ctx.strokeStyle = "black";
    if (aItem.Color === ctx.strokeStyle) {
        ctx.strokeStyle = "white";
    }
    var midx = x + (w / 2);
    var midy = y + (h / 2);
    ctx.moveTo(midx, y);
    ctx.lineTo(midx, y + h);
    ctx.moveTo(x, midy);
    ctx.lineTo(x + w, midy);
    ctx.stroke();

};

//
CanvasEngine.prototype.DrawXBox = function (aItem) {
    var aEng = this;

    var x = aItem.X;
    var y = aItem.Y;
    var w = aItem.W;
    var h = aItem.H;

    var ctx = aEng.CTX2d;

    ctx.strokeStyle = "black";
    if (aItem.Color === ctx.strokeStyle) {
        ctx.strokeStyle = "white";
    }
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y);
    ctx.stroke();

};

//
CanvasEngine.prototype.DrawXLine = function (aItem) {
    var aEng = this;

    var x = aItem.X;
    var y = aItem.Y;
    var w = aItem.W;
    var h = aItem.H;

    var ctx = aEng.CTX2d;

    ctx.strokeStyle = "black";
    if (aItem.Color === ctx.strokeStyle) {
        ctx.strokeStyle = "white";
    }
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y + h);
    ctx.moveTo(x + w, y);
    ctx.lineTo(x, y + h);
    ctx.stroke();

};

//
CanvasEngine.prototype.DrawBlock = function (aItem) {
    var aEng = this;

    var ctx = aEng.CTX2d;

    var preglobalAlpha = ctx.globalAlpha;
    preglobalAlpha = ctx.globalAlpha;
    if (aItem.Alpha !== undefined) {
        ctx.globalAlpha = aItem.Alpha;
    }
    ctx.fillStyle = aItem.Color;
    ctx.fillRect(aItem.X, aItem.Y, aItem.W, aItem.H);
    ctx.globalAlpha = preglobalAlpha;

    if (aItem.BlockText != null) {
        aEng.DrawItem(aItem.BlockText);
    }
};

//
CanvasEngine.prototype.DrawRect = function (aItem) {
    var aEng = this;
    return aEng.DrawBlock(aItem);
};

//
CanvasEngine.prototype.alignScreenXY = function (force) {
    var aEng = this;

    if ((aEng.SecondTs - aEng.screenAlignTs) < 500 && force !== true) {
        return;
    }
    aEng.screenAlignTs = aEng.SecondTs;
    aEng.ScreenX = 0;
    aEng.ScreenY = 0;
    var el = aEng.Canvas;
    while (el) {
        aEng.ScreenX += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        aEng.ScreenY += (el.offsetTop - el.scrollTop + el.clientTop);
        el = el.offsetParent;
    }
    if (aEng.ScreenX !== aEng.ScreenPreX) {
        window.console.log("screenX: " + aEng.ScreenPreX + " -> " + aEng.ScreenX);
        aEng.ScreenPreX = aEng.ScreenX;
    }
    if (aEng.ScreenY !== aEng.ScreenPreY) {
        window.console.log("screenY: " + aEng.ScreenPreY + " -> " + aEng.ScreenY);
        aEng.ScreenPreY = aEng.ScreenY;
    }
};

//
CanvasEngine.prototype.onKeyDown = function (event) {
    var aEng = this;

    aEng.PressedKeys[event.keyCode] = true;
    aEng.keyPressed = true;
    window.console.log("KeyDown: " + event.keyCode);
};

//
CanvasEngine.prototype.onKeyUp = function (event) {
    var aEng = this;

    delete aEng.PressedKeys[event.keyCode];
    aEng.keyPressed = false;
    window.console.log("KeyUp: " + event.keyCode);
};

//
CanvasEngine.prototype.onMouseDown = function (event) {
    var aEng = this;

    aEng.MouseDown = true;
    aEng.onMouseChanged(event);
    window.console.log("onMouseDown: " + aEng.MouseHint);
};

CanvasEngine.prototype.onMouseUp = function (event) {
    var aEng = this;

    aEng.MouseUp = true;
    aEng.onMouseChanged(event);
    window.console.log("onMouseUp: " + aEng.MouseHint);
};


CanvasEngine.prototype.onMouseMove = function (event) {
    var aEng = this;

    aEng.onMouseChanged(event);
    // window.console.log("onMouseMove: X " + (event.clientX - aEng.ScreenX) + " Y " + (event.clientY - aEng.ScreenY));
    aEng.mouseOver(event);
};

//
CanvasEngine.prototype.onMouseChanged = function (event) {
    var aEng = this;

    aEng.alignScreenXY();
    aEng.MouseRelativeX = event.clientX - aEng.ScreenX;
    aEng.MouseRelativeY = event.clientY - aEng.ScreenY;
    aEng.MousePercentX = (aEng.MouseRelativeX - aEng.X) * 100 / aEng.W;
    aEng.MousePercentY = (aEng.MouseRelativeY - aEng.Y) * 100 / aEng.H;
    aEng.MouseHint = aEng.MouseRelativeX + ", " + aEng.MouseRelativeY + " ( " + aEng.MousePercentX + ", " + aEng.MousePercentY + " )";
};

//
CanvasEngine.prototype.isMouseInside = function (aItem) {
    var aEng = this;


    if (aEng.items.has(aItem.ID) === false) {
        // deleted
        return false;
    }

    // invisible item
    if (aItem.Visible === false) {
        return false;
    }
    // invisible item
    if (aItem.OnDraw === null) {
        return false;
    }

    // check aEng.MouseRelativeX, aEng.MouseRelativeY
    if (
        (aEng.MouseRelativeX < aItem.X) ||
        (aEng.MouseRelativeX > (aItem.X + aItem.W)) ||
        (aEng.MouseRelativeY < aItem.Y) ||
        (aEng.MouseRelativeY > (aItem.Y + aItem.H))
    ) {
        return false;
    }
    return true;
};

//
CanvasEngine.prototype.mouseOver = function (event) {
    var aEng = this;


    aEng.UNUSED(event);

    var keys = Array.from(aEng.layerList.keys());
    // sort by number
    keys.sort(function (a, b) { return a - b; });
    var aZmap = null;
    var zindex = null;
    var aItem = null;
    for (zindex of keys) {
        aZmap = aEng.layerList.get(zindex);

        // give mouseOver higher priority
        for (aItem of aZmap.values()) {
            // check mouse out
            if (aEng.isMouseInside(aItem) === true) {
                continue;
            }
            if (aItem.isMouseOver === true) {
                // OnMouseOut
                aItem.isMouseOver = false;
                // aItem.On*Event = null will disable event completely
                if (aItem.OnMouseOut === null) {
                    continue;
                }
                if (typeof aItem.OnDefaultMouseOut === 'function') {
                    aItem.OnDefaultMouseOut(aEng);
                }
                if (aEng.items.has(aItem.ID) === false) {
                    // deleted
                    continue;
                }
                if (typeof aItem.OnMouseOut === 'function') {
                    aItem.OnMouseOut(aEng);
                }
            }
        }
        for (aItem of aZmap.values()) {
            // check mouse in
            if (aEng.isMouseInside(aItem) === false) {
                continue;
            }

            //if (aItem.isMouseOver !== true) {
            // OnMouseOver
            aItem.isMouseOver = true;
            // aItem.On*Event = null will disable event completely
            if (aItem.OnMouseOver === null) {
                continue;
            }
            if (typeof aItem.OnDefaultMouseOver === 'function') {
                aItem.OnDefaultMouseOver(aEng);
            }
            if (aEng.items.has(aItem.ID) === false) {
                // deleted
                continue;
            }
            if (typeof aItem.OnMouseOver === 'function') {
                aItem.OnMouseOver(aEng);
            }
            //}
        }
    }
};

//
CanvasEngine.prototype.imageScale = function (aItem) {
    var aEng = this;

    var scale = 1;
    if (aItem.ImageScaleTo === "canvas") {
        // scale to canvas size
        aItem.W = aEng.W;
        aItem.H = aEng.H;
        return;
    }
    if (aItem.ImageScaleTo === "image") {
        // scale to image size
        aItem.W = aItem.aImage.W;
        aItem.H = aItem.aImage.H;
        return;
    }
    if (aItem.ImageScaleTo === "fit") {
        aItem.W = aItem.aImage.W;
        aItem.H = aItem.aImage.H;
        if (aItem.W > aEng.W) {
            scale = aEng.W / aItem.W;
            aItem.W = aItem.W * scale;
            aItem.H = aItem.H * scale;
            aItem.ConfW = aItem.W * 100 / aEng.W;
            aItem.ConfH = aItem.H * 100 / aEng.H;
        }
        if (aItem.H > aEng.H) {
            scale = aEng.H / aItem.H;
            aItem.W = aItem.W * scale;
            aItem.H = aItem.H * scale;
            aItem.ConfW = aItem.W * 100 / aEng.W;
            aItem.ConfH = aItem.H * 100 / aEng.H;
        }
        return;
    }
    // config
    aItem.W = aItem.ConfW * aEng.PercentX;
    aItem.H = aItem.ConfH * aEng.PercentY;

    if (aItem.W <= 0) {
        aItem.W = aItem.aImage.W;
    }

    if (aItem.H <= 0) {
        aItem.H = aItem.aImage.H;
    }

};

//
CanvasEngine.prototype.AutoScaleImage = function (aItem) {
    var aEng = this;

    if (aItem.aImage == null) {
        return;
    }
    if (aItem.aImage.W <= 0 || aItem.aImage.H <= 0) {
        aItem.W = 0;
        aItem.H = 0;
        return;
    }
    if (aItem.ItemType !== "image") {
        return;
    }

    if (aEng.H <= 0 || aEng.W <= 0) {
        return;
    }

    var w = aItem.W;
    var h = aItem.H;
    for (var i = 0; i < 10; i++) {
        w = aItem.W;
        h = aItem.H;
        aEng.imageScale(aItem);
        if (w === aItem.W && h === aItem.H) {
            break;
        } else {
            aEng.ReDraw();
        }
    }
};
// end of engine

// return an new TextItem for canvas box.
// this is a text template to create items for the Engine.
function TextItem(fontsize, font, text, x, y, color, alpha, id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "text-" + uuidv4() + "-" + Date.now();
    }
    var aItem = this;

    aItem.BaseClassEntity = new BlockItem(x, y, 0, 0, color, alpha, "BCE-" + id);

    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    // type of item
    aItem.ItemType = "text";
    aItem.ItemSubType = "none";

    aItem.Text = text;
    aItem.Font = font;
    aItem.FontSize = fontsize;

    aItem.TextBaseLine = "top";

    aItem.Alpha = alpha; // 0 - 1
    aItem.Color = color; // 255, 0, 0
    aItem.ID = id;
    aItem.ts = Date.now();
    aItem.PX = -1;
    aItem.PY = -1;
    aItem.DrawCount = 0;

    aItem.Speed = 2;

    // for debug
    aItem.KeyCodeDiv = null;
    aItem.MouseXYDiv = null;

    aItem.escape = false;

    //
    aItem.XOffset = 0;
    aItem.ConfXOffset = 0;

    //
    aItem.YOffset = 0;
    aItem.ConfYOffset = 0;

    // by default, no events for text
    aItem.EnableKMEvents = false;

    // https://www.w3schools.com/tags/canvas_textalign.asp
    // https://www.w3schools.com/tags/canvas_textbaseline.asp
    // TODO: text align

    return aItem;
}

//
TextItem.prototype.SetLabelText = function (text, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aItem.Text = text;

    if (aEng) {
        aItem.OnDefaultSizeEvent(aEng);
    }

};

//
TextItem.prototype.SetAlpha = function (alpha, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aItem.Alpha = alpha;

    if (aEng) {
        aEng.ReDraw();
    }

};

// 
TextItem.prototype.SetText = function (text, font, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    if (aItem.Text !== text && aEng) {
        aEng.ReDraw();
    }
    aItem.Text = text;
    aItem.Font = font;
    if (aEng == null) {
        aItem.W = -1;
        aItem.H = -1;
        return;
    }
    aItem.OnDefaultSizeEvent(aEng);
};

//
TextItem.prototype.SetAlpha = function (alpha) {
    var aItem = this;
    if (alpha > 1 || alpha < 0) {
        window.alert("TextItem.prototype.SetAlpha: invalid alpha([0 - 1]): " + alpha);
        return;
    }
    aItem.Alpha = alpha;
};

//
TextItem.prototype.SetKeyMoveSpeed = function (speed) {
    var aItem = this;
    aItem.Speed = speed;
};

//
TextItem.prototype.SetXOffset = function (offset, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.UNUSED();

    aItem.ConfXOffset = offset;
    aEng.ApplyItemScale(aItem);
};

//
TextItem.prototype.SetYOffset = function (yoffset, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.UNUSED();

    aItem.ConfYOffset = yoffset;
    aEng.ApplyItemScale(aItem);
};

//
TextItem.prototype.EventsSwitch = function (onoff) {
    var aItem = this;
    aItem.EnableKMEvents = onoff;
};

// reDraw every second for load image
CanvasEngine.prototype.GetTextSize = function (aItem) {
    var aEng = this;

    if (aItem.Text == null || aItem.Font == null) {
        return {
            W: 0,
            H: 0,
        };
    }

    if (aItem.FontSize == null) {
        aItem.FontSize = 1;
    }

    if (aItem.FontSize > 0) {
        // aItem.FontSize is percent of aEng.W
        var vwsize = (aItem.FontSize * aEng.W) / 100;
        var nfont = Math.round(vwsize) + "px " + aItem.Font.trim().replace(/^\d+\w+\W+/, '');
        if (nfont !== aItem.Font) {
            // window.console.log("warning: GetTextSize, font change from " + aItem.Font + " to " + nfont);
            aItem.Font = nfont;
        }
    }

    var tsize = aEng.AuxGetTextSize(aItem.Text, aItem.Font, aItem.TextBaseLine);
    aItem.W = tsize.W;
    aItem.H = tsize.H;
    aItem.ConfW = tsize.W * 100 / aEng.W;
    aItem.ConfH = tsize.H * 100 / aEng.H;
};

// reDraw every second for load image
TextItem.prototype.OnDefaultInit = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aEng.UNUSED(aItem);

    aItem.OnDefaultSizeEvent(aEng);

};

// reDraw every second for load image
TextItem.prototype.OnDefaultSizeEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aEng.UNUSED(aItem);

    aEng.GetTextSize(aItem);

};
// end of TextItem

//
function ButtonItem(textsize, offtext, ontext, x, y, w, h, btncolor, offcolor, oncolor, alpha, id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "button-" + uuidv4() + "-" + Date.now();
    }

    if (btncolor == null) {
        btncolor = "#DCF5EA";
    }

    if (offcolor == null) {
        offcolor = "red";
    }

    if (oncolor == null) {
        oncolor = "green";
    }
    var aItem = this;

    // function BlockItem(x, y, w, h, color, alpha, id)
    aItem.BaseClassEntity = new BlockItem(x, y, w, h, btncolor, alpha, "BCE-" + id);
    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    aItem.ID = id;

    // type of item
    aItem.ItemType = "block";
    aItem.ItemSubType = "button";

    aItem.TextSize = textsize;

    aItem.OffText = offtext;

    aItem.OnText = ontext;

    aItem.OffColor = offcolor;

    aItem.OnColor = oncolor;

    aItem.Event = null;

    aItem.BlockText = new TextItem(aItem.TextSize, "Courier New", aItem.OffText, 0, 0, offcolor, alpha, "buttonText-" + id);

    // setup font size for text on button, in % of aEng.W
    aItem.BlockText.FontSize = aItem.TextSize;

    aItem.BlockText.RefItem = aItem;

    aItem.LinkItem = null;

    return aItem;
}

//
ButtonItem.prototype.OnMouseOver = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.SetCoursorStyle(aItem, "pointer");
};

//
ButtonItem.prototype.OnMouseOut = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.SetCoursorStyle(aItem, null);
};

//
ButtonItem.prototype.OnInit = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    // this is vital to display text properly
    aItem.BlockText.OnDefaultSizeEvent = function () {
        aItem.OnDefaultSizeEvent(aEng);
    };

    //
    aEng.DoItemInit(aItem.BlockText);

    aItem.OnDefaultSizeEvent(aEng);

    aItem.OnClickEvent(aEng, "init");

    aEng.ReDraw();
};

//
ButtonItem.prototype.OnPostRemove = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aItem.OnClickEvent(aEng, "removed");
    aEng.ReDraw();
};

// reDraw every second for load image
ButtonItem.prototype.OnDefaultSizeEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.UNUSED();
    if (aItem.ScaleApplied !== true) {
        aEng.ApplyItemScale(aItem, true);
        aItem.OnPostSizeEvent(aEng);
    }
};

// reDraw every second for load image
ButtonItem.prototype.OnPreSizeEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.UNUSED();
    aItem.ScaleApplied = false;
};

// reDraw every second for load image
ButtonItem.prototype.OnPostSizeEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.UNUSED();

    if (aItem.ScaleApplied) {
        aItem.ResizeBlockText(aEng);
        aItem.ScaleApplied = false;
    }

};

// reDraw every second for load image
ButtonItem.prototype.ResizeBlockText = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aEng.GetTextSize(aItem.BlockText);

    aItem.BlockText.X = aItem.X + (aItem.W / 2) - (aItem.BlockText.W / 2);

    aItem.BlockText.Y = aItem.Y + (aItem.H / 2) - (aItem.BlockText.H / 2);

    aItem.BlockText.ConfX = aItem.BlockText.X * 100 / aEng.W;

    aItem.BlockText.ConfY = aItem.BlockText.Y * 100 / aEng.H;

    aEng.ApplyItemScale(aItem.BlockText, true);

};

//
ButtonItem.prototype.SetLinkItem = function (aLinkItem) {
    var aItem = this;
    aItem.LinkItem = aLinkItem;
};

//
ButtonItem.prototype.SetLabelText = function (text, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aItem.BlockText.Text = text;

    if (aEng) {
        aItem.OnDefaultSizeEvent(aEng);
    }

};

//
ButtonItem.prototype.SetText = function (aEng, ontext, offtext, event) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aItem.OnText = ontext;
    aItem.OffText = offtext;

    aItem.OnClickEvent(aEng, event);

};

//
ButtonItem.prototype.OnClickEvent = function (aEng, event) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (event == null) {
        if (aItem.Event === "off") {
            event = "on";
        } else {
            event = "off";
        }
    }

    if (event === "on") {
        aItem.Event = "on";
        aItem.BlockText.Color = aItem.OnColor;
        aItem.BlockText.Text = aItem.OnText;
    } else {
        aItem.Event = "off";
        aItem.BlockText.Color = aItem.OffColor;
        aItem.BlockText.Text = aItem.OffText;
    }

    aItem.OnDefaultSizeEvent(aEng);

    if (aItem.LinkItem != null && aEng.IsManagedItem(aItem.LinkItem)) {
        if (typeof aItem.LinkItem.OnLinkEvent === "function") {
            aItem.LinkItem.OnLinkEvent(aEng, aItem.Event, aItem);
        }
    }

    aEng.ReDraw();
};

//
function SwitchItem(textsize, offtext, ontext, x, y, w, h, btncolor, offcolor, oncolor, alpha, id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "switch-" + uuidv4() + "-" + Date.now();
    }

    if (btncolor == null) {
        btncolor = "#DCF5EA";
    }

    if (offcolor == null) {
        offcolor = "red";
    }

    if (oncolor == null) {
        oncolor = "green";
    }
    var aItem = this;

    // function BlockItem(x, y, w, h, color, alpha, id)
    aItem.BaseClassEntity = new ButtonItem(textsize, offtext, ontext, x, y, w, h, btncolor, offcolor, oncolor, alpha, "BCE-" + id);
    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    aItem.ID = id;

    // type of item
    aItem.ItemType = "block";
    aItem.ItemSubType = "switch";

    aItem.LinkItem = null;

    return aItem;
}

//
SwitchItem.prototype.OnInit = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aItem.SwitchOff(aEng);

    aEng.ReDraw();
};

//
SwitchItem.prototype.OnPostRemove = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aItem.SwitchOff(aEng);

    aEng.ReDraw();
};

//
SwitchItem.prototype.SetLinkItem = function (aLinkItem) {
    var aItem = this;
    aItem.LinkItem = aLinkItem;
};

//
SwitchItem.prototype.OnClickEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    if (aItem.Event === "on") {
        aItem.SwitchOff(aEng);
    } else {
        aItem.SwitchOn(aEng);
    }
};

//
SwitchItem.prototype.SwitchOff = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aItem.Event = "off";

    aItem.BlockText.Color = aItem.OffColor;
    aItem.BlockText.Text = aItem.OffText;

    aItem.OnDefaultSizeEvent(aEng);

    if (aItem.LinkItem != null) {
        if (typeof aItem.LinkItem.OnLinkEvent === "function") {
            aItem.LinkItem.OnLinkEvent(aEng, aItem.Event, aItem);
        }
    }

    aEng.ReDraw();
};

//
SwitchItem.prototype.SwitchOn = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aItem.Event = "on";

    aItem.BlockText.Color = aItem.OnColor;
    aItem.BlockText.Text = aItem.OnText;

    aItem.OnDefaultSizeEvent(aEng);

    if (aItem.LinkItem != null) {
        if (typeof aItem.LinkItem.OnClickEvent === "function") {
            aItem.LinkItem.OnClickEvent(aEng, aItem.Event, aItem);
        }
    }

    aEng.ReDraw();
};

// return an new RectItem for canvas box.
// this is a text template to create items for the Engine.
function RectItem(x, y, w, h, speed, color, alpha, id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "rect-" + uuidv4() + "-" + Date.now();
    }
    var aItem = this;
    aItem.BaseClassEntity = new BlockItem(x, y, w, h, color, alpha, "BCE-" + id);
    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    // type of item
    aItem.ItemType = "rect";
    aItem.ItemSubType = "rect";

    // textItem for show scores
    aItem.ScoreItem = null;

    //
    aItem.score = 0;

    aItem.Speed = speed;

    aItem.npcSpeed = speed / 2;

    // for debug
    aItem.KeyCodeDiv = null;
    aItem.MouseXYDiv = null;

    aItem.escape = false;

    // by default, enable events for rect
    aItem.EnableKMEvents = true;

    //
    aItem.millCount = 0;

    //
    aItem.isNpcItem = false;

    aItem.fastNpcCreateRate = 0;

    aItem.NpcCreateRate = 0.02;

    //
    aItem.CrossBorder = false;

    return aItem;
}

//
RectItem.prototype.SetAlpha = function (alpha) {
    var aItem = this;
    if (alpha > 1 || alpha < 0) {
        window.alert("RectItem.prototype.SetAlpha: invalid alpha([0 - 1]): " + alpha);
        return;
    }
    aItem.Alpha = alpha;
};

//
RectItem.prototype.SetKeyMoveSpeed = function (speed) {
    var aItem = this;
    aItem.Speed = speed;
};

//
RectItem.prototype.EventsSwitch = function (onoff) {
    var aItem = this;
    aItem.EnableKMEvents = onoff;
};

//
RectItem.prototype.OnSecondEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    var alpha = Math.random();
    if (alpha <= 0.05) {
        alpha = 0.05;
    }
    if (alpha >= 1) {
        alpha = 1;
    }
    aItem.Color = RandomColor(alpha);
    aItem.Alpha = alpha;

    //
    aEng.ReDraw();
};

//
RectItem.prototype.SetKeyMoveSpeed = function (speed) {
    var aItem = this;
    aItem.Speed = speed;
};

//
RectItem.prototype.SetNpcSpeed = function (speed) {
    var aItem = this;
    aItem.npcSpeed = speed;
};

//
RectItem.prototype.linearMoveItem = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aItem.X += aItem.Speed;

    aEng.ReDraw();

};

//
RectItem.prototype.randomMoveItem = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    // TODO: random move
    aItem.linearMoveItem(aEng);
};

//
RectItem.prototype.newRandomItem = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    var x, y, w, h, alpha, speed, color;

    alpha = 1;
    speed = aItem.npcSpeed;
    color = RandomColor(50);

    w = aItem.W;
    h = aItem.H;

    x = aEng.X - w;
    y = aEng.Y + Math.floor(aEng.H - (Math.random() * aEng.H));

    var hlimit = (aEng.YBorderLimit - h - 0.01);
    if (y > hlimit) {
        y = hlimit;
    }

    var a2Item = new RectItem(x, y, w, h, speed, color, alpha, null);

    // a npc
    a2Item.isNpcItem = true;

    // disable key/mouse event for npc items
    a2Item.EventsSwitch(false);

    aEng.AddItem(a2Item);
};

//
RectItem.prototype.addRandomItem = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    //Check if we should generate a new Rectangle to start move
    var rnd = Math.random();
    var NpcCreateRate = aItem.NpcCreateRate;

    if (aItem.fastNpcCreateRate > 0) {
        NpcCreateRate = aItem.fastNpcCreateRate;
    }

    if (rnd > NpcCreateRate) {
        return;
    }

    aItem.newRandomItem(aEng);
};

// 
RectItem.prototype.OnMillsecondEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }


    if (aItem.isNpcItem === true) {
        //
        // a npc
        aItem.randomMoveItem(aEng);
        return;
    }

    //
    aItem.addRandomItem(aEng);

    if (aItem.millCount % 10 === 0) {
        var allItems = aEng.GetItemIDs();
        if (allItems.size < 6) {
            // double every time
            aItem.fastNpcCreateRate += aItem.NpcCreateRate;
        } else {
            aItem.fastNpcCreateRate = 0;
        }
    }

    aItem.millCount += 1;
};

// 
RectItem.prototype.OnOutOfBorderX = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.isNpcItem === false) {
        return false;
    } else {
        // a npc, remove
        if (aItem.X > aEng.XBorderLimit || aItem.Y > aEng.YBorderLimit) {
            aEng.RemoveItem(aItem);
        }
        return true;
    }
};

RectItem.prototype.OnOutOfBorderY = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.isNpcItem === false) {
        return false;
    } else {
        // a npc, remove
        if (aItem.X > aEng.XBorderLimit || aItem.Y > aEng.YBorderLimit) {
            aEng.RemoveItem(aItem);
        }
        return true;
    }
};

// 
RectItem.prototype.OnHitBorderX = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.isNpcItem === false) {
        aEng.PlaySound("notice2s", 3);
        return;
    } else {
        if (aItem.X > aEng.X && aItem.Y > aEng.Y) {
            aEng.PlaySound("stun2s", 2);
        }
        return;
    }
};

RectItem.prototype.OnHitBorderY = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.isNpcItem === false) {
        aEng.PlaySound("notice2s", 3);
        return;
    } else {
        if (aItem.X > aEng.X && aItem.Y > aEng.Y) {
            aEng.PlaySound("stun2s", 2);
        }
        return;
    }
};

//
RectItem.prototype.OnCollision = function (a2Item, aEng) {
    var aItem = this;
    var a1Item = this;

    a1Item = a1Item;

    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.isNpcItem === false && a2Item.isNpcItem === false) {
        // player collision
        return;
    }
    if (aItem.isNpcItem === false && a2Item.isNpcItem !== false) {
        // player collision with npc, eat npc
        aEng.RemoveItem(a2Item);
        aEng.PlaySound("happyEat3s", 5);
        //
        aItem.score += 5;
        aItem.ScoreItem.SetText("SCORE: " + aItem.score, aItem.ScoreItem.Font, aEng);
        return;
    }
    if (aItem.isNpcItem === true && a2Item.isNpcItem === true) {
        // npc collision with npc, eat later one of them
        if (aItem.X > a2Item.X) {
            aEng.RemoveItem(a2Item);
        } else {
            aEng.RemoveItem(aItem);
        }
        // 
        return;
    }
};

//
RectItem.prototype.OnInit = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aEng.UNUSED(aItem);

    // basic sound
    var soundlist = {
        successful1s: "sounds/successful1s.mp3",
        stun2s: "sounds/stun2s.mp3",
        notice2s: "sounds/notice2s.mp3",
        happyEat3s: "sounds/happyEat3s.mp3",
        error2s: "sounds/error2s.mp3",
    };

    for (var sname in soundlist) {
        if (aEng.LoadSound(sname, soundlist[sname]) === false) {
            return false;
        }
    }
    return true;
};
// end of RectItem

// play background music
function MusicItem(url, volume, loop, playing, id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "bgm-" + uuidv4() + "-" + Date.now();
    }
    var aItem = this;

    aItem.Playing = playing;

    aItem.ID = id;

    // type of item
    aItem.ItemType = "bgm";
    aItem.ItemSubType = "none";

    aItem.Url = url;

    aItem.ConfVolume = volume;
    aItem.Volume = 0;

    aItem.VolumeStep = aItem.ConfVolume / 5;

    aItem.VolumeCur = 0;

    aItem.VolChange = "up";

    aItem.Loop = loop;

    aItem.Snd = null;

    // by default, disable events for bgm
    aItem.EnableKMEvents = false;

    //
    aItem.millCount = 0;

    //
    aItem.CrossBorder = true;

    // invisible item
    aItem.Visible = false;

    return aItem;
}

//
MusicItem.prototype.OnClickEvent = function (aEng, event, aSWItem) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.UNUSED(aSWItem);

    if (event === "on") {
        aItem.Playing = true;
    } else {
        aItem.Playing = false;
    }
};

//
MusicItem.prototype.OnPostRemove = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.Snd == null) {
        return;
    }
    aItem.Snd.pause();
    aItem.Snd.currentTime = 0;
};

//
MusicItem.prototype.OnDefaultInit = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    if (aItem.Snd != null) {
        return;
    }
    aItem.Volume = 0;

    aItem.VolumeStep = aItem.ConfVolume / 5;

    aItem.VolumeCur = 0;

    // http://soundimage.org/fantasywonder/
    aItem.SndName = Basename(aItem.Url);
    if (aEng.LoadSound(aItem.SndName, aItem.Url) === false) {
        return false;
    }
    aItem.Snd = aEng.GetSound(aItem.SndName);
    aItem.Snd.loop = aItem.Loop;

    if (aItem.Playing) {
        aItem.Snd.volume = aItem.VolumeCur;
    } else {
        aItem.Snd.volume = 0;
    }

    return true;
};

//
MusicItem.prototype.fixVol = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aEng.UNUSED();
    if (isNaN(aItem.Volume)) {
        aItem.Volume = 0;
    }
    if (isNaN(aItem.VolumeCur)) {
        aItem.VolumeCur = 0;
    }
    if (aItem.ConfVolume > 1) {
        aItem.ConfVolume = 1;
    }
    if (aItem.ConfVolume < 0) {
        aItem.ConfVolume = 0;
    }
    if (aItem.Volume > 1) {
        aItem.Volume = 1;
    }
    if (aItem.Volume < 0) {
        aItem.Volume = 0;
    }
    if (aItem.VolumeCur > aItem.Volume && aItem.Playing === true) {
        aItem.VolumeCur = aItem.Volume;
    }
    if (aItem.VolumeCur > 1) {
        aItem.VolumeCur = 1;
    }
    if (aItem.VolumeCur < 0) {
        aItem.VolumeCur = 0;
    }
};

//
MusicItem.prototype.graceVol = function (aEng, fast) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    aItem.millCount += 1;
    aEng.UNUSED();

    if (aItem.Snd == null) {
        return;
    }
    if (aItem.VolumeStep < 0.05) {
        aItem.VolumeStep = 0.05;
    }
    var step = aItem.VolumeStep;
    if (fast) {
        step += step;
    }
    if (aItem.millCount % 50 === 0) {
        aItem.fixVol(aEng);
        if (aItem.VolumeCur < aItem.Volume && aItem.VolChange === "up") {
            aItem.VolumeCur += step;
            aItem.fixVol(aEng);
            window.console.log("bgm volume(+): " + aItem.VolumeCur);
        }
        if (aItem.VolumeCur > aItem.Volume && aItem.VolChange === "down") {
            aItem.VolumeCur -= step;
            aItem.fixVol(aEng);
            window.console.log("bgm volume(-): " + aItem.VolumeCur);
        }
        aItem.Snd.volume = aItem.VolumeCur;
    }
};

//
MusicItem.prototype.OnDefaultMillsecondEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }
    if (aItem.Snd == null) {
        return;
    }
    if (aItem.Playing !== true) {
        if (aItem.Snd.paused) {
            return;
        }

        aItem.ConfVolume = aItem.Volume;
        aItem.Volume = 0;
        aItem.Snd.pause();

        // if (aItem.VolumeCur > 0) {
        //     aItem.Volume = 0;
        //     aItem.VolumeStep = aItem.VolumeCur / 3;
        //     aItem.VolChange = "down";
        //     aItem.graceVol(aEng, true);
        // } else {
        //     aItem.Snd.pause();
        // }
        return;
    }
    if (aItem.Snd.paused) {
        if (aItem.Volume <= 0) {
            aItem.VolChange = "up";
            aItem.Volume = aItem.ConfVolume;
            aItem.VolumeStep = aItem.ConfVolume / 5;
            aItem.VolumeCur = aItem.VolumeStep;
        }
        // (name, priority, miniTime, currentTime)
        // use currentTime to play continously
        aEng.PlaySound(aItem.SndName, -127, 0, aItem.Snd.currentTime);
    }
    aItem.graceVol(aEng);
};

// end of MusicItem

// draw an image in canvas
function ImgItem(url, x, y, w, h, alpha, id) {
    "use strict";
    /* jshint validthis: true */

    if (id == null) {
        id = "image-" + url + "-" + uuidv4() + "-" + Date.now();
    }
    var aItem = this;

    aItem.BaseClassEntity = new BlockItem(x, y, w, h, 0, alpha, "BCE-" + id);
    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    aItem.ID = id;

    // type of item
    aItem.ItemType = "image";
    aItem.ItemSubType = "none";

    aItem.Alpha = alpha; // 0 - 1

    aItem.Url = url;

    aItem.aImage = null;

    // by default, enable events, for mouse click
    aItem.EnableKMEvents = true;

    //
    aItem.millCount = 0;

    //
    aItem.CrossBorder = false;

    // default to use configured W, H
    aItem.ImageScaleTo = "config";

    return aItem;
}

//
ImgItem.prototype.OnDefaultInit = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aItem.SetImage(aItem.Url, aEng);
    return true;
};

//
ImgItem.prototype.SetImage = function (url, aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    aItem.Url = url;
    aEng.LoadImage(aItem.Url, aItem);

    aItem.aImage = aEng.GetImage(aItem.Url);
    return true;
};

// end of ImgItem