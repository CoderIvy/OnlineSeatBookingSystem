/* for-global
    window, Audio, clearInterval, clearTimeout, document, event, history, Image, location, name, navigator, Option, screen, setInterval, setTimeout, XMLHttpRequest
*/

/* global
    CanvasEngine, TextItem, ImgItem, MusicItem, ButtonItem, DummyItem, uuidv4,AttrClone
*/

/* jshint browser: true */
/* jshint esversion: 6 */
/* jshint undef: true, freeze:true, latedef: true, maxerr: 5 */
/* jshint nonew: true, shadow: inner */
/* jshint eqeqeq: true, eqnull: true */

/* jshint unused: true */

/* canvas animation demo */

// reference: Mrs.X https://previews.123rf.com/images/alexbannykh/alexbannykh0712/alexbannykh071200037/2242331-Girl-Stock-Vector-children-supermarket-cartoon.jpg

//
function scoreItem(x, y, color, alpha, id) {

    if (id == null) {
        id = "scoreItem-" + Date.now() + "-" + uuidv4();
    }
    var aItem = this;

    // TextItem(fontsize, font, text, x, y, color, alpha, id)
    aItem.BaseClassEntity = new TextItem(2, "Courier New", "SCORE:000", x, y, color, alpha, "BCE-" + id);
    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    aItem.ID = id;

    aItem.ItemType = "text";

    // put on top
    aItem.LayerIndex = 999;

    aItem.SCORE = -1;

    return aItem;
}

//
scoreItem.prototype.OnSecondEvent = function (aEng) {
    var aItem = this;

    var fps = aItem.SCORE;
    if (aItem.SCORE === -1) {
        fps = Math.round(Math.random() * 100);
    }
    // convert to string
    fps = fps + "";
    var zero = "0";
    fps = zero.repeat(5 - fps.length) + fps;
    aItem.SetText("SCORE:" + fps, "Courier New", aEng);
    aItem.X = 0;
    aItem.Y = 0;
};

function fpsItem(x, y, color, alpha, id) {
    if (id == null) {
        id = "fpsItem-" + Date.now() + "-" + uuidv4();
    }
    var aItem = this;

    aItem.BaseClassEntity = new TextItem(2, "Courier New", "FPS:000", x, y, color, alpha, "BCE-" + id);
    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    aItem.ID = id;
    aItem.ItemType = "text";

    // put on top
    aItem.LayerIndex = 999;

    aItem.FPS = -1;

    return aItem;
}

//
fpsItem.prototype.OnSecondEvent = function (aEng) {
    var aItem = this;

    var fps = aItem.FPS;
    if (aItem.FPS === -1) {
        fps = Math.round(aEng.EngineFPS).toString();
    }
    var zero = "0";
    fps = zero.repeat(3 - fps.length) + fps;
    aItem.SetText("FPS:" + fps, "Courier New", aEng);
    aItem.X = aEng.X + aEng.W - aItem.W;
};

//
function appleItem(redimg, x, y, id) {
    if (id == null) {
        id = "appleItem-" + Date.now() + "-" + uuidv4();
    }
    var aItem = this;

    // ImgItem(url, x, y, w, h, alpha, id)
    aItem.BaseClassEntity = new ImgItem(redimg, x, y, 1, 1, 1, "BCE-" + id);
    aItem = AttrClone(aItem.BaseClassEntity, aItem);

    aItem.ItemType = "image";

    aItem.ItemSubType = "apple";

    aItem.ID = id;

    // put on middle
    aItem.LayerIndex = 50;

    aItem.ImageScaleTo = "config";

    aItem.aRedImage = {};

    aItem.RedImage = redimg;

    aItem.DisableContextmenu = true;

    aItem.ColorStart = -100;
    aItem.ColorStep = 12;

    aItem.b = aItem.ColorStart;

    //
    aItem.imageData = null;
    aItem.NextImage = null;

    // init, grow, mature, fall, gone, catched
    aItem.State = "init";
    aItem.StateTs = Date.now();
    aItem.PreStateTs = Date.now();

    aItem.CrossBorder = false;

    aItem.InitX = aItem.ConfX;
    aItem.InitY = aItem.ConfY;
    aItem.InitW = aItem.ConfW;
    aItem.InitH = aItem.ConfH;

    aItem.MasterItem = null;

    return aItem;

}

appleItem.prototype.OnInit = function (aEng) {
    var aItem = this;

    aItem.aRedImage = aEng.GetImage(aItem.RedImage);
    aItem.aImage = aItem.aRedImage;
};

