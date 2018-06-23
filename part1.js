/* jshint browser: true */
/* global window: false */

// need for jslint, to allow the browser globals available
// https://stackoverflow.com/questions/1853473/should-i-worry-about-window-is-not-defined-jslint-strict-mode-error

"use strict";

/*-----part 1---------*/

//TODO add room name , add selected seat number
//value = the button, 1=booking, 2=aniamtion, 3 = project
function showContent(value) {
    var moveiBlock = document.getElementById("moveiBlock");
    var booking = document.getElementById("booking");
    var game = document.getElementById("canvasgame");
    var gusage = document.getElementById("gameusage");
    var project = document.getElementById("coolproject");

    value = value.toString();
    switch (value) {
        case "2":
            moveiBlock.style.display = "none";
            booking.style.display = "none";
            game.style.display = "flex";
            gusage.style.display = "flex";
            project.style.display = "none";

            lauchcanvas();
            break;

        case "3":
            moveiBlock.style.display = "none";
            booking.style.display = "none";
            game.style.display = "none";
            gusage.style.display = "none";
            project.style.display = "flex";
            lauchcanvas(true)
            break;
        case "1":
        default:
            moveiBlock.style.display = "flex";
            booking.style.display = "flex";
            game.style.display = "none";
            gusage.style.display = "none";
            project.style.display = "none";
            lauchcanvas(true);
            showFlorenceSeats();
            break;
    }
}

function reloadCurrentPage(qs) {
    window.location.assign(qs);
}

function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function part1init(p1) {
    getData("Florence.xml", 12);
    getData("Ronald.xml", 11);
    // https://davidwalsh.name/query-string-javascript
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    var p = getUrlParameter("p").toString();
    if (p.length == 0) {
        p = p1;
    }
    showContent(p);
}


//object for seat
function Seat(price, row, column, status) {
    this.price = price;
    this.row = row;
    this.column = column;
    this.status = status;
}

// Florence layout data
var florenceSeats = [];

//Ronald layout data
var ronaldSeats = [];

//indicator for which page is currently shown 
var florenceShow = true;
var ronaldShow = false;

//get XML data
function getData(xmlSource, rowLenth) {

    var xmlHttp;
    var xmlDoc;

    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlHttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    //xmlHttp.open("GET", "Florence.xml", false);
    xmlHttp.open("GET", xmlSource + "", false);
    xmlHttp.send();
    xmlDoc = xmlHttp.responseXML;
    var xmlData = xmlDoc.getElementsByTagName("Seat");

    var sPrice = '';
    var sRow = '';
    var sColumn = -1;
    var sStatus = '';
    var row = 0;


    for (var i = 0; i < xmlData.length; i++) {
        sRow = xmlData[i].getElementsByTagName("Row")[0].childNodes[0].nodeValue;
        sColumn = xmlData[i].getElementsByTagName("Column")[0].childNodes[0].nodeValue;
        sStatus = xmlData[i].getElementsByTagName("Status")[0].childNodes[0].nodeValue;


        if (i % rowLenth == 0) {
            row = row + 1;
        }
        if (row <= 2) {
            sPrice = 20;
        } else if (row >= 3 && row <= 5) {
            sPrice = 22;
        } else {
            sPrice = 25;
        }

        var curSeat = new Seat(sPrice, sRow, sColumn, sStatus);

        if (xmlSource === "Florence.xml") {
            florenceSeats[i] = curSeat;
        } else if (xmlSource === "Ronald.xml") {
            ronaldSeats[i] = curSeat;
        }
    }
}

//select different room's layout, value 1 for Florence room, value 2 for Ronald room
function changeLayout(value) {
    var table = document.getElementById('florenceSeat');
    var btnRpay = document.getElementById("btnRonaldPay");
    var btnFpay = document.getElementById("btnFlorencePay");
    var tipImg01 = document.getElementById("tipImg01");
    var tipImg02 = document.getElementById("tipImg02");
    var tipImg03 = document.getElementById("tipImg03");
    var priceText = document.getElementById("priceText");
    var roomName = document.getElementById("roomName");

    switch (value) {
        case 2:
            if (ronaldShow != true) {
                showRonaldSeats();
                florenceShow = false;
                ronaldShow = true;
                tipImg01.src = "img/ronald4.png";
                tipImg02.src = "img/ronald5.png";
                tipImg03.src = "img/ronald6.png";
                priceText.innerHTML = "Please select seat.";
                btnFpay.style.visibility = "hidden";
                roomName.innerHTML = "Ronald Room Layout";

            }
            break;
        case 1:
        default:
            if (florenceShow != true) {
                showFlorenceSeats();
                florenceShow = true;
                ronaldShow = false;
                tipImg01.src = "img/seat4.png";
                tipImg02.src = "img/seat5.png";
                tipImg03.src = "img/seat6.png";
                rRowAdd = 0;
                priceText.innerHTML = "Please select seat.";
                btnRpay.style.visibility = "hidden";
                roomName.innerHTML = "Florence Room Layout";

            }
            break;
    }
}

// set images for loading page
function initFlorenceImg(pos, cell) {
    var curCol = florenceSeats[pos].status;
    if (curCol == "Available") {
        cell.innerHTML = '<img id=' + "fCell-" + pos + ' src="img/seat0.png" width="80vw" height="80vw" />';
    } else if (curCol == "None") {
        cell.innerHTML = '<img  id=' + "fCell-" + pos + ' src="img/seatNone.png" width="80vw" height="80vw" />';
    } else if (curCol == "Unavailable") {
        cell.innerHTML = '<img  id=' + "fCell-" + pos + ' src="img/seat2.png" width="80vw" height="80vw" />';
    } else if (curCol == "Paid") {
        cell.innerHTML = '<img  id=' + "fCell-" + pos + ' src="img/seat2.png" width="80vw" height="80vw" />';
    } else if (curCol == "Selected") {
        cell.innerHTML = '<img  id=' + "fCell-" + pos + ' src="img/seat1.png" width="80vw" height="80vw" />';
    }

    cell.setAttribute("id", "seat-" + pos);
    cell.onclick = function () {

        var img = this.childNodes[0];

        if (img == null) {
            return;
        }
        if (florenceSeats[pos].status == "Available") {
            img.src = "img/seat1.png";
            florenceSeats[pos].status = "Selected";

            showFlorencePrice();

        } else if (florenceSeats[pos].status == "Selected") {
            img.src = "img/seat0.png";
            florenceSeats[pos].status = "Available";
            showFlorencePrice();
        } else if (florenceSeats[pos].status == "Unavailable") {

            alert("This seat is unavailable.");
        }
    };
}

function showFlorenceSeats() {

    var fRowAdd = 0; //for increase row

    var table = document.getElementById('florenceSeat');

    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    var headRow = table.insertRow(-1);
    headRow.insertCell(-1);

    //set seat's number
    for (var j = 0; j < 12; j++) {
        var firstRowCell = headRow.insertCell(-1);
        if (j === 6) {
            firstRowCell.innerHTML = "";
        } else if (j < 6) {
            firstRowCell.innerHTML = j + 1;
        } else {
            firstRowCell.innerHTML = j;
        }
        firstRowCell.setAttribute("class", "colNum");

    }

    //i for every row
    for (var i = 0; i < 8; i++) {

        var row = table.insertRow(-1);

        //for row number (A, B, C....)
        var firstCell = row.insertCell(-1);
        firstCell.innerHTML = florenceSeats[i + fRowAdd].row;
        firstCell.setAttribute("class", "firstCell");

        // each seat 
        for (var a = 0; a < 12; a++) {
            var onecell = row.insertCell(-1);
            initFlorenceImg(i + fRowAdd + a, onecell);
        }
        fRowAdd = fRowAdd + 11;
    }
}

// count selected seat's price
function countFlorencePrice() {
    var totalPrice = 0;
    for (var i = 0; i < florenceSeats.length; i++) {
        if (florenceSeats[i].status === "Selected") {
            totalPrice = totalPrice + florenceSeats[i].price;
        }
    }
    return totalPrice;
}

//show price when use selected seats
function showFlorencePrice() {
    var totalPrice = countFlorencePrice();
    var btnPay = document.getElementById("btnFlorencePay");
    btnPay.style.visibility = "hidden";
    var priceText = document.getElementById("priceText");
    var selectedSeat = showFlorenceSeatNum();

    // total price not equal to 0, show pay button
    if (totalPrice > 0) {
        priceText.innerHTML = "Seat " + selectedSeat + " selected. The total price for your selected seats is: $ " + totalPrice + ".  Click pay button to book selected seats.";
        btnPay.style.visibility = "visible";
    } else {
        priceText.innerHTML = "Please select seat.";
        btnPay.style.visibility = "hidden";
    }
}

//click pay button, change seats status
function florencePay() {
    var totalPrice = countFlorencePrice();
    var priceText = document.getElementById("priceText");
    var selectedSeat = showFlorenceSeatNum();

    if (totalPrice > 0) {
        for (var i = 0; i < florenceSeats.length; i++) {
            if (florenceSeats[i].status === "Selected") {
                florenceSeats[i].status = "Paid";
                var curCell = document.getElementById("fCell-" + i);
                if (curCell == null) {

                    continue;
                }
                curCell.src = "img/seat2.png";
            }
        }

        //remind user book successful
        priceText.innerHTML = "Congratuation!! Seat " + selectedSeat + " booked sucessfully!!!.";
        var btnPay = document.getElementById("btnFlorencePay");
        btnPay.style.visibility = "hidden";

    } else {
        priceText.innerHTML = "Please select seat first.";
    }
}

function showFlorenceSeatNum() {
    var selectedSeat = "";

    for (var i = 0; i < florenceSeats.length; i++) {
        if (florenceSeats[i].status == "Selected") {
            if (florenceSeats[i].column < 7) {
                selectedSeat = selectedSeat + florenceSeats[i].row + (parseInt(florenceSeats[i].column) + 1) + " ($:" + florenceSeats[i].price + " ), ";
            } else {
                selectedSeat = selectedSeat + florenceSeats[i].row + florenceSeats[i].column + " ($:" + florenceSeats[i].price + " ), ";

            }
        }
    }
    return selectedSeat;
}


/*--------------- Ronald Layout ---------------*/

function initRonaldImg(pos, cell) {
    var curCol = ronaldSeats[pos].status;
    if (curCol == "Available") {
        cell.innerHTML = '<img id=' + "rCell-" + pos + ' src="img/ronald0.png" width="80vw" height="80vw" />';
    } else if (curCol == "None") {
        cell.innerHTML = '<img  id=' + "rCell-" + pos + ' src="img/seatNone.png" width="80vw" height="80vw" />';
    } else if (curCol == "Unavailable") {
        cell.innerHTML = '<img  id=' + "rCell-" + pos + ' src="img/ronald2.png" width="80vw" height="80vw" />';
    } else if (curCol == "Paid") {
        cell.innerHTML = '<img  id=' + "rCell-" + pos + ' src="img/ronald2.png" width="80vw" height="80vw" />';
    } else if (curCol == "Selected") {
        cell.innerHTML = '<img  id=' + "fCell-" + pos + ' src="img/ronald1.png" width="80vw" height="80vw" />';
    }

    cell.setAttribute("id", "seat-" + pos);
    cell.onclick = function () {

        var img = this.childNodes[0];

        if (img == null) {
            return;
        }
        if (ronaldSeats[pos].status == "Available") {
            img.src = "img/ronald1.png";
            ronaldSeats[pos].status = "Selected";
            showRonaldPrice();

        } else if (ronaldSeats[pos].status == "Selected") {
            img.src = "img/ronald0.png";
            ronaldSeats[pos].status = "Available";
            showRonaldPrice();
        } else if (ronaldSeats[pos].status == "Unavailable") {

            alert("This seat is unavailable.");
        }
    };
}


var rRowAdd = 0; //for increase row

function showRonaldSeats() {

    var fRowAdd = 0; //for increase row

    var table = document.getElementById('florenceSeat');

    while (table.rows.length > 0) {
        table.deleteRow(0);
    }

    var headRow = table.insertRow(-1);
    headRow.insertCell(-1);

    for (var j = 0; j < 11; j++) {
        var firstRowCell = headRow.insertCell(-1);
        if (j === 5) {
            firstRowCell.innerHTML = "";
        } else if (j < 5) {
            firstRowCell.innerHTML = j + 1;
        } else {
            firstRowCell.innerHTML = j;
        }
        firstRowCell.setAttribute("class", "colNum");
    }

    //i for every row
    for (var i = 0; i < 10; i++) {

        var row = table.insertRow(-1);

        //for row number (A, B, C....)
        var firstCell = row.insertCell(-1);
        firstCell.innerHTML = ronaldSeats[i + rRowAdd].row;
        firstCell.setAttribute("class", "firstCell");

        for (var a = 0; a < 11; a++) {
            var onecell = row.insertCell(-1);
            initRonaldImg(i + rRowAdd + a, onecell);
        }
        rRowAdd = rRowAdd + 10;
    }
}

function showRonaldPrice() {
    var totalPrice = countRonaldPrice();
    var btnPay = document.getElementById("btnRonaldPay");
    btnPay.style.visibility = "hidden";
    var priceText = document.getElementById("priceText");
    var selectedSeat = showRonaldSeatNum();

    if (totalPrice > 0) {

        priceText.innerHTML = "Seat" + selectedSeat + " selected. The total price for your selected seats is: $ " + totalPrice + ".  Click pay button to book selected seats.";
        btnPay.style.visibility = "visible";
    } else {
        priceText.innerHTML = "Please select seat.";
        btnPay.style.visibility = "hidden";
    }
}



function ronaldPay() {
    var totalPrice = countRonaldPrice();
    var priceText = document.getElementById("priceText");
    var selectedSeat = showRonaldSeatNum();

    if (totalPrice > 0) {
        for (var i = 0; i < ronaldSeats.length; i++) {
            if (ronaldSeats[i].status === "Selected") {
                ronaldSeats[i].status = "Paid";
                var curCell = document.getElementById("rCell-" + i);
                if (curCell == null) {

                    continue;
                }
                curCell.src = "img/ronald2.png";

            }
        }

        priceText.innerHTML = "Congratuation! Seat " + selectedSeat + " booked sucessfully!!!.";
        var btnPay = document.getElementById("btnRonaldPay");
        btnPay.style.visibility = "hidden";

    } else {
        priceText.innerHTML = "Please select seat first.";
    }
}

function countRonaldPrice() {
    var totalPrice = 0;
    for (var i = 0; i < ronaldSeats.length; i++) {
        if (ronaldSeats[i].status === "Selected") {
            totalPrice = totalPrice + ronaldSeats[i].price;
        }
    }
    return totalPrice;
}

function showRonaldSeatNum() {
    var selectedSeat = "";

    for (var i = 0; i < ronaldSeats.length; i++) {
        if (ronaldSeats[i].status == "Selected") {
            if (ronaldSeats[i].column >= 5) {
                selectedSeat = selectedSeat + ronaldSeats[i].row + ronaldSeats[i].column + " ($:" + ronaldSeats[i].price + " ), ";
            } else {
                selectedSeat = selectedSeat + ronaldSeats[i].row + (parseInt(ronaldSeats[i].column) + 1) + " ($:" + ronaldSeats[i].price + " ), ";
            }
        }
    }
    return selectedSeat;
}