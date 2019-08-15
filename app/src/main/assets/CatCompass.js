/*

   	Copyright 2019 Pere Nubiola

    This file is part of CatCompass.

    CatCompass is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CatCompass is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with CatCompass.  If not, see <https://www.gnu.org/licenses/>.
*/

class Compass{
    constructor(dialog, idab = "",idg = ""){
        /*
        checs screen orientation
        */
        try{
            this.prefLang = Compass.getPreferredLang();
            this.idab = idab;
            this.idg = idg;
            this.alfa = 0;
            this.beta = 0;
            this.gamma = 0;
        }catch(error){
            window.alert("Dialog constructor1: " + error);
        }
        try{
            this.dialog = document.getElementById(dialog);
            var mclass = this.dialog.getAttribute("class");
            if (mclass == "catNubiolaNivellDialog"){
                this.type = "N";
                if (this.dialog.requestFullscreen) {
                    this.dialog.requestFullscreen();
                } else if (this.dialog.webkitRequestFullscreen) {
                    this.dialog.webkitRequestFullscreen();
                } else if (this.dialog.mozRequestFullScreen) {
                    this.dialog.mozRequestFullScreen();
                } else if (this.dialog.msRequestFullscreen) {
                    this.dialog.msRequestFullscreen();
                }
                screen.orientation.lock("natural");
                this.btnok = this.dialog.getElementsByClassName("NivellOk")[0]
                this.btcan = this.dialog.getElementsByClassName("NivellCancel")[0];
                var betar = this.dialog.getElementsByClassName("BetaRectangle")[0];
                var betac = this.dialog.getElementsByClassName("BetaCircle")[0];
                var gammar = this.dialog.getElementsByClassName("GammaRectangle")[0];
                var gammac  = this.dialog.getElementsByClassName("GammaCircle")[0];
                var bgpcir = this.dialog.getElementsByClassName("BetGamPCircle")[0];
                var bgcir = this.dialog.getElementsByClassName("BetGamCircle")[0];
                this.betaLim =  Number(betar.getAttribute("height"))/2 - Number(betac.getAttribute("r"));
                this.gammaLim = Number(gammar.getAttribute("width"))/2 - Number(gammac.getAttribute("r"));
                this.bgLim = Number(bgpcir.getAttribute("width"))/2 - Number(bgcir.getAttribute("r"));
            }else if(mclass == "catNubiolaCompasDialog"){
                this.type = "C"
                this.btnok = this.dialog.getElementsByClassName("CompassOk")[0]
                this.btcan = this.dialog.getElementsByClassName("CompassCancel")[0];
            }else {
                window.alert('class ' + mclass + this.languageConvert('not supported'));
                return;
            }
        }catch(error){
            window.alert("Dialog constructor: " + error);
        }
        if (window.DeviceOrientationEvent){
            if (this.type == "C"){
                this.imageTransx = "0";
                this.imageTransy = "0";
            }
            this.isAppleWebKit = navigator.userAgent.includes("AppleWebKit");
            this.isChrome = navigator.userAgent.includes("Chrome");
            if (window.DeviceOrientationEvent.requestPermission){
                this.promise = window.DeviceOrientationEvent.requestPermission();
                window.alert(this.promise);
            }
            if ('oncompassneedscalibration' in window) {
                window.addEventListener('compassneedscalibration', (e)=> {
                    window.alert(this.languageConvert('Your compass needs calibrating! Wave your device in a figure-eight motion'));
                    e.preventDefault();
                });
            }
        }else{
            window.alert(this.languageConvert("Can not detect Device Orientation"));
            return;
        }
        var orientationScreen = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type ;
        if (this.type == "C" ? this.checkOrientation(orientationScreen) : this.checkOrientationN(orientationScreen)){
            try{
                this.orientationScreenchangelistener = (e)=> {
                    var orientationScreen = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type ;
                    if (this.type == "C"){
                        this.checkOrientation(orientationScreen);
                    }else{
                        this.checkOrientationN(orientationScreen)
                    }
                };
                this.okclick = (e)=> {
                    if (this.type == "N"){
                        try{
                            document.getElementById(this.idab).innerHTML = this.beta.toFixed(2);
                            document.getElementById(this.idg).innerHTML = this.gamma.toFixed(2);
                        }catch(error){
                            window.alert("Button ok" + error);
                        }
                    }else{
                        try{
                            document.getElementById(this.idab).innerHTML = this.alfa.toFixed(2);
                        }catch(error){
                            window.alert("Button ok" + error);
                        }
                    }
                    this.removeListeners();
                };
                this.canclick = (e)=> {
                    if (this.type == "N"){
                       screen.orientation.unlock();
                    }
                    this.removeListeners();
                };
                this.devorientation = (e)=>{
                    this.rotateRosa(e);
                };
                window.addEventListener("orientationchange",this.orientationScreenchangelistener,false);
                this.degrees = 0;
                this.btnok.addEventListener("click",this.okclick,true);
                this.btcan.addEventListener("click",this.canclick,true);
                if (window.DeviceOrientationAbsoluteEvent) {
                    window.addEventListener('DeviceOrientationAbsolute',this.devorientation, true );
                }else{
                    window.addEventListener('deviceorientation', this.devorientation, true );
                }
            }catch(error){
                window.alert(this.languageConvert("Init: ") + error);
            }
            this.dialog.showModal();
        }

    }
    static getPreferredLang() {
        var translangs = ["en-us","fr-fr","ca-es"];
        var langs = navigator.languages;
        try{
            for (var l of langs){
                for (var k of translangs){
                    if (k == l) return k;
                }
                var n = l.split("-")[0];
                for (k of translangs){
                    if (k.split("-")[0] == n) return k;
                }

            }
        }catch(error){
            window.alert("getPreferredLang: " + error);
        }
        return "en-us";
    }
    removeListeners(){
        try{
            window.removeEventListener("orientationchange",this.orientationScreenchangelistener,false);
            this.btnok.removeEventListener("click",this.okclick,true);
            this.btcan.removeEventListener("click",this.canclick,true);
            if (window.DeviceOrientationAbsoluteEvent) {
                window.removeEventListener('DeviceOrientationAbsolute',this.devorientation, true );
            }else{
                window.removeEventListener('deviceorientation', this.devorientation, true );
            }
        }catch(error){
            window.alert("removeListeners: " + error);
        }
        this.dialog.close();
    }
    rotateRosa(e){
        try{
            if(event.webkitCompassHeading) {
                // Apple works only with this, alpha doesn't work
                this.alfa = e.webkitCompassHeading
            }else{
                this.alfa = e.alpha;
            }
            this.alfa = Math.round(this.alfa * 10)/10;
            this.beta = Math.round( e.beta * 10)/10;;
            this.gamma = Math.round(e.gamma * 10)/10;;

        }catch(error){
            window.alert("2.-" + this.languageConvert("Device orientation: ") + error);
        }
        try{
            if (this.type == "N"){
                var ybeta = this.betaLim * Math.cos(((e.beta -90) % 180) * Math.PI /180);
                var ybg = this.bgLim * Math.cos(((e.beta -90) % 180)* Math.PI  /180);
                var xgamma = this.gammaLim * Math.sin(this.gamma * Math.PI /180);
                var xbg = this.bgLim * Math.sin(this.gamma * Math.PI /180);

                var ximage = this.dialog.getElementsByClassName("Beta")[0];
                ximage.setAttribute("transform","translate(0 " + ybeta + ")");
                var yimage = this.dialog.getElementsByClassName("Gamma")[0];
                yimage.setAttribute("transform","translate(" + xgamma + " 0)");
                var xyimage = this.dialog.getElementsByClassName("BetaGamma")[0];
                xyimage.setAttribute("transform","translate(" + xbg + " " + ybg + ")");
                var nx = this.dialog.getElementsByClassName("NivellXDegrees")[0];
                nx.innerHTML = this.beta.toFixed(2);
                var ny = this.dialog.getElementsByClassName("NivellYDegrees")[0];
                ny.innerHTML = this.gamma.toFixed(2);
            }else{
                var icompas = this.dialog.getElementsByClassName("ImatgeCompas")[0];
                if (icompas != undefined){
                    icompas.setAttribute("transform","translate(" + this.imageTransx + " " + this.imageTransy +
                    ") rotate(" +  this.alfa + " 175 175)");
                }
                var deg = this.dialog.getElementsByClassName("CompassDegrees")[0];
                deg.innerHTML = this.alfa.toFixed(2);
            }
        }catch(error){
            window.alert("2.-" + this.languageConvert("Device orientation: ") + error);
        }
    }
    checkOrientationN(orientation){
        var error = "Undefined";
        try{
            var divcontainer = this.dialog.getElementsByClassName("contenidorNivell")[0];
        }catch(err){
            divcontainer = null ; error = err;
        }
        if (divcontainer == null){
            window.alert("No contenidorNivell: " + error);
            return false;
        }
        try{
            var barraCtrl = this.dialog.getElementsByClassName("barraCtrlNivell")[0];
        }catch(err){
            barraCtrl = null ; error = err;
        }
        if (barraCtrl == null){
            window.alert("No barraCtrlNivell: " + error);
            return false;
        }
        try{
            var divNivell = this.dialog.getElementsByClassName("divNivellSvg")[0];
        }catch(err){
            divNivell = null ; error = err;
        }
        if (divNivell == null){
            window.alert("No divNivellSvg: " + error);
            return false;
        }
        try{
            var nivTextX = this.dialog.getElementsByClassName("NivellTextX")[0];
        }catch(err){
            nivTextX = null ; error = err;
        }
        if (nivTextX == null){
            window.alert("No NivellTextX: " + error);
            return false;
        }
        try{
            var nivTextY = this.dialog.getElementsByClassName("NivellTextY")[0];
        }catch(err){
            nivTextY = null ; error = err;
        }
        if (nivTextY == null){
            window.alert("No NivellTextY: " + error);
            return false;
        }
        try{
            var nivButt = this.dialog.getElementsByClassName("NivellButtons")[0];
        }catch(err){
            nivButt = null ; error = err;
        }
        if (nivButt == null){
            window.alert("No NivellButtons: " + error);
            return false;
        }

        try{
            var giraNiv = this.dialog.getElementsByClassName("giraNivell")[0];
        }catch(err){
            giraNiv = null ; error = err;
        }
        if (giraNiv == null){
            window.alert("No giraNivell: " + error);
            return false;
        }
        switch (orientation){
            case "landscape-primary":
                try{
                    divcontainer.style.flexDirection = "row";
                    barraCtrl.style.order = "1";
                    divNivell.style.order = "2";
                    nivTextX.style.flexDirection = "column";
                    nivTextY.style.flexDirection = "column";
                    nivButt.style.flexDirection = "column";
                    giraNiv.setAttribute("transform","rotate(90 150 150)");
                }catch(error){
                    window.alert(this.languageConvert("Init: ") + error);
                    return false;
                }
                break;
            case "landscape-secondary":
                try{
                    divcontainer.style.flexDirection = "row";
                    barraCtrl.style.order = "2";
                    divNivell.style.order = "1";
                    nivTextX.style.flexDirection = "column";
                    nivTextY.style.flexDirection = "column";
                    nivButt.style.flexDirection = "column";
                    giraNiv.setAttribute("transform","rotate(90 150 150)");
                }catch(error){
                    window.alert(this.languageConvert("Init: ") + error);
                    return false;
                }
                break;
            case "portrait-primary":
                try{
                    divcontainer.style.flexDirection = "column";
                    barraCtrl.style.order = "1";
                    divNivell.style.order = "2";
                    nivTextX.style.flexDirection = "row";
                    nivTextY.style.flexDirection = "row";
                    nivButt.style.flexDirection = "row";
                    giraNiv.setAttribute("transform","");
                }catch(error){
                    window.alert(this.languageConvert("Init: ") + error);
                    return false;
                }
                break;
            case "portrait-secondary":
                try{
                    divcontainer.style.flexDirection = "column";
                    barraCtrl.style.order = "2";
                    divNivell.style.order = "1";
                    nivTextX.style.flexDirection = "row";
                    nivTextY.style.flexDirection = "row";
                    nivButt.style.flexDirection = "row";
                    giraNiv.setAttribute("transform","rotate(180 150 150)");
                }catch(error){
                    window.alert(this.languageConvert("Init: ") + error);
                    return false;
                }
                break;
        }
        return true;
    }

    checkOrientation(orientation){
        var error = "Undefined";
        try{
            var divcontainer = this.dialog.getElementsByClassName("CompassContainer")[0];
        }catch(err){
            divcontainer = null ; error = err;
        }
        if (divcontainer == null){
            window.alert("No CompassContainer: " + error);
            return false;
        }
        try{
            var divBctrl = this.dialog.getElementsByClassName("barraCtrlCompass")[0];
        }catch(err){
            divBctrl = null ; error = err;
        }
        if (divBctrl == null){
            window.alert("No barraCtrlCompass: " + error);
            return false;
        }
        try{
            var compTxt = this.dialog.getElementsByClassName("CompassText")[0];
        }catch(err){
            compTxt = null ; error = err;
        }
        if (compTxt == null){
            window.alert("No CompassText: " + error);
            return false;
        }
        try{
            var compBut = this.dialog.getElementsByClassName("CompassButtons")[0];
        }catch(err){
            compBut = null ; error = err;
        }
        if (compBut == null){
            window.alert("No CompassButtons: " + error);
            return false;
        }
        try{
            var divSvg = this.dialog.getElementsByClassName("divCompassSvg")[0];
        }catch(err){
            divSvg = null ; error = err;
        }
        if (divSvg == null){
            window.alert("No divCompassSvg: " + error);
            return false;
        }
        try{
            var textd = this.dialog.getElementsByClassName("Textdegrees")[0];
        }catch(err){
            textd = null ; error = err;
        }
        if (textd == null){
            window.alert("No Textdegrees: " + error);
            return false;
        }
        try{
            var cdeg = this.dialog.getElementsByClassName("CompassDegrees")[0];
        }catch(err){
            cdeg = null ; error = err;
        }
        if (cdeg == null){
            window.alert("No Textdegrees: " + error);
            return false;
        }
        try{
            var bok = this.dialog.getElementsByClassName("CompassOk")[0];
        }catch(err){
            bok = null ; error = err;
        }
        if (bok == null){
            window.alert("No CompassOk: " + error);
            return false;
        }
        try{
            var bcan = this.dialog.getElementsByClassName("CompassCancel")[0];
        }catch(err){
            bcan = null ; error = err;
        }
        if (bcan == null){
            window.alert("No CompassCancel: " + error);
            return false;
        }
        try{
            var svg = this.dialog.getElementsByClassName("CompassSvg")[0];
        }catch(err){
            svg = null ; error = err;
        }
        if (svg == null){
            window.alert("No CompassSvg: " + error);
            return false;
        }
        try{
            var icompas = this.dialog.getElementsByClassName("ImatgeCompas")[0];
        }catch(err){
            icompas = null ; error = err;
        }
        if (icompas == null){
            window.alert("No ImatgeCompas: "  + error);
            return false;
        }
        try{
            var agulla = this.dialog.getElementsByClassName("AgullaCompas")[0];
        }catch(err){
            agulla = null ; error = err;
        }
        if (agulla == null){
            window.alert("No AgullaCompas: " +error);
            return false;
        }
        switch (orientation){
            case "landscape-primary":
                try{
                    divcontainer.style.flexDirection = "row";
                    divBctrl.style.order = "1";
                    divSvg.style.order = "2";
                    compTxt.style.flexDirection = "column";
                    compBut.style.flexDirection = "column";
                    svg.setAttribute("width","378");
                    svg.setAttribute("height","350");
                    svg.setAttribute("viewBox","0 0 378 350");
                    icompas.setAttribute("transform","translate(28 0)");
                    this.imageTransx = "28";
                    this.imageTransy = "0";
                    agulla.setAttribute("transform","translate(0 156) rotate(270 19 19)");
                }catch(error){
                    window.alert(this.languageConvert("Init: ") + error);
                    return false;
                }
                break;
            case "landscape-secondary":
                try{
                    divcontainer.style.flexDirection = "row";
                    divBctrl.style.order = "2";
                    divSvg.style.order = "1";
                    compTxt.style.flexDirection = "column";
                    compBut.style.flexDirection = "column";
                    svg.setAttribute("width","378");
                    svg.setAttribute("height","350");
                    svg.setAttribute("viewBox","0 0 378 350");
                    icompas.setAttribute("transform","translate(0 0)");
                    this.imageTransx = "0";
                    this.imageTransy = "0";
                    agulla.setAttribute("transform","translate(340 156) rotate(90 19 19)");
                }catch(error){
                    window.alert(this.languageConvert("Init: ") + error);
                    return false;
                }
                break;
            case "portrait-primary":
                try{
                    divcontainer.style.flexDirection = "column";
                    divBctrl.style.order = "1";
                    divSvg.style.order = "2";
                    compTxt.style.flexDirection = "row";
                    compBut.style.flexDirection = "row";
                    svg.setAttribute("width","350");
                    svg.setAttribute("height","378");
                    svg.setAttribute("viewBox","0 0 350 378");
                    icompas.setAttribute("transform","translate(0 28)");
                    this.imageTransx = "0";
                    this.imageTransy = "28";
                    agulla.setAttribute("transform","translate(156 0)");
                }catch(error){
                    window.alert(this.languageConvert("Init: ") + error);
                    return false;
                }
                break;
            case "portrait-secondary":
                try{
                    divcontainer.style.flexDirection = "column";
                    divBctrl.style.order = "2";
                    divSvg.style.order = "1";
                    compTxt.style.flexDirection = "row";
                    compBut.style.flexDirection = "row";
                    svg.setAttribute("width","350");
                    svg.setAttribute("height","378");
                    svg.setAttribute("viewBox","0 0 350 378");
                    icompas.setAttribute("transform","translate(0 0)");
                    this.imageTransx = "0";
                    this.imageTransy = "0";
                    agulla.setAttribute("transform","translate(156 340) rotate(90 19 19)");
                }catch(error){
                    window.alert(this.languageConvert("Init: ")+ error);
                    return false;
                }
                break;
            default:
                window.alert(this.languageConvert("The system does not have the screen orientation"));
                return false;

        }
        return true;
    }
    languageConvert(text){
        switch(text){
            case "Init: ":
                switch(this.prefLang){
                    case "en-us":
                        return text;
                    case "fr-fr":
                        return "Init: ";
                    case "ca-es":
                        return "Inicial: ";
                }
            case "not supported":
                switch(this.prefLang){
                    case "en-us":
                        return text;
                    case "fr-fr":
                        return "non supporté"
                    case "ca-es":
                        return "no suportat";
                }
            case "The system does not have the screen orientation":
                switch(this.prefLang){
                    case "en-us":
                        return text;
                    case "fr-fr":
                        return "Le système n'a pas l'orientation de l'écran";
                    case "ca-es":
                        return "El sistema no té l'orientació de la pantalla";
                }
            case "Device orientation: ":
                switch(this.prefLang){
                    case "en-us":
                        return text;
                    case "fr-fr":
                        return "Orientation de l'appareil: "
                    case "ca-es":
                        return "Orientació del dispositiu: ";
                }
            case "Can not detect Device Orientation":
                switch(this.prefLang){
                    case "en-us":
                        return text;
                    case "fr-fr":
                        return "Impossible de détecter l'orientation de l'appareil"
                    case "ca-es":
                        return "No es pot detectar l'orientació del dispositiu";
                }
            case "Undefined":
                switch(this.prefLang){
                    case "en-us":
                        return text;
                    case "fr-fr":
                        return "indéfini";
                    case "ca-es":
                        return "sense definir";
                }
            case 'Your compass needs calibrating! Wave your device in a figure-eight motion':
                switch(this.prefLang){
                    case "en-us":
                        return text;
                    case "fr-fr":
                        return 'La boussole doit être étalonnée. Dessine un 8 en ondes avec ton téléphone portable ou ta tablette';
                    case "ca-es":
                        return 'El compàs necessita calibratge. Dibuixeu un 8 al aire amb el móbil o la tauleta';
                }
        }
    return text;
    }
}