appleItem.prototype.OnMillsecondEvent = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.MasterItem && aItem.MasterItem.GlobalState === "stop") {
        return;
    }

    // init, grow, mature, fall, gone, catched
    switch (aItem.State) {
    case "fall":
        // fall down

        aItem.ConfY += aItem.FallSpeed;
        aEng.ResizeAndScaleItem(aItem, true);

        break;
    case "catched":
        // follow Mrs.X
        var mx = aItem.MasterItem.ximg;
        var midy = mx.ConfY + (mx.ConfH * 0.55);
        if (!aItem.CatchY) {
            aItem.CatchY = (mx.ConfH / 8 * Math.random());
        }
        aItem.ConfY = midy + aItem.CatchY;
        if (aItem.MasterItem.ximg.GoLeft) {
            aItem.ConfX = mx.ConfX + aItem.CatchX;
        } else {
            aItem.ConfX = mx.ConfX + mx.ConfW - aItem.CatchX - aItem.ConfW;
        }
        aEng.ResizeAndScaleItem(aItem);
        break;
    }
};

appleItem.prototype.StateMachine = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    if (aItem.MasterItem && aItem.MasterItem.GlobalState === "stop") {
        return;
    }

    if (aEng == null && aItem.State !== "setup") {
        return;
    }

    // init, grow, mature, fall, gone, catched
    switch (aItem.State) {
    case "setup":

        aItem.ConfRaduis = 0.3;

        aItem.Raduis = aItem.ConfRaduis;

        aItem.ConfW = aItem.Raduis * 2;
        aItem.ConfH = aItem.Raduis * 3;

        aItem.RedColor = 100;

        aItem.GreenColor = 150;

        aItem.CrossBorder = true;
        aItem.ImageScaleTo = "config";

        aItem.InitX = aItem.ConfX;
        aItem.InitY = aItem.ConfY;

        aItem.InitW = aItem.ConfW;
        aItem.InitH = aItem.ConfH;

        aItem.ConfGreen = 80;

        aItem.ColorGreen = aItem.ConfGreen;

        aItem.State = "init";
        aItem.StateTs = Date.now();
        aItem.PreStateTs = aItem.StateTs;
        return;
    case "init":

        if (Math.random() * 100 > 20) {
            aItem.ConfW = 0.001;
            aItem.ConfH = 0.001;
            aItem.ConfX = 0;
            aItem.ConfY = 0;
            return;
        }

        aItem.FallSpeed = (aEng.PercentH) / 6 / 30;

        aItem.Raduis = aItem.ConfRaduis;

        aItem.RaduisStep = aItem.Raduis / 3;

        aItem.ConfX = aItem.InitX;
        aItem.ConfY = aItem.InitY;

        aItem.ConfW = aItem.Raduis * 2;
        aItem.ConfH = aItem.Raduis * 3;

        aItem.StateTs = Date.now();

        aItem.PreStateTs = aItem.StateTs;

        aItem.State = "grow";

        // goto next state
        aItem.StateMachine(aEng);
        break;
    case "grow":

        aItem.StateTs = Date.now();

        aItem.Raduis += aItem.RaduisStep;



        aItem.ConfW = aItem.Raduis * 2;
        // to fit the circle
        var w = aItem.ConfW * aEng.PercentX;
        aItem.ConfH = w / aEng.PercentY;

        aEng.ResizeAndScaleItem(aItem, true);

        if (aItem.StateTs - aItem.PreStateTs >= 5000) {
            aItem.PreStateTs = aItem.StateTs;
            aItem.State = "color";
            // goto next state
            aItem.StateMachine(aEng);
        }
        break;
    case "color":
        // stay 3 seconds
        aItem.StateTs = Date.now();

        // https://www.w3schools.com/colors/colors_rgb.asp
        aItem.RedColor += 50;
        aItem.GreenColor -= 10;

        if (aItem.StateTs - aItem.PreStateTs >= 5000) {
            aItem.PreStateTs = aItem.StateTs;
            aItem.State = "mature";
            // goto next state
            aItem.StateMachine(aEng);
        }
        break;
    case "mature":
        // stay 3 seconds
        aItem.StateTs = Date.now();

        if (aItem.StateTs - aItem.PreStateTs >= 3000) {
            aItem.PreStateTs = aItem.StateTs;
            aItem.State = "fall";

            // aItem.FallSpeed = (aEng.PercentH - aItem.ConfY) / 6;
            aItem.FallSpeed = (aEng.PercentH) / 6 / 30;

            // goto next state
            aItem.StateMachine(aEng);
        }
        break;
    case "fall":
        // fall in millsecond

        aItem.StateTs = Date.now();

        // OnCollision may change the state to catched

        if (aItem.StateTs - aItem.PreStateTs >= 6000) {
            aItem.PreStateTs = aItem.StateTs;
            aItem.State = "gone";
        }
        break;
    case "gone":
        aEng.RemoveItem(aItem);
        break;
    case "catched":
        break;
    default:
        return;
    }
    return;

};

//
appleItem.prototype.OnDraw = function (aEng) {
    var aItem = this;
    var CurID = this.ID;
    if (aEng != null) { aEng.UNUSED(CurID); }

    var ctx = aEng.CTX2d;

    var raduis = aItem.Raduis * aEng.PercentX;

    var x = aItem.X + (aItem.W) / 2;
    var y = aItem.Y + (aItem.H) / 2;

    // x0	The x-coordinate of the starting circle of the gradient
    // y0	The y-coordinate of the starting circle of the gradient
    // r0	The radius of the starting circle
    // x1	The x-coordinate of the ending circle of the gradient
    // y1	The y-coordinate of the ending circle of the gradient
    // r1	The radius of the ending circle

    var grd = ctx.createRadialGradient(x, y, raduis / 5, x, y, raduis * 0.8);

    var red = (aItem.RedColor);
    var green = (aItem.GreenColor);

    grd.addColorStop(0, "rgb(" + red + ", " + green + ", 0)");
    red -= 20;
    green += 20;
    grd.addColorStop(0.6, "rgb(" + red + ", " + green + ", 0)");
    red -= 20;
    green += 20;
    grd.addColorStop(0.8, "rgb(" + red + ", " + green + ", 0)");
    red -= 20;
    green += 20;
    grd.addColorStop(1, "rgb(" + red + ", " + green + ", 0)");

    ctx.beginPath();

    // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
    // x	The x-coordinate of the center of the circle	Play it »
    // y	The y-coordinate of the center of the circle	Play it »
    // r	The radius of the circle	Play it »
    // sAngle	The starting angle, in radians (0 is at the 3 o'clock position of the arc's circle)	Play it »
    // eAngle	The ending angle, in radians	Play it »
    // counterclockwise	Optional. Specifies whether the drawing should be counterclockwise or clockwise. False is default, and indicates clockwise, while true indicates counter-clockwise.
    ctx.arc(x, y, raduis, 0, 2 * Math.PI, false);
    ctx.fillStyle = grd;
    ctx.fill();
    // ctx.lineWidth = 0;
    // ctx.strokeStyle = grd;
    // ctx.stroke();
};

//
appleItem.prototype.OnCollision = function (a2Item, aEng) {
    var aItem = this;
    var a1Item = this;

    aEng.UNUSED(aItem);

    // only care about apple
    if (a2Item.ItemSubType !== "apple") {
        return;
    }

    if (a1Item.State !== "grow" || a2Item.State !== "grow") {
        return;
    }

    if (a1Item.confW >= a2Item.ConfW) {
        aEng.RemoveItem(a2Item);
        return;
    } else {
        aEng.RemoveItem(a1Item);
    }

};

// end of appleItem

function divShow(thediv) {

    var elm = thediv;
    while (elm) {
        if (elm.style) {
            if (elm.style.display === "" || elm.style.display === "none") {
                window.console.log("warning: divShow, change element " + elm.nodeName + ": " + elm.className + "#" + elm.id + " style.display to flex.");
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
}

function divHide(maindiv) {

    if (maindiv.getElementsByTagName) {
        var childDivs = maindiv.childNodes;
        var elm = null;
        for (var i = 0; i < childDivs.length; i++) {
            elm = childDivs[i];
            if (elm.nodeName !== "DIV") {
                continue;
            }
            if (elm.style) {
                if (elm.style.display !== "none") {
                    window.console.log("warning: divHide, change element " + elm.nodeName + ": " + elm.className + "#" + elm.id + " style.display to none.");
                    elm.style.display = "none";
                }
            }
            divHide(elm);
        }
        elm = maindiv;
        if (elm.style) {
            if (elm.style.display !== "none") {
                window.console.log("warning: divHide, change element " + elm.nodeName + ": " + elm.className + "#" + elm.id + " style.display to none.");
                elm.style.display = "none";
            }
        }
    }
    return;
}

//

var mybox = null;

var gameBox = null;

//
function lauchcanvas(off) {

    var mainblockid = "canvasgame";
    var thediv = document.getElementById(mainblockid);
    if (thediv == null) {
        window.alert("error: getElementById(" + mainblockid + ") failed.");
        return;
    }
    if (off) {
        if (mybox && gameBox && gameBox.bgmsw) {
            gameBox.bgmsw.OnClickEvent(mybox, "off");
            mybox.Visible = false;
            mybox.Hide();
        }
        divHide(thediv);
        return;
    }

    divShow(thediv);

    if (mybox) {
        mybox.Show(true);
        // gameBox.bgmsw.OnClickEvent(mybox, "on");
        return;
    }

    // var mybox = new CanvasEngine("maincanvas", 0, 0, 0, 0, "lightgreen", "DarkGreen", "auxcanvas", "lightblue");
    mybox = new CanvasEngine("maincanvas", 0, 0, 0, 0, "lightgreen", "DarkGreen");

    gameBox = new DummyItem();

    gameBox.DefaultVolume = 0.2;

    gameBox.GlobalState = "stop";

    gameBox.bgm = new MusicItem("sounds/bgm/Surreal-Chase_Looping.mp3", gameBox.DefaultVolume, false, false);

    gameBox.bgmsw = new ButtonItem(3, "MUSIC", "MUSIC", 0, 100, 10, 7, "lightblue");

    gameBox.volplus = new ButtonItem(3, "Vol +", "Vol +", 12, 100, 10, 7, "#CEE9D0", "red", "red");

    gameBox.voltext = new ButtonItem(3, "0", "0", 24, 100, 10, 7, "#CEE9D0", "red", "red");

    gameBox.volminus = new ButtonItem(3, "- Vol", "- Vol", 36, 100, 10, 7, "#CEE9D0", "red", "red");

    gameBox.gamectl = new ButtonItem(3, "START", "STOP", 48, 100, 20, 7, "lightblue");

    gameBox.espText = new scoreItem(99, 99, 'red', 1, "espText");

    // TextItem(fontsize, font, text, x, y, color, alpha, id)
    gameBox.gameHint = new TextItem(6, "Courier New", "GAME READY", 34.5, 50, 'red', 0.6, "gameHint");

    gameBox.ximg = new ImgItem("img/xleft.png", 65, 55, 12, 40, 1);

    gameBox.ximg.ItemSubType = "theX";

    gameBox.ximg.Colliding = true;

    gameBox.ximg.CrossBorder = false;

    gameBox.ximg.EyesTs = -1;

    // ImgItem(url, x, y, w, h, alpha, id)
    gameBox.bgimg = new ImgItem("img/grass-finl.png", 0, 0, 0, 0, 1);

    gameBox.bgimg.ImageScaleTo = "canvas";

    gameBox.treeimg = new ImgItem("img/tree-david-tr-high.png", 36, 25, 0, 100, 1);

    gameBox.treeimg.ImageScaleTo = "fit";

    gameBox.treeimg.CrossBorder = false;

    // gameBox.treeimg.EnableXLine = true;
    // gameBox.treeimg.EnableXBox = true;
    // gameBox.treeimg.EnableXCross = true;

    gameBox.scoreText = new scoreItem(0, 0, 'black', 1, "scoreText");

    gameBox.scoreText.SCORE = 0;

    gameBox.fpsText = new fpsItem(100, 0, 'black', 1, "fpsText");

    gameBox.AppleNumber = 10;

    //
    gameBox.ximg.OnCollision = function (a2Item, aEng) {
        var aItem = this;

        if (aItem.MasterItem.GlobalState === "stop") {
            return;
        }

        var CurID = this.ID;
        if (aEng != null) { aEng.UNUSED(CurID); }

        // only care about apple
        if (a2Item.ItemSubType !== "apple") {
            return;
        }

        var cartY = aItem.ConfY + (aItem.ConfH * 0.6);
        var headY = aItem.ConfY + (aItem.ConfH * 0.2);

        var aX = (a2Item.ConfX + a2Item.ConfW);
        var aY = (a2Item.ConfY + a2Item.ConfH);

        var incart = false;

        var midx = aItem.ConfX + (aItem.ConfW * 0.5);

        if (gameBox.ximg.GoLeft) {
            if (aX <= midx) {
                // reach cart?
                if (aY > cartY) {
                    // into cart
                    incart = true;
                } else {
                    // continue falling
                    incart = false;
                }
            } else if (aY > headY) {
                // hit Mrs.X
                gameBox.scoreText.SCORE -= 1;
                aEng.PlaySound("notice2s", 15, 0.02, 0);
                // will not collided in next round
                a2Item.ConfX -= (aItem.ConfW * 0.3);

                a2Item.ConfY -= a2Item.ConfH * 2;
                a2Item.PreStateTs += 4000;

                aItem.EyesTs = aEng.FrameTs + 3000;

                aItem.EconfOffset = 0;

                aItem.OnSecondEvent(aEng);

                gameBox.scoreText.OnSecondEvent(aEng);
            }
        } else {
            if (a2Item.ConfX >= midx) {
                // reach cart?
                if (aY > cartY) {
                    // into cart
                    incart = true;
                } else {
                    // continue falling
                    incart = false;
                }
            } else if (aY > headY) {
                // hit Mrs.X
                gameBox.scoreText.SCORE -= 1;
                aEng.PlaySound("notice2s", 15, 0.02, 0);
                // will not collided in next round
                a2Item.ConfX -= (aItem.ConfW * 0.3);
                a2Item.ConfY -= a2Item.ConfH * 2;
                a2Item.PreStateTs += 4000;
                aItem.EyesTs = aEng.FrameTs + 3000;

                aItem.EconfOffset = 0;

                aItem.OnSecondEvent(aEng);
                gameBox.scoreText.OnSecondEvent(aEng);
            }
        }

        if (incart) {

            a2Item.State = "catched";

            a2Item.Colliding = false;
            a2Item.CrossBorder = false;

            gameBox.scoreText.SCORE += 10;
            gameBox.scoreText.OnSecondEvent(aEng);

            if (gameBox.ximg.GoLeft) {
                a2Item.CatchX = a2Item.ConfX - aItem.ConfX;
                if (a2Item.ConfX < (aItem.ConfX + a2Item.ConfW)) {
                    a2Item.CatchX = a2Item.ConfW * 0.8;
                }
            } else {
                a2Item.CatchX = aItem.ConfX + aItem.ConfW - a2Item.ConfX - a2Item.ConfW;
                if ((a2Item.ConfX + a2Item.ConfW) > (aItem.ConfX + aItem.ConfW)) {
                    a2Item.CatchX = a2Item.ConfW * 0.8;
                }
            }
            // function (name, priority, miniTime, currentTime)
            aEng.PlaySound("happyEat3s", 15, 0.02, 0);

        }
        aEng.ResizeAndScaleItem(a2Item, true);
    };

    gameBox.ximg.ImageScaleTo = "config";

    gameBox.ximg.EnableKMEvents = true;
    gameBox.ximg.Speed = 0.5;

    gameBox.ximg.LeftImage = gameBox.ximg.aImage;

    // (url, aItem, logging)
    mybox.LoadImage("img/xright.png", null, true);
    gameBox.ximg.RightImage = mybox.GetImage("img/xright.png");

    mybox.LoadImage("img/xleft.png", null, true);
    gameBox.ximg.LeftImage = mybox.GetImage("img/xleft.png");

    gameBox.ximg.GoLeft = true;

    gameBox.ximg.OnPostSizeEvent = function (aEng) {
        var aItem = this;

        aItem.XMin = 20;
        aItem.XMax = 80;

        aItem.YMin = aItem.ConfY * 0.8;
        aItem.YMax = aItem.ConfY * 1;

        aItem.EyesTs = aEng.FrameTs + 2000;
    };

    gameBox.ximg.DoKeyMouseEvent = function (aEng) {
        var aItem = this;

        // SPACEBAR
        if (32 in aEng.PressedKeys) {

            if (gameBox.gamectl.GameStartTs > 0) {
                gameBox.OnLinkEvent(aEng, "off", gameBox.gamectl);
            } else {
                gameBox.OnLinkEvent(aEng, "on", gameBox.gamectl);
            }
            delete aEng.PressedKeys[32];
        }

        if (aItem.MasterItem.GlobalState === "stop") {
            return;
        }

        aEng.FollowArrowKey(aItem, false, false);

        // aEng.FollowMouseMove(aItem, false, false);

        if (aItem.ConfY > aItem.YMax) {
            aItem.ConfY = aItem.YMax;
        }
        if (aItem.ConfY < aItem.YMin) {
            aItem.ConfY = aItem.YMin;
        }
        if (aItem.ConfX > aItem.XMax) {
            aItem.ConfX = aItem.XMax;
        }
        if (aItem.ConfX < aItem.XMin) {
            aItem.ConfX = aItem.XMin;
        }

        // move to left
        if (aItem.DeltaX < 0) {
            gameBox.ximg.GoLeft = true;
            gameBox.ximg.NextImage = gameBox.ximg.LeftImage;
            aEng.ReDraw();

        }

        // move to right
        if (aItem.DeltaX > 0) {
            gameBox.ximg.GoLeft = false;
            gameBox.ximg.NextImage = gameBox.ximg.RightImage;
            aEng.ReDraw();
        }

    };

    // gameBox.ximg.EnableXLine = true;
    // gameBox.ximg.EnableXBox = true;
    // gameBox.ximg.EnableXCross = true;
    // 
    //
    gameBox.ximg.OnSecondEvent = function (aEng) {
        var aItem = this;

        aEng.UNUSED(aItem);

        if (aEng.FrameTs > aItem.EyesTs) {
            aItem.EconfOffset = 0;
            return;
        }
        switch (aItem.EconfOffset) {
        case 0:
            aItem.EconfOffset = 1;
            break;
        case 1:
            aItem.EconfOffset = 3;
            break;
        default:
            aItem.EconfOffset = 0;
        }
    };

    //
    gameBox.ximg.drawEyes = function (aEng) {
        var aItem = this;

        aEng.UNUSED(aItem);

        aItem.EconfX = aItem.ConfX + (aItem.ConfW * 0.5);
        aItem.EconfY = aItem.ConfY + (aItem.ConfH * 0.29);

        var xp = aItem.EconfX * aEng.PercentX;
        var yp = aItem.EconfY * aEng.PercentY;

        var radius = 1.35 * aEng.PercentY;

        //eyes bg
        // function (aEng, xPos, yPos, radius, start, end, bgColor, lineColor, lineWidth)

        aItem.drawCircle(aEng, xp, yp, radius, 0.0, 2, "white", "black", 0.5);

        var xep = aEng.PercentX * 1.6;
        var yep = aEng.PercentY * 2;
        if (aItem.GoLeft) {
            aItem.drawCircle(aEng, xp + xep, yp + yep, radius, 0.0, 2, "white", "black", 0.5);
        } else {
            aItem.drawCircle(aEng, xp - xep, yp + yep, radius, 0.0, 2, "white", "black", 0.5);
        }

        // 
        var offset = aItem.EconfOffset * aEng.PercentY * 0.2;

        yp -= offset;
        if (Math.random() > 30) {
            xp += offset;
        } else {
            xp -= offset;
        }

        radius = radius * 0.2;

        //eyes
        aItem.drawCircle(aEng, xp, yp, radius, 0, 2, "blue", "darkgreen", 2);
        if (aItem.GoLeft) {
            aItem.drawCircle(aEng, xp + xep, yp + yep, radius, 0, 2, "blue", "darkgreen", 2);
        } else {
            aItem.drawCircle(aEng, xp - xep, yp + yep, radius, 0, 2, "blue", "darkgreen", 2);
        }

    };

    gameBox.ximg.drawCircle = function (aEng, xPos, yPos, radius, start, end, bgColor, lineColor, lineWidth) {
        var aItem = this;

        aEng.UNUSED(aItem);

        var ctx = aEng.CTX2d;

        ctx.beginPath();
        ctx.arc(xPos, yPos, radius, start, Math.PI * end, true);
        ctx.fillStyle = bgColor;
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = lineColor;
        ctx.stroke();

    };

    //
    gameBox.ximg.OnDraw = function (aEng) {
        var aItem = this;

        aEng.DefaultDrawItem(aItem);

        aItem.drawEyes(aEng);

    };

    gameBox.voltext.OnMillsecondEvent = function (aEng) {
        var volcur = Math.round(gameBox.bgm.VolumeCur * 100);
        var volmax = Math.round(gameBox.bgm.Volume * 100);
        gameBox.voltext.VolText = volcur + "/" + volmax;
        if (gameBox.voltext.PreVolText === gameBox.voltext.VolText) {
            return;
        }
        gameBox.voltext.SetText(aEng, gameBox.voltext.VolText, gameBox.voltext.VolText);
        gameBox.voltext.PreVolText = gameBox.voltext.VolText;
    };

    gameBox.gameHint.SetText("GAME READY", "Courier New", null);

    gameBox.TimeLimit = (7 * 60);

    // gameBox.TimeLimit = 30;

    //
    gameBox.espText.OnSecondEvent = function (aEng) {
        var aItem = this;

        if (aItem.MasterItem.GlobalState === "stop") {
            return;
        }

        var allitems = aEng.GetAllItems(null, "apple");
        var catchedItems = new Map();
        var actives = 0;
        var aApple = null;
        for (aApple of allitems.values()) {
            if (aApple.State === "gone") {
                gameBox.RemoveItem(aApple, aEng);
            } else if (aApple.State === "catched") {
                catchedItems.set(aApple.ID, aApple);
            } else {
                actives++;
            }
        }
        var catchszie = catchedItems.size;
        if (catchszie >= (gameBox.AppleNumber)) {
            for (aApple of catchedItems.values()) {
                if (Math.random() < 0.5) {
                    gameBox.RemoveItem(aApple, aEng);
                    catchszie--;
                }
                if (catchszie < (gameBox.AppleNumber * 0.7)) {
                    break;
                }
            }
        }
        if (actives < gameBox.AppleNumber) {
            var cnt = gameBox.AppleNumber - actives;
            while ((cnt > 0)) {
                cnt--;

                var minX = gameBox.treeimg.ConfX + (gameBox.treeimg.ConfW * 2 / 10);
                var maxX = gameBox.treeimg.ConfX + (gameBox.treeimg.ConfW * 8 / 10);

                var minY = gameBox.treeimg.ConfY - (gameBox.treeimg.ConfH * 2 / 10);
                var maxY = gameBox.treeimg.ConfY + (gameBox.treeimg.ConfH * 1 / 15);

                var aX = minX + (Math.random() * (maxX - minX));
                var aY = minY + (Math.random() * (maxY - minY));

                aApple = new appleItem("img/apple-green-tr-min.png", aX, aY, "ap-" + aX + "-" + aY + uuidv4() + "-" + Date.now());

                if (aApple.ConfX < minX) {
                    aApple.ConfX = minX;
                }
                if (aApple.ConfX > maxX) {
                    aApple.ConfX = maxX;
                }

                if (aApple.ConfY < minY) {
                    aApple.ConfY = minY;
                }
                if (aApple.ConfY > maxY) {
                    aApple.ConfY = maxY;
                }

                // aApple.EnableXLine = true;
                // aApple.EnableXBox = true;
                // aApple.EnableXCross = true;
                aApple.Colliding = true;
                aApple.CrossBorder = true;
                aApple.State = "setup";
                aApple.StateMachine(null);
                aApple.OnSecondEvent = aApple.StateMachine;
                gameBox.AddItem(aApple, 50, aEng);
            }
        }

        gameBox.gamectl.GameCurTs = Date.now() / 1000;
        var espts = Math.round(gameBox.gamectl.GameEndTs - gameBox.gamectl.GameCurTs);
        if (espts < 0) {
            espts = 0;
            aItem.MasterItem.GlobalState = "stop";
            gameBox.OnLinkEvent(aEng, "expire", gameBox.gamectl);
        } else if (espts > 3) {
            if (gameBox.gameHint.Alpha > 0) {
                gameBox.gameHint.Alpha -= 0.2;
                if (gameBox.gameHint.Alpha < 0) {
                    gameBox.gameHint.Alpha = 0;
                    gameBox.gameHint.SetText("", "Courier New", aEng);
                }
                gameBox.gameHint.SetAlpha(gameBox.gameHint.Alpha);
            }
        }
        espts += "";
        var zero = "0";
        var len = gameBox.TimeLimit.toString().length;
        if (espts.length < len) {
            espts = zero.repeat(len - espts.length) + espts;
        }
        aItem.SetText("TIME:" + espts + "/" + gameBox.TimeLimit, "Courier New", aEng);
    };

    // SetLabelText
    gameBox.espText.SetLabelText("TIME:" + "000" + "/" + gameBox.TimeLimit);

    gameBox.ximg.OnKeyEvent = gameBox.ximg.DoKeyMouseEvent;

    gameBox.ximg.OnMouseEvent = gameBox.ximg.DoKeyMouseEvent;

    //
    gameBox.gamectl.GameStartTs = -1;
    gameBox.gamectl.GameCurTs = -1;
    gameBox.gamectl.GameEndTs = 0;

    //
    gameBox.SyncVolumes = function () {
        for (var sndname of mybox.GetAllSounds().keys()) {
            mybox.SetSoundVolume(sndname, gameBox.bgm.Volume);
        }
    };

    gameBox.OnLinkEvent = function (aEng, event, aItem) {

        if (aItem.ID === gameBox.gamectl.ID) {
            if (gameBox.gamectl.GameStartTs <= 0) {
                // start game

                var allitems = aEng.GetAllItems(null, "apple");
                var aApple = null;
                for (aApple of allitems.values()) {
                    gameBox.RemoveItem(aApple, aEng);
                }

                gameBox.gameHint.Alpha = 1;

                gameBox.gamectl.GameStartTs = Date.now() / 1000;
                gameBox.gamectl.GameCurTs = Date.now() / 1000;
                gameBox.gamectl.GameEndTs = gameBox.gamectl.GameStartTs + gameBox.TimeLimit;
                // function (aEng, text)
                gameBox.gamectl.SetLabelText("STOP", aEng);

                gameBox.bgm.Volume = gameBox.DefaultVolume;
                gameBox.SyncVolumes();

                // function (name, priority, miniTime, currentTime)
                aEng.PlaySound("successful1s", 8, 2, 0);


                gameBox.bgmsw.OnClickEvent(aEng, "on");
                gameBox.bgm.VolChange = "up";

                aItem.MasterItem.GlobalState = "running";

                gameBox.gameHint.SetText("GAME START", "Courier New", aEng);

                gameBox.scoreText.SCORE = 0;

            } else {
                // stop game

                aItem.MasterItem.GlobalState = "stop";

                gameBox.gamectl.GameCurTs = gameBox.gamectl.GameEndTs + 1;
                gameBox.gamectl.GameStartTs = -1;

                gameBox.bgm.Volume = gameBox.DefaultVolume;
                gameBox.SyncVolumes();

                // function (name, priority, miniTime, currentTime)
                aEng.PlaySound("error2s", 5, 2, 0);

                gameBox.bgmsw.OnClickEvent(aEng, "off");
                gameBox.bgm.VolChange = "down";

                gameBox.gamectl.SetLabelText("START/RESET", aEng);
                gameBox.gameHint.Alpha = 1;
                gameBox.gameHint.SetText("GAME OVER", "Courier New", aEng);

                gameBox.SyncVolumes();
            }
            aEng.ReDraw();
            return;
        }

        if (aItem.ID === gameBox.bgmsw.ID) {
            gameBox.bgm.OnClickEvent(aEng, event);
            gameBox.SyncVolumes();
            return;
        }
        if (aItem.ID === gameBox.volplus.ID) {
            gameBox.bgm.VolChange = "up";
            gameBox.bgm.Volume = gameBox.bgm.VolumeCur + 0.05;
            gameBox.bgm.VolumeCur = gameBox.bgm.Volume;
            if (gameBox.bgm.Playing !== true) {
                gameBox.bgmsw.OnClickEvent(aEng, "on");
            }
            gameBox.SyncVolumes();
            return;
        }
        if (aItem.ID === gameBox.volminus.ID) {
            if (gameBox.bgm.Volume > 0) {
                gameBox.bgm.Volume = gameBox.bgm.VolumeCur - 0.05;
                if (gameBox.bgm.Volume <= 0) {
                    gameBox.bgm.Volume = 0;
                }
                gameBox.bgm.VolumeCur = gameBox.bgm.Volume;
                gameBox.bgm.VolChange = "down";
                if (gameBox.bgm.Volume <= 0) {
                    gameBox.bgmsw.OnClickEvent(aEng, "off");
                } else if (gameBox.bgm.Playing !== true) {
                    // gameBox.bgm.OnClickEvent(aEng, "on");
                    gameBox.bgmsw.OnClickEvent(aEng, "on");
                }
                gameBox.SyncVolumes();
                aEng.ReDraw();
            } else {
                // aEng.clearAnimFrame();
                // aEng.ClearCanvas();
            }
            return;
        }
    };

    gameBox.bgmsw.LinkItem = gameBox;

    gameBox.volplus.LinkItem = gameBox;

    gameBox.volminus.LinkItem = gameBox;

    gameBox.gamectl.LinkItem = gameBox;

    gameBox.OnInit = function (aEng) {

        gameBox.AddItem(gameBox.bgimg, -999, aEng);

        gameBox.AddItem(gameBox.treeimg, 10, aEng);

        gameBox.AddItem(gameBox.ximg, 20, aEng);

        gameBox.AddItem(gameBox.scoreText, 999, aEng);

        gameBox.AddItem(gameBox.fpsText, 999, aEng);

        gameBox.AddItem(gameBox.espText, 999, aEng);

        gameBox.AddItem(gameBox.volplus, 999, aEng);

        gameBox.AddItem(gameBox.voltext, 999, aEng);

        gameBox.AddItem(gameBox.volminus, 999, aEng);

        gameBox.AddItem(gameBox.gameHint, 999, aEng);

        gameBox.AddItem(gameBox.gamectl, 999, aEng);

        gameBox.AddItem(gameBox.bgm, -999, aEng);

        gameBox.AddItem(gameBox.bgmsw, 999, aEng);

        aEng.ReDraw();
    };

    mybox.SetLayerIndex(gameBox, -999);

    // launch
    mybox.Run();

    // document.body.style.cursor = 'not-allowed';

}