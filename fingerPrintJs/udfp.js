// 设备指纹
(function() {
	var //secretKey ='9cWbNgUqiL91raHPVmrP',
		//partnerCode='1000000000TEST',
		//platform='2',
		appKey=window.UDCREDIT_APPKEY||"",
		repeatBones=2,
		//version ='1.0',
		//flashPath = "",
		dfpURL='https://ctest-1.udcredit.com:8443/boss-idm-front/idm/1.0/dfp/collect/platform/web';
			//service.udcredit.com:10000  testfp.udcredit.com
	var minDictionaries={
		adblock:"ad",
		appCodeName:"ac",
		appMinorVersion:"am",
		appName:"an",
		appVersion:"av",
		broswerName:"bn",
		broswerVersion:"bv",
		browserLanguage:"bl",
		canvasCode:"cc",
		cookieCode:"co",
		cookieEnabled:"ce",
		cpuClass:"cp",
		doNotTrack:"nt",
		flashVersion:"fv",
		hasLiedBrowser:"lb",
		hasLiedLanguages:"ll",
		hasLiedOs:"lo",
		hasLiedResolution:"lr",
		historyList:"hl",
		indexedDb:"db",
		javaEnabled:"je",
		jsFonts:"jf",
		localStorage:"ls",
		mimeTypes:"mt",
		onLine:"ol",
		openDatabase:"od",
		partnerCode:"pc",
		platform:"pf",
		plugins:"pg",
		scrAvailHeight:"ah",
		scrAvailWidth:"aw",
		scrColorDepth:"sc",
		scrDeviceXDPI:"sd",
		scrHeight:"sh",
		scrWidth:"sw",
		sdkVersion:"sv",
		sessionStorage:"ss",
		systemKernel:"sk",
		systemLanguage:"sl",
		systemOS:"so",
		timeZone:"tz",
		touchSupport:"ts",
		userAgent:"ua",
		userLanguage:"ul",
		sign:"s"
	};

// -----
	/*
	 * Fingerprintjs2 1.0.3 - Modern & flexible browser fingerprint library v2
	 * https://github.com/Valve/fingerprintjs2 Copyright (c) 2015 Valentin
	 * Vasilyev (valentin.vasilyev@outlook.com) Licensed under the MIT
	 * (http://www.opensource.org/licenses/mit-license.php) license.
	 * 
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
	 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
	 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
	 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL VALENTIN VASILYEV BE LIABLE FOR
	 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
	 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
	 * OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
	 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
	 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
	 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
	 * POSSIBILITY OF SUCH DAMAGE.
	 */

	(function (name, context, definition) {
	  "use strict";
	  if (typeof module !== "undefined" && module.exports) { module.exports = definition(); }
	  else if (typeof define === "function" && define.amd) { define(definition); }
	  else { context[name] = definition(); }
	})("Fingerprint2", this, function() {
	  "use strict";
	  // This will only be polyfilled for IE8 and older
	  // Taken from Mozilla MDC
	  if (!Array.prototype.indexOf) {
	    Array.prototype.indexOf = function(searchElement, fromIndex) {
	      var k;
	      if (this == null) {
	        throw new TypeError("'this' is null or undefined");
	      }
	      var O = Object(this);
	      var len = O.length >>> 0;
	      if (len === 0) {
	        return -1;
	      }
	      var n = +fromIndex || 0;
	      if (Math.abs(n) === Infinity) {
	        n = 0;
	      }
	      if (n >= len) {
	        return -1;
	      }
	      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
	      while (k < len) {
	        if (k in O && O[k] === searchElement) {
	          return k;
	        }
	        k++;
	      }
	      return -1;
	    };
	  }
	  var Fingerprint2 = function(options) {
	    var defaultOptions = {
	      swfContainerId: "fingerprintjs2",
	      swfPath: "../flash/compiled/FontList.swf",
	      detectScreenOrientation: true,
	      sortPluginsFor: [/palemoon/i]
	    };
	    this.options = this.extend(options, defaultOptions);
	    this.nativeForEach = Array.prototype.forEach;
	    this.nativeMap = Array.prototype.map;
	  };
	  Fingerprint2.prototype = {
	    extend: function(source, target) {
	      if (source == null) { return target; }
	      for (var k in source) {
	        if(source[k] != null && target[k] !== source[k]) {
	          target[k] = source[k];
	        }
	      }
	      return target;
	    },
	    log: function(msg){
	      if(window.console){
	        console.log(msg);
	      }
	    },
	    get: function(done){
	      var keys = [];
	      keys = this.userAgentKey(keys);
	      keys = this.languageKey(keys);
	      keys = this.colorDepthKey(keys);
	      keys = this.screenResolutionKey(keys);
	      keys = this.timezoneOffsetKey(keys);
	      keys = this.sessionStorageKey(keys);
	      keys = this.localStorageKey(keys);
	      keys = this.indexedDbKey(keys);
	      keys = this.addBehaviorKey(keys);
	      keys = this.openDatabaseKey(keys);
	      keys = this.cpuClassKey(keys);
	      keys = this.platformKey(keys);
	      keys = this.doNotTrackKey(keys);
	      keys = this.pluginsKey(keys);
	      keys = this.canvasKey(keys);
	      keys = this.webglKey(keys);
	      keys = this.adBlockKey(keys);
	      keys = this.hasLiedLanguagesKey(keys);
	      keys = this.hasLiedResolutionKey(keys);
	      keys = this.hasLiedOsKey(keys);
	      keys = this.hasLiedBrowserKey(keys);
	      keys = this.touchSupportKey(keys);
	      var that = this;
	      this.fontsKey(keys, function(newKeys){
	        var values = [];
	        that.each(newKeys, function(pair) {
	          var value = pair.value;
	          if (typeof pair.value.join !== "undefined") {
	            value = pair.value.join(";");
	          }
	          values.push(value);
	        });
	        var murmur = that.x64hash128(values.join("~~~"), 31);
	        return done(murmur, newKeys);
	      });
	    },
	    userAgentKey: function(keys) {
	      if(!this.options.excludeUserAgent) {
	        keys.push({key: "user_agent", value: this.getUserAgent()});
	      }
	      return keys;
	    },
	    // for tests
	    getUserAgent: function(){
	      return navigator.userAgent;
	    },
	    languageKey: function(keys) {
	      if(!this.options.excludeLanguage) {
	        // IE 9,10 on Windows 10 does not have the `navigator.language`
			// property any longer
	        keys.push({ key: "language", value: navigator.language || navigator.userLanguage || navigator.browserLanguage || navigator.systemLanguage });
	      }
	      return keys;
	    },
	    colorDepthKey: function(keys) {
	      if(!this.options.excludeColorDepth) {
	        keys.push({key: "color_depth", value: screen.colorDepth});
	      }
	      return keys;
	    },
	    screenResolutionKey: function(keys) {
	      if(!this.options.excludeScreenResolution) {
	        return this.getScreenResolution(keys);
	      }
	      return keys;
	    },
	    getScreenResolution: function(keys) {
	      var resolution;
	      var available;
	      if(this.options.detectScreenOrientation) {
	        resolution = (screen.height > screen.width) ? [screen.height, screen.width] : [screen.width, screen.height];
	      } else {
	        resolution = [screen.width, screen.height];
	      }
	      if(typeof resolution !== "undefined") { // headless browsers
	        keys.push({key: "resolution", value: resolution});
	      }
	      if(screen.availWidth && screen.availHeight) {
	        if(this.options.detectScreenOrientation) {
	          available = (screen.availHeight > screen.availWidth) ? [screen.availHeight, screen.availWidth] : [screen.availWidth, screen.availHeight];
	        } else {
	          available = [screen.availHeight, screen.availWidth];
	        }
	      }
	      if(typeof available !== "undefined") { // headless browsers
	        keys.push({key: "available_resolution", value: available});
	      }
	      return keys;
	    },
	    timezoneOffsetKey: function(keys) {
	      if(!this.options.excludeTimezoneOffset) {
	        keys.push({key: "timezone_offset", value: new Date().getTimezoneOffset()});
	      }
	      return keys;
	    },
	    sessionStorageKey: function(keys) {
	      if(!this.options.excludeSessionStorage && this.hasSessionStorage()) {
	        keys.push({key: "session_storage", value: 1});
	      }
	      return keys;
	    },
	    localStorageKey: function(keys) {
	      if(!this.options.excludeSessionStorage && this.hasLocalStorage()) {
	        keys.push({key: "local_storage", value: 1});
	      }
	      return keys;
	    },
	    indexedDbKey: function(keys) {
	      if(!this.options.excludeIndexedDB && this.hasIndexedDB()) {
	        keys.push({key: "indexed_db", value: 1});
	      }
	      return keys;
	    },
	    addBehaviorKey: function(keys) {
	      // body might not be defined at this point or removed
			// programmatically
	      if(document.body && !this.options.excludeAddBehavior && document.body.addBehavior) {
	        keys.push({key: "add_behavior", value: 1});
	      }
	      return keys;
	    },
	    openDatabaseKey: function(keys) {
	      if(!this.options.excludeOpenDatabase && window.openDatabase) {
	        keys.push({key: "open_database", value: 1});
	      }
	      return keys;
	    },
	    cpuClassKey: function(keys) {
	      if(!this.options.excludeCpuClass) {
	        keys.push({key: "cpu_class", value: this.getNavigatorCpuClass()});
	      }
	      return keys;
	    },
	    platformKey: function(keys) {
	      if(!this.options.excludePlatform) {
	        keys.push({key: "navigator_platform", value: this.getNavigatorPlatform()});
	      }
	      return keys;
	    },
	    doNotTrackKey: function(keys) {
	      if(!this.options.excludeDoNotTrack) {
	        keys.push({key: "do_not_track", value: this.getDoNotTrack()});
	      }
	      return keys;
	    },
	    canvasKey: function(keys) {
	      if(!this.options.excludeCanvas && this.isCanvasSupported()) {
	        keys.push({key: "canvas", value: this.getCanvasFp()});
	      }
	      return keys;
	    },
	    webglKey: function(keys) {
	      if(this.options.excludeWebGL) {
	        if(typeof NODEBUG === "undefined"){
	          this.log("Skipping WebGL fingerprinting per excludeWebGL configuration option");
	        }
	        return keys;
	      }
	      if(!this.isWebGlSupported()) {
	        if(typeof NODEBUG === "undefined"){
	          this.log("Skipping WebGL fingerprinting because it is not supported in this browser");
	        }
	        return keys;
	      }
	      keys.push({key: "webgl", value: this.getWebglFp()});
	      return keys;
	    },
	    adBlockKey: function(keys){
	      if(!this.options.excludeAdBlock) {
	        keys.push({key: "adblock", value: this.getAdBlock()});
	      }
	      return keys;
	    },
	    hasLiedLanguagesKey: function(keys){
	      if(!this.options.excludeHasLiedLanguages){
	        keys.push({key: "has_lied_languages", value: this.getHasLiedLanguages()});
	      }
	      return keys;
	    },
	    hasLiedResolutionKey: function(keys){
	      if(!this.options.excludeHasLiedResolution){
	        keys.push({key: "has_lied_resolution", value: this.getHasLiedResolution()});
	      }
	      return keys;
	    },
	    hasLiedOsKey: function(keys){
	      if(!this.options.excludeHasLiedOs){
	        keys.push({key: "has_lied_os", value: this.getHasLiedOs()});
	      }
	      return keys;
	    },
	    hasLiedBrowserKey: function(keys){
	      if(!this.options.excludeHasLiedBrowser){
	        keys.push({key: "has_lied_browser", value: this.getHasLiedBrowser()});
	      }
	      return keys;
	    },
	    fontsKey: function(keys, done) {
	      if (this.options.excludeJsFonts) {
	        return this.flashFontsKey(keys, done);
	      }
	      return this.jsFontsKey(keys, done);
	    },
	    // flash fonts (will increase fingerprinting time 20X to ~ 130-150ms)
	    flashFontsKey: function(keys, done) {
	      if(this.options.excludeFlashFonts) {
	        if(typeof NODEBUG === "undefined"){
	          this.log("Skipping flash fonts detection per excludeFlashFonts configuration option");
	        }
	        return done(keys);
	      }
	      // we do flash if swfobject is loaded
	      if(!this.hasSwfObjectLoaded()){
	        if(typeof NODEBUG === "undefined"){
	          this.log("Swfobject is not detected, Flash fonts enumeration is skipped");
	        }
	        return done(keys);
	      }
	      if(!this.hasMinFlashInstalled()){
	        if(typeof NODEBUG === "undefined"){
	          this.log("Flash is not installed, skipping Flash fonts enumeration");
	        }
	        return done(keys);
	      }
	      if(typeof this.options.swfPath === "undefined"){
	        if(typeof NODEBUG === "undefined"){
	          this.log("To use Flash fonts detection, you must pass a valid swfPath option, skipping Flash fonts enumeration");
	        }
	        return done(keys);
	      }
	      this.loadSwfAndDetectFonts(function(fonts){
	        keys.push({key: "swf_fonts", value: fonts.join(";")});
	        done(keys);
	      });
	    },
	    // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
	    jsFontsKey: function(keys, done) {
	      var that = this;
	      // doing js fonts detection in a pseudo-async fashion
	      return setTimeout(function(){

	        // a font will be compared against all the three default fonts.
	        // and if it doesn't match all 3 then that font is not available.
	        var baseFonts = ["monospace", "sans-serif", "serif"];

	        // we use m or w because these two characters take up the maximum
			// width.
	        // And we use a LLi so that the same matching fonts can get
			// separated
	        var testString = "mmmmmmmmmmlli";

	        // we test using 72px font size, we may use any size. I guess larger
			// the better.
	        var testSize = "72px";

	        var h = document.getElementsByTagName("body")[0];

	        // create a SPAN in the document to get the width of the text we use
			// to test
	        var s = document.createElement("span");
	        s.style.fontSize = testSize;
	        s.innerHTML = testString;
	        var defaultWidth = {};
	        var defaultHeight = {};
	        for (var index in baseFonts) {
	            // get the default width for the three base fonts
	            s.style.fontFamily = baseFonts[index];
	            h.appendChild(s);
	            defaultWidth[baseFonts[index]] = s.offsetWidth; // width for the
																// default font
	            defaultHeight[baseFonts[index]] = s.offsetHeight; // height
																	// for the
																	// defualt
																	// font
	            h.removeChild(s);
	        }
	        var detect = function (font) {
	            var detected = false;
	            for (var index in baseFonts) {
	                s.style.fontFamily = font + "," + baseFonts[index]; // name
																		// of
																		// the
																		// font
																		// along
																		// with
																		// the
																		// base
																		// font
																		// for
																		// fallback.
	                h.appendChild(s);
	                var matched = (s.offsetWidth !== defaultWidth[baseFonts[index]] || s.offsetHeight !== defaultHeight[baseFonts[index]]);
	                h.removeChild(s);
	                detected = detected || matched;
	            }
	            return detected;
	        };
	        var fontList = [
	          "Andale Mono", "Arial", "Arial Black", "Arial Hebrew", "Arial MT", "Arial Narrow", "Arial Rounded MT Bold", "Arial Unicode MS",
	          "Bitstream Vera Sans Mono", "Book Antiqua", "Bookman Old Style",
	          "Calibri", "Cambria", "Cambria Math", "Century", "Century Gothic", "Century Schoolbook", "Comic Sans", "Comic Sans MS", "Consolas", "Courier", "Courier New",
	          "Garamond", "Geneva", "Georgia",
	          "Helvetica", "Helvetica Neue",
	          "Impact",
	          "Lucida Bright", "Lucida Calligraphy", "Lucida Console", "Lucida Fax", "LUCIDA GRANDE", "Lucida Handwriting", "Lucida Sans", "Lucida Sans Typewriter", "Lucida Sans Unicode",
	          "Microsoft Sans Serif", "Monaco", "Monotype Corsiva", "MS Gothic", "MS Outlook", "MS PGothic", "MS Reference Sans Serif", "MS Sans Serif", "MS Serif", "MYRIAD", "MYRIAD PRO",
	          "Palatino", "Palatino Linotype",
	          "Segoe Print", "Segoe Script", "Segoe UI", "Segoe UI Light", "Segoe UI Semibold", "Segoe UI Symbol",
	          "Tahoma", "Times", "Times New Roman", "Times New Roman PS", "Trebuchet MS",
	          "Verdana", "Wingdings", "Wingdings 2", "Wingdings 3"
	        ];
	        var extendedFontList = [
	          "Abadi MT Condensed Light", "Academy Engraved LET", "ADOBE CASLON PRO", "Adobe Garamond", "ADOBE GARAMOND PRO", "Agency FB", "Aharoni", "Albertus Extra Bold", "Albertus Medium", "Algerian", "Amazone BT", "American Typewriter",
	          "American Typewriter Condensed", "AmerType Md BT", "Andalus", "Angsana New", "AngsanaUPC", "Antique Olive", "Aparajita", "Apple Chancery", "Apple Color Emoji", "Apple SD Gothic Neo", "Arabic Typesetting", "ARCHER",
	           "ARNO PRO", "Arrus BT", "Aurora Cn BT", "AvantGarde Bk BT", "AvantGarde Md BT", "AVENIR", "Ayuthaya", "Bandy", "Bangla Sangam MN", "Bank Gothic", "BankGothic Md BT", "Baskerville",
	          "Baskerville Old Face", "Batang", "BatangChe", "Bauer Bodoni", "Bauhaus 93", "Bazooka", "Bell MT", "Bembo", "Benguiat Bk BT", "Berlin Sans FB", "Berlin Sans FB Demi", "Bernard MT Condensed", "BernhardFashion BT", "BernhardMod BT", "Big Caslon", "BinnerD",
	          "Blackadder ITC", "BlairMdITC TT", "Bodoni 72", "Bodoni 72 Oldstyle", "Bodoni 72 Smallcaps", "Bodoni MT", "Bodoni MT Black", "Bodoni MT Condensed", "Bodoni MT Poster Compressed",
	          "Bookshelf Symbol 7", "Boulder", "Bradley Hand", "Bradley Hand ITC", "Bremen Bd BT", "Britannic Bold", "Broadway", "Browallia New", "BrowalliaUPC", "Brush Script MT", "Californian FB", "Calisto MT", "Calligrapher", "Candara",
	          "CaslonOpnface BT", "Castellar", "Centaur", "Cezanne", "CG Omega", "CG Times", "Chalkboard", "Chalkboard SE", "Chalkduster", "Charlesworth", "Charter Bd BT", "Charter BT", "Chaucer",
	          "ChelthmITC Bk BT", "Chiller", "Clarendon", "Clarendon Condensed", "CloisterBlack BT", "Cochin", "Colonna MT", "Constantia", "Cooper Black", "Copperplate", "Copperplate Gothic", "Copperplate Gothic Bold",
	          "Copperplate Gothic Light", "CopperplGoth Bd BT", "Corbel", "Cordia New", "CordiaUPC", "Cornerstone", "Coronet", "Cuckoo", "Curlz MT", "DaunPenh", "Dauphin", "David", "DB LCD Temp", "DELICIOUS", "Denmark",
	          "DFKai-SB", "Didot", "DilleniaUPC", "DIN", "DokChampa", "Dotum", "DotumChe", "Ebrima", "Edwardian Script ITC", "Elephant", "English 111 Vivace BT", "Engravers MT", "EngraversGothic BT", "Eras Bold ITC", "Eras Demi ITC", "Eras Light ITC", "Eras Medium ITC",
	          "EucrosiaUPC", "Euphemia", "Euphemia UCAS", "EUROSTILE", "Exotc350 Bd BT", "FangSong", "Felix Titling", "Fixedsys", "FONTIN", "Footlight MT Light", "Forte",
	          "FrankRuehl", "Fransiscan", "Freefrm721 Blk BT", "FreesiaUPC", "Freestyle Script", "French Script MT", "FrnkGothITC Bk BT", "Fruitger", "FRUTIGER",
	          "Futura", "Futura Bk BT", "Futura Lt BT", "Futura Md BT", "Futura ZBlk BT", "FuturaBlack BT", "Gabriola", "Galliard BT", "Gautami", "Geeza Pro", "Geometr231 BT", "Geometr231 Hv BT", "Geometr231 Lt BT", "GeoSlab 703 Lt BT",
	          "GeoSlab 703 XBd BT", "Gigi", "Gill Sans", "Gill Sans MT", "Gill Sans MT Condensed", "Gill Sans MT Ext Condensed Bold", "Gill Sans Ultra Bold", "Gill Sans Ultra Bold Condensed", "Gisha", "Gloucester MT Extra Condensed", "GOTHAM", "GOTHAM BOLD",
	          "Goudy Old Style", "Goudy Stout", "GoudyHandtooled BT", "GoudyOLSt BT", "Gujarati Sangam MN", "Gulim", "GulimChe", "Gungsuh", "GungsuhChe", "Gurmukhi MN", "Haettenschweiler", "Harlow Solid Italic", "Harrington", "Heather", "Heiti SC", "Heiti TC", "HELV",
	          "Herald", "High Tower Text", "Hiragino Kaku Gothic ProN", "Hiragino Mincho ProN", "Hoefler Text", "Humanst 521 Cn BT", "Humanst521 BT", "Humanst521 Lt BT", "Imprint MT Shadow", "Incised901 Bd BT", "Incised901 BT",
	          "Incised901 Lt BT", "INCONSOLATA", "Informal Roman", "Informal011 BT", "INTERSTATE", "IrisUPC", "Iskoola Pota", "JasmineUPC", "Jazz LET", "Jenson", "Jester", "Jokerman", "Juice ITC", "Kabel Bk BT", "Kabel Ult BT", "Kailasa", "KaiTi", "Kalinga", "Kannada Sangam MN",
	          "Kartika", "Kaufmann Bd BT", "Kaufmann BT", "Khmer UI", "KodchiangUPC", "Kokila", "Korinna BT", "Kristen ITC", "Krungthep", "Kunstler Script", "Lao UI", "Latha", "Leelawadee", "Letter Gothic", "Levenim MT", "LilyUPC", "Lithograph", "Lithograph Light", "Long Island",
	          "Lydian BT", "Magneto", "Maiandra GD", "Malayalam Sangam MN", "Malgun Gothic",
	          "Mangal", "Marigold", "Marion", "Marker Felt", "Market", "Marlett", "Matisse ITC", "Matura MT Script Capitals", "Meiryo", "Meiryo UI", "Microsoft Himalaya", "Microsoft JhengHei", "Microsoft New Tai Lue", "Microsoft PhagsPa", "Microsoft Tai Le",
	          "Microsoft Uighur", "Microsoft YaHei", "Microsoft Yi Baiti", "MingLiU", "MingLiU_HKSCS", "MingLiU_HKSCS-ExtB", "MingLiU-ExtB", "Minion", "Minion Pro", "Miriam", "Miriam Fixed", "Mistral", "Modern", "Modern No. 20", "Mona Lisa Solid ITC TT", "Mongolian Baiti",
	          "MONO", "MoolBoran", "Mrs Eaves", "MS LineDraw", "MS Mincho", "MS PMincho", "MS Reference Specialty", "MS UI Gothic", "MT Extra", "MUSEO", "MV Boli",
	          "Nadeem", "Narkisim", "NEVIS", "News Gothic", "News GothicMT", "NewsGoth BT", "Niagara Engraved", "Niagara Solid", "Noteworthy", "NSimSun", "Nyala", "OCR A Extended", "Old Century", "Old English Text MT", "Onyx", "Onyx BT", "OPTIMA", "Oriya Sangam MN",
	          "OSAKA", "OzHandicraft BT", "Palace Script MT", "Papyrus", "Parchment", "Party LET", "Pegasus", "Perpetua", "Perpetua Titling MT", "PetitaBold", "Pickwick", "Plantagenet Cherokee", "Playbill", "PMingLiU", "PMingLiU-ExtB",
	          "Poor Richard", "Poster", "PosterBodoni BT", "PRINCETOWN LET", "Pristina", "PTBarnum BT", "Pythagoras", "Raavi", "Rage Italic", "Ravie", "Ribbon131 Bd BT", "Rockwell", "Rockwell Condensed", "Rockwell Extra Bold", "Rod", "Roman", "Sakkal Majalla",
	          "Santa Fe LET", "Savoye LET", "Sceptre", "Script", "Script MT Bold", "SCRIPTINA", "Serifa", "Serifa BT", "Serifa Th BT", "ShelleyVolante BT", "Sherwood",
	          "Shonar Bangla", "Showcard Gothic", "Shruti", "Signboard", "SILKSCREEN", "SimHei", "Simplified Arabic", "Simplified Arabic Fixed", "SimSun", "SimSun-ExtB", "Sinhala Sangam MN", "Sketch Rockwell", "Skia", "Small Fonts", "Snap ITC", "Snell Roundhand", "Socket",
	          "Souvenir Lt BT", "Staccato222 BT", "Steamer", "Stencil", "Storybook", "Styllo", "Subway", "Swis721 BlkEx BT", "Swiss911 XCm BT", "Sylfaen", "Synchro LET", "System", "Tamil Sangam MN", "Technical", "Teletype", "Telugu Sangam MN", "Tempus Sans ITC",
	          "Terminal", "Thonburi", "Traditional Arabic", "Trajan", "TRAJAN PRO", "Tristan", "Tubular", "Tunga", "Tw Cen MT", "Tw Cen MT Condensed", "Tw Cen MT Condensed Extra Bold",
	          "TypoUpright BT", "Unicorn", "Univers", "Univers CE 55 Medium", "Univers Condensed", "Utsaah", "Vagabond", "Vani", "Vijaya", "Viner Hand ITC", "VisualUI", "Vivaldi", "Vladimir Script", "Vrinda", "Westminster", "WHITNEY", "Wide Latin",
	          "ZapfEllipt BT", "ZapfHumnst BT", "ZapfHumnst Dm BT", "Zapfino", "Zurich BlkEx BT", "Zurich Ex BT", "ZWAdobeF"];

	        if(that.options.extendedJsFonts) {
	          fontList = fontList.concat(extendedFontList);
	        }
	        var available = [];
	        for (var i = 0, l = fontList.length; i < l; i++) {
	          if(detect(fontList[i])) {
	            available.push(fontList[i]);
	          }
	        }
	        keys.push({key: "js_fonts", value: available});
	        done(keys);
	      }, 1);
	    },
	    pluginsKey: function(keys) {
	      if(!this.options.excludePlugins){
	        if(this.isIE()){
	          keys.push({key: "ie_plugins", value: this.getIEPlugins()});
	        } else {
	          keys.push({key: "regular_plugins", value: this.getRegularPlugins()});
	        }
	      }
	      return keys;
	    },
	    getRegularPlugins: function () {
	      var plugins = [];
	      for(var i = 0, l = navigator.plugins.length; i < l; i++) {
	        plugins.push(navigator.plugins[i]);
	      }
	      // sorting plugins only for those user agents, that we know
			// randomize the plugins
	      // every time we try to enumerate them
	      if(this.pluginsShouldBeSorted()) {
	        plugins = plugins.sort(function(a, b) {
	          if(a.name > b.name){ return 1; }
	          if(a.name < b.name){ return -1; }
	          return 0;
	        });
	      }
	      return this.map(plugins, function (p) {
	        var mimeTypes = this.map(p, function(mt){
	          return [mt.type, mt.suffixes].join("~");
	        }).join(",");
	        return [p.name, p.description, mimeTypes].join("::");
	      }, this);
	    },
	    getIEPlugins: function () {
	      if(window.ActiveXObject){
	        var names = [
	          "AcroPDF.PDF", // Adobe PDF reader 7+
	          "Adodb.Stream",
	          "AgControl.AgControl", // Silverlight
	          "DevalVRXCtrl.DevalVRXCtrl.1",
	          "MacromediaFlashPaper.MacromediaFlashPaper",
	          "Msxml2.DOMDocument",
	          "Msxml2.XMLHTTP",
	          "PDF.PdfCtrl", // Adobe PDF reader 6 and earlier, brrr
	          "QuickTime.QuickTime", // QuickTime
	          "QuickTimeCheckObject.QuickTimeCheck.1",
	          "RealPlayer",
	          "RealPlayer.RealPlayer(tm) ActiveX Control (32-bit)",
	          "RealVideo.RealVideo(tm) ActiveX Control (32-bit)",
	          "Scripting.Dictionary",
	          "SWCtl.SWCtl", // ShockWave player
	          "Shell.UIHelper",
	          "ShockwaveFlash.ShockwaveFlash", // flash plugin
	          "Skype.Detection",
	          "TDCCtl.TDCCtl",
	          "WMPlayer.OCX", // Windows media player
	          "rmocx.RealPlayer G2 Control",
	          "rmocx.RealPlayer G2 Control.1"
	        ];
	        // starting to detect plugins in IE
	        return this.map(names, function(name){
	          try{
	            new ActiveXObject(name); // eslint-disable-no-new
	            return name;
	          } catch(e){
	            return null;
	          }
	        });
	      } else {
	        return [];
	      }
	    },
	    pluginsShouldBeSorted: function () {
	      var should = false;
	      for(var i = 0, l = this.options.sortPluginsFor.length; i < l; i++) {
	        var re = this.options.sortPluginsFor[i];
	        if(navigator.userAgent.match(re)) {
	          should = true;
	          break;
	        }
	      }
	      return should;
	    },
	    touchSupportKey: function (keys) {
	      if(!this.options.excludeTouchSupport){
	        keys.push({key: "touch_support", value: this.getTouchSupport()});
	      }
	      return keys;
	    },
	    hasSessionStorage: function () {
	      try {
	        return !!window.sessionStorage;
	      } catch(e) {
	        return true; // SecurityError when referencing it means it exists
	      }
	    },
	    // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
	    hasLocalStorage: function () {
	      try {
	        return !!window.localStorage;
	      } catch(e) {
	        return true; // SecurityError when referencing it means it exists
	      }
	    },
	    hasIndexedDB: function (){
	      return !!window.indexedDB;
	    },
	    getNavigatorCpuClass: function () {
	      if(navigator.cpuClass){
	        return navigator.cpuClass;
	      } else {
	        return "unknown";
	      }
	    },
	    getNavigatorPlatform: function () {
	      if(navigator.platform) {
	        return navigator.platform;
	      } else {
	        return "unknown";
	      }
	    },
	    getDoNotTrack: function () {
	      if(navigator.doNotTrack) {
	        return navigator.doNotTrack;
	      } else {
	        return "unknown";
	      }
	    },
	    // This is a crude and primitive touch screen detection.
	    // It's not possible to currently reliably detect the availability of a
		// touch screen
	    // with a JS, without actually subscribing to a touch event.
	    // http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
	    // https://github.com/Modernizr/Modernizr/issues/548
	    // method returns an array of 3 values:
	    // maxTouchPoints, the success or failure of creating a TouchEvent,
	    // and the availability of the 'ontouchstart' property
	    getTouchSupport: function () {
	      var maxTouchPoints = 0;
	      var touchEvent = false;
	      if(typeof navigator.maxTouchPoints !== "undefined") {
	        maxTouchPoints = navigator.maxTouchPoints;
	      } else if (typeof navigator.msMaxTouchPoints !== "undefined") {
	        maxTouchPoints = navigator.msMaxTouchPoints;
	      }
	      try {
	        document.createEvent("TouchEvent");
	        touchEvent = true;
	      } catch(_) { /* squelch */ }
	      var touchStart = "ontouchstart" in window;
	      return [maxTouchPoints, touchEvent, touchStart];
	    },
	    // https://www.browserleaks.com/canvas#how-does-it-work
	    getCanvasFp: function() {
	      var result = [];
	      // Very simple now, need to make it more complex (geo shapes etc)
	      var canvas = document.createElement("canvas");
	      canvas.width = 2000;
	      canvas.height = 200;
	      canvas.style.display = "inline";
	      var ctx = canvas.getContext("2d");
	      // detect browser support of canvas winding
	      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
	      // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
	      ctx.rect(0, 0, 10, 10);
	      ctx.rect(2, 2, 6, 6);
	      result.push("canvas winding:" + ((ctx.isPointInPath(5, 5, "evenodd") === false) ? "yes" : "no"));

	      ctx.textBaseline = "alphabetic";
	      ctx.fillStyle = "#f60";
	      ctx.fillRect(125, 1, 62, 20);
	      ctx.fillStyle = "#069";
	      // https://github.com/Valve/fingerprintjs2/issues/66
	      if(this.options.dontUseFakeFontInCanvas) {
	        ctx.font = "11pt Arial";
	      } else {
	        ctx.font = "11pt no-real-font-123";
	      }
	      ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 2, 15);
	      ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
	      ctx.font = "18pt Arial";
	      ctx.fillText("Cwm fjordbank glyphs vext quiz, \ud83d\ude03", 4, 45);

	      // canvas blending
	      // http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
	      // http://jsfiddle.net/NDYV8/16/
	      ctx.globalCompositeOperation = "multiply";
	      ctx.fillStyle = "rgb(255,0,255)";
	      ctx.beginPath();
	      ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
	      ctx.closePath();
	      ctx.fill();
	      ctx.fillStyle = "rgb(0,255,255)";
	      ctx.beginPath();
	      ctx.arc(100, 50, 50, 0, Math.PI * 2, true);
	      ctx.closePath();
	      ctx.fill();
	      ctx.fillStyle = "rgb(255,255,0)";
	      ctx.beginPath();
	      ctx.arc(75, 100, 50, 0, Math.PI * 2, true);
	      ctx.closePath();
	      ctx.fill();
	      ctx.fillStyle = "rgb(255,0,255)";
	      // canvas winding
	      // http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
	      // http://jsfiddle.net/NDYV8/19/
	      ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
	      ctx.arc(75, 75, 25, 0, Math.PI * 2, true);
	      ctx.fill("evenodd");

	      result.push("canvas fp:" + canvas.toDataURL());
	      return result.join("~");
	    },

	    getWebglFp: function() {
	      var gl;
	      var fa2s = function(fa) {
	        gl.clearColor(0.0, 0.0, 0.0, 1.0);
	        gl.enable(gl.DEPTH_TEST);
	        gl.depthFunc(gl.LEQUAL);
	        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	        return "[" + fa[0] + ", " + fa[1] + "]";
	      };
	      var maxAnisotropy = function(gl) {
	        var anisotropy, ext = gl.getExtension("EXT_texture_filter_anisotropic") || gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
	        return ext ? (anisotropy = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 0 === anisotropy && (anisotropy = 2), anisotropy) : null;
	      };
	      gl = this.getWebglCanvas();
	      if(!gl) { return null; }
	      // WebGL fingerprinting is a combination of techniques, found in
			// MaxMind antifraud script & Augur fingerprinting.
	      // First it draws a gradient object with shaders and convers the
			// image to the Base64 string.
	      // Then it enumerates all WebGL extensions & capabilities and
			// appends them to the Base64 string, resulting in a huge WebGL
			// string, potentially very unique on each device
	      // Since iOS supports webgl starting from version 8.1 and 8.1 runs
			// on several graphics chips, the results may be different across
			// ios devices, but we need to verify it.
	      var result = [];
	      var vShaderTemplate = "attribute vec2 attrVertex;varying vec2 varyinTexCoordinate;uniform vec2 uniformOffset;void main(){varyinTexCoordinate=attrVertex+uniformOffset;gl_Position=vec4(attrVertex,0,1);}";
	      var fShaderTemplate = "precision mediump float;varying vec2 varyinTexCoordinate;void main() {gl_FragColor=vec4(varyinTexCoordinate,0,1);}";
	      var vertexPosBuffer = gl.createBuffer();
	      gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
	      var vertices = new Float32Array([-.2, -.9, 0, .4, -.26, 0, 0, .732134444, 0]);
	      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
	      vertexPosBuffer.itemSize = 3;
	      vertexPosBuffer.numItems = 3;
	      var program = gl.createProgram(), vshader = gl.createShader(gl.VERTEX_SHADER);
	      gl.shaderSource(vshader, vShaderTemplate);
	      gl.compileShader(vshader);
	      var fshader = gl.createShader(gl.FRAGMENT_SHADER);
	      gl.shaderSource(fshader, fShaderTemplate);
	      gl.compileShader(fshader);
	      gl.attachShader(program, vshader);
	      gl.attachShader(program, fshader);
	      gl.linkProgram(program);
	      gl.useProgram(program);
	      program.vertexPosAttrib = gl.getAttribLocation(program, "attrVertex");
	      program.offsetUniform = gl.getUniformLocation(program, "uniformOffset");
	      gl.enableVertexAttribArray(program.vertexPosArray);
	      gl.vertexAttribPointer(program.vertexPosAttrib, vertexPosBuffer.itemSize, gl.FLOAT, !1, 0, 0);
	      gl.uniform2f(program.offsetUniform, 1, 1);
	      gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexPosBuffer.numItems);
	      if (gl.canvas != null) { result.push(gl.canvas.toDataURL()); }
	      result.push("extensions:" + gl.getSupportedExtensions().join(";"));
	      result.push("webgl aliased line width range:" + fa2s(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE)));
	      result.push("webgl aliased point size range:" + fa2s(gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)));
	      result.push("webgl alpha bits:" + gl.getParameter(gl.ALPHA_BITS));
	      result.push("webgl antialiasing:" + (gl.getContextAttributes().antialias ? "yes" : "no"));
	      result.push("webgl blue bits:" + gl.getParameter(gl.BLUE_BITS));
	      result.push("webgl depth bits:" + gl.getParameter(gl.DEPTH_BITS));
	      result.push("webgl green bits:" + gl.getParameter(gl.GREEN_BITS));
	      result.push("webgl max anisotropy:" + maxAnisotropy(gl));
	      result.push("webgl max combined texture image units:" + gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS));
	      result.push("webgl max cube map texture size:" + gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE));
	      result.push("webgl max fragment uniform vectors:" + gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
	      result.push("webgl max render buffer size:" + gl.getParameter(gl.MAX_RENDERBUFFER_SIZE));
	      result.push("webgl max texture image units:" + gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));
	      result.push("webgl max texture size:" + gl.getParameter(gl.MAX_TEXTURE_SIZE));
	      result.push("webgl max varying vectors:" + gl.getParameter(gl.MAX_VARYING_VECTORS));
	      result.push("webgl max vertex attribs:" + gl.getParameter(gl.MAX_VERTEX_ATTRIBS));
	      result.push("webgl max vertex texture image units:" + gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS));
	      result.push("webgl max vertex uniform vectors:" + gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS));
	      result.push("webgl max viewport dims:" + fa2s(gl.getParameter(gl.MAX_VIEWPORT_DIMS)));
	      result.push("webgl red bits:" + gl.getParameter(gl.RED_BITS));
	      result.push("webgl renderer:" + gl.getParameter(gl.RENDERER));
	      result.push("webgl shading language version:" + gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	      result.push("webgl stencil bits:" + gl.getParameter(gl.STENCIL_BITS));
	      result.push("webgl vendor:" + gl.getParameter(gl.VENDOR));
	      result.push("webgl version:" + gl.getParameter(gl.VERSION));

	      if (!gl.getShaderPrecisionFormat) {
	        if (typeof NODEBUG === "undefined") {
	          this.log("WebGL fingerprinting is incomplete, because your browser does not support getShaderPrecisionFormat");
	        }
	        return result.join("~");
	      }

	      result.push("webgl vertex shader high float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).precision);
	      result.push("webgl vertex shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMin);
	      result.push("webgl vertex shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT ).rangeMax);
	      result.push("webgl vertex shader medium float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).precision);
	      result.push("webgl vertex shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
	      result.push("webgl vertex shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
	      result.push("webgl vertex shader low float precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).precision);
	      result.push("webgl vertex shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMin);
	      result.push("webgl vertex shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT ).rangeMax);
	      result.push("webgl fragment shader high float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).precision);
	      result.push("webgl fragment shader high float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMin);
	      result.push("webgl fragment shader high float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT ).rangeMax);
	      result.push("webgl fragment shader medium float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).precision);
	      result.push("webgl fragment shader medium float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMin);
	      result.push("webgl fragment shader medium float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT ).rangeMax);
	      result.push("webgl fragment shader low float precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).precision);
	      result.push("webgl fragment shader low float precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMin);
	      result.push("webgl fragment shader low float precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT ).rangeMax);
	      result.push("webgl vertex shader high int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).precision);
	      result.push("webgl vertex shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMin);
	      result.push("webgl vertex shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT ).rangeMax);
	      result.push("webgl vertex shader medium int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).precision);
	      result.push("webgl vertex shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMin);
	      result.push("webgl vertex shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT ).rangeMax);
	      result.push("webgl vertex shader low int precision:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).precision);
	      result.push("webgl vertex shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMin);
	      result.push("webgl vertex shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT ).rangeMax);
	      result.push("webgl fragment shader high int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).precision);
	      result.push("webgl fragment shader high int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMin);
	      result.push("webgl fragment shader high int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT ).rangeMax);
	      result.push("webgl fragment shader medium int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).precision);
	      result.push("webgl fragment shader medium int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMin);
	      result.push("webgl fragment shader medium int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT ).rangeMax);
	      result.push("webgl fragment shader low int precision:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).precision);
	      result.push("webgl fragment shader low int precision rangeMin:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMin);
	      result.push("webgl fragment shader low int precision rangeMax:" + gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT ).rangeMax);
	      return result.join("~");
	    },
	    getAdBlock: function(){
	      var ads = document.createElement("div");
	      ads.setAttribute("id", "ads");
	      try {
	        // body may not exist, that's why we need try/catch
	        document.body.appendChild(ads);
	        return document.getElementById("ads") ? false : true;
	      } catch (e) {
	        return false;
	      }
	    },
	    getHasLiedLanguages: function(){
	      // We check if navigator.language is equal to the first language of
			// navigator.languages
	      if(typeof navigator.languages !== "undefined"){
	        try {
	          var firstLanguages = navigator.languages[0].substr(0, 2);
	          if(firstLanguages !== navigator.language.substr(0, 2)){
	            return true;
	          }
	        } catch(err){
	          return true;
	        }
	      }
	      return false;
	    },
	    getHasLiedResolution: function(){
	      if(screen.width < screen.availWidth){
	        return true;
	      }
	      if(screen.height < screen.availHeight){
	        return true;
	      }
	      return false;
	    },
	    getHasLiedOs: function(){
	      var userAgent = navigator.userAgent.toLowerCase();
	      var oscpu = navigator.oscpu;
	      var platform = navigator.platform.toLowerCase();
	      var os;
	      // We extract the OS from the user agent (respect the order of the
			// if else if statement)
	      if(userAgent.indexOf("windows phone") >= 0){
	        os = "Windows Phone";
	      } else if(userAgent.indexOf("win") >= 0){
	        os = "Windows";
	      } else if(userAgent.indexOf("android") >= 0){
	        os = "Android";
	      } else if(userAgent.indexOf("linux") >= 0){
	        os = "Linux";
	      } else if(userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 ){
	        os = "iOS";
	      } else if(userAgent.indexOf("mac") >= 0){
	        os = "Mac";
	      } else{
	        os = "Other";
	      }
	      // We detect if the person uses a mobile device
	      var mobileDevice;
	      if (("ontouchstart" in window) ||
	           (navigator.maxTouchPoints > 0) ||
	           (navigator.msMaxTouchPoints > 0)) {
	            mobileDevice = true;
	      } else{
	        mobileDevice = false;
	      }

	      if(mobileDevice && os !== "Windows Phone" && os !== "Android" && os !== "iOS" && os !== "Other"){
	        return true;
	      }

	      // We compare oscpu with the OS extracted from the UA
	      if(typeof oscpu !== "undefined"){
	        oscpu = oscpu.toLowerCase();
	        if(oscpu.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
	          return true;
	        } else if(oscpu.indexOf("linux") >= 0 && os !== "Linux" && os !== "Android"){
	          return true;
	        } else if(oscpu.indexOf("mac") >= 0 && os !== "Mac" && os !== "iOS"){
	          return true;
	        } else if(oscpu.indexOf("win") === 0 && oscpu.indexOf("linux") === 0 && oscpu.indexOf("mac") >= 0 && os !== "other"){
	          return true;
	        }
	      }

	      // We compare platform with the OS extracted from the UA
	      if(platform.indexOf("win") >= 0 && os !== "Windows" && os !== "Windows Phone"){
	        return true;
	      } else if((platform.indexOf("linux") >= 0 || platform.indexOf("android") >= 0 || platform.indexOf("pike") >= 0) && os !== "Linux" && os !== "Android"){
	        return true;
	      } else if((platform.indexOf("mac") >= 0 || platform.indexOf("ipad") >= 0 || platform.indexOf("ipod") >= 0 || platform.indexOf("iphone") >= 0) && os !== "Mac" && os !== "iOS"){
	        return true;
	      } else if(platform.indexOf("win") === 0 && platform.indexOf("linux") === 0 && platform.indexOf("mac") >= 0 && os !== "other"){
	        return true;
	      }

	      if(typeof navigator.plugins === "undefined" && os !== "Windows" && os !== "Windows Phone"){
	        // We are are in the case where the person uses ie, therefore we can
			// infer that it's windows
	        return true;
	      }

	      return false;
	    },
	    getHasLiedBrowser: function () {
	      var userAgent = navigator.userAgent.toLowerCase();
	      var productSub = navigator.productSub;

	      // we extract the browser from the user agent (respect the order of
			// the tests)
	      var browser;
	      if(userAgent.indexOf("firefox") >= 0){
	        browser = "Firefox";
	      } else if(userAgent.indexOf("opera") >= 0 || userAgent.indexOf("opr") >= 0){
	        browser = "Opera";
	      } else if(userAgent.indexOf("chrome") >= 0){
	        browser = "Chrome";
	      } else if(userAgent.indexOf("safari") >= 0){
	        browser = "Safari";
	      } else if(userAgent.indexOf("trident") >= 0){
	        browser = "Internet Explorer";
	      } else{
	        browser = "Other";
	      }

	      if((browser === "Chrome" || browser === "Safari" || browser === "Opera") && productSub !== "20030107"){
	        return true;
	      }

	      var tempRes = eval.toString().length;
	      if(tempRes === 37 && browser !== "Safari" && browser !== "Firefox" && browser !== "Other"){
	        return true;
	      } else if(tempRes === 39 && browser !== "Internet Explorer" && browser !== "Other"){
	        return true;
	      } else if(tempRes === 33 && browser !== "Chrome" && browser !== "Opera" && browser !== "Other"){
	        return true;
	      }

	      // We create an error to see how it is handled
	      var errFirefox;
	      try {
	        throw "a";
	      } catch(err){
	        try{
	          err.toSource();
	          errFirefox = true;
	        } catch(errOfErr){
	          errFirefox = false;
	        }
	      }
	      if(errFirefox && browser !== "Firefox" && browser !== "Other"){
	        return true;
	      }
	      return false;
	    },
	    isCanvasSupported: function () {
	      var elem = document.createElement("canvas");
	      return !!(elem.getContext && elem.getContext("2d"));
	    },
	    isWebGlSupported: function() {
	      // code taken from Modernizr
	      if (!this.isCanvasSupported()) {
	        return false;
	      }

	      var canvas = document.createElement("canvas"),
	          glContext;

	      try {
	        glContext = canvas.getContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
	      } catch(e) {
	        glContext = false;
	      }

	      return !!window.WebGLRenderingContext && !!glContext;
	    },
	    isIE: function () {
	      if(navigator.appName === "Microsoft Internet Explorer") {
	        return true;
	      } else if(navigator.appName === "Netscape" && /Trident/.test(navigator.userAgent)) { // IE
																								// 11
	        return true;
	      }
	      return false;
	    },
	    hasSwfObjectLoaded: function(){
	      return typeof window.swfobject !== "undefined";
	    },
	    hasMinFlashInstalled: function () {
	      return swfobject.hasFlashPlayerVersion("9.0.0");
	    },
	    addFlashDivNode: function() {
	      var node = document.createElement("div");
	      node.setAttribute("id", this.options.swfContainerId);
	      document.body.appendChild(node);
	    },
	    loadSwfAndDetectFonts: function(done) {
	      var hiddenCallback = "___fp_swf_loaded";
	      window[hiddenCallback] = function(fonts) {
	        done(fonts);
	      };
	      var id = this.options.swfContainerId;
	      this.addFlashDivNode();
	      var flashvars = { onReady: hiddenCallback};
	      var flashparams = { allowScriptAccess: "always", menu: "false" };
	      swfobject.embedSWF(this.options.swfPath, id, "1", "1", "9.0.0", false, flashvars, flashparams, {});
	    },
	    getWebglCanvas: function() {
	      var canvas = document.createElement("canvas");
	      var gl = null;
	      try {
	        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	      } catch(e) { /* squelch */ }
	      if (!gl) { gl = null; }
	      return gl;
	    },
	    each: function (obj, iterator, context) {
	      if (obj === null) {
	        return;
	      }
	      if (this.nativeForEach && obj.forEach === this.nativeForEach) {
	        obj.forEach(iterator, context);
	      } else if (obj.length === +obj.length) {
	        for (var i = 0, l = obj.length; i < l; i++) {
	          if (iterator.call(context, obj[i], i, obj) === {}) { return; }
	        }
	      } else {
	        for (var key in obj) {
	          if (obj.hasOwnProperty(key)) {
	            if (iterator.call(context, obj[key], key, obj) === {}) { return; }
	          }
	        }
	      }
	    },

	    map: function(obj, iterator, context) {
	      var results = [];
	      // Not using strict equality so that this acts as a
	      // shortcut to checking for `null` and `undefined`.
	      if (obj == null) { return results; }
	      if (this.nativeMap && obj.map === this.nativeMap) { return obj.map(iterator, context); }
	      this.each(obj, function(value, index, list) {
	        results[results.length] = iterator.call(context, value, index, list);
	      });
	      return results;
	    },

	    // / MurmurHash3 related functions

	    //
	    // Given two 64bit ints (as an array of two 32bit ints) returns the two
	    // added together as a 64bit int (as an array of two 32bit ints).
	    //
	    x64Add: function(m, n) {
	      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
	      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
	      var o = [0, 0, 0, 0];
	      o[3] += m[3] + n[3];
	      o[2] += o[3] >>> 16;
	      o[3] &= 0xffff;
	      o[2] += m[2] + n[2];
	      o[1] += o[2] >>> 16;
	      o[2] &= 0xffff;
	      o[1] += m[1] + n[1];
	      o[0] += o[1] >>> 16;
	      o[1] &= 0xffff;
	      o[0] += m[0] + n[0];
	      o[0] &= 0xffff;
	      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
	    },

	    //
	    // Given two 64bit ints (as an array of two 32bit ints) returns the two
	    // multiplied together as a 64bit int (as an array of two 32bit ints).
	    //
	    x64Multiply: function(m, n) {
	      m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
	      n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
	      var o = [0, 0, 0, 0];
	      o[3] += m[3] * n[3];
	      o[2] += o[3] >>> 16;
	      o[3] &= 0xffff;
	      o[2] += m[2] * n[3];
	      o[1] += o[2] >>> 16;
	      o[2] &= 0xffff;
	      o[2] += m[3] * n[2];
	      o[1] += o[2] >>> 16;
	      o[2] &= 0xffff;
	      o[1] += m[1] * n[3];
	      o[0] += o[1] >>> 16;
	      o[1] &= 0xffff;
	      o[1] += m[2] * n[2];
	      o[0] += o[1] >>> 16;
	      o[1] &= 0xffff;
	      o[1] += m[3] * n[1];
	      o[0] += o[1] >>> 16;
	      o[1] &= 0xffff;
	      o[0] += (m[0] * n[3]) + (m[1] * n[2]) + (m[2] * n[1]) + (m[3] * n[0]);
	      o[0] &= 0xffff;
	      return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
	    },
	    //
	    // Given a 64bit int (as an array of two 32bit ints) and an int
	    // representing a number of bit positions, returns the 64bit int (as an
	    // array of two 32bit ints) rotated left by that number of positions.
	    //
	    x64Rotl: function(m, n) {
	      n %= 64;
	      if (n === 32) {
	        return [m[1], m[0]];
	      }
	      else if (n < 32) {
	        return [(m[0] << n) | (m[1] >>> (32 - n)), (m[1] << n) | (m[0] >>> (32 - n))];
	      }
	      else {
	        n -= 32;
	        return [(m[1] << n) | (m[0] >>> (32 - n)), (m[0] << n) | (m[1] >>> (32 - n))];
	      }
	    },
	    //
	    // Given a 64bit int (as an array of two 32bit ints) and an int
	    // representing a number of bit positions, returns the 64bit int (as an
	    // array of two 32bit ints) shifted left by that number of positions.
	    //
	    x64LeftShift: function(m, n) {
	      n %= 64;
	      if (n === 0) {
	        return m;
	      }
	      else if (n < 32) {
	        return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
	      }
	      else {
	        return [m[1] << (n - 32), 0];
	      }
	    },
	    //
	    // Given two 64bit ints (as an array of two 32bit ints) returns the two
	    // xored together as a 64bit int (as an array of two 32bit ints).
	    //
	    x64Xor: function(m, n) {
	      return [m[0] ^ n[0], m[1] ^ n[1]];
	    },
	    //
	    // Given a block, returns murmurHash3's final x64 mix of that block.
	    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
	    // only place where we need to right shift 64bit ints.)
	    //
	    x64Fmix: function(h) {
	      h = this.x64Xor(h, [0, h[0] >>> 1]);
	      h = this.x64Multiply(h, [0xff51afd7, 0xed558ccd]);
	      h = this.x64Xor(h, [0, h[0] >>> 1]);
	      h = this.x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
	      h = this.x64Xor(h, [0, h[0] >>> 1]);
	      return h;
	    },

	    //
	    // Given a string and an optional seed as an int, returns a 128 bit
	    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
	    //
	    x64hash128: function (key, seed) {
	      key = key || "";
	      seed = seed || 0;
	      var remainder = key.length % 16;
	      var bytes = key.length - remainder;
	      var h1 = [0, seed];
	      var h2 = [0, seed];
	      var k1 = [0, 0];
	      var k2 = [0, 0];
	      var c1 = [0x87c37b91, 0x114253d5];
	      var c2 = [0x4cf5ad43, 0x2745937f];
	      for (var i = 0; i < bytes; i = i + 16) {
	        k1 = [((key.charCodeAt(i + 4) & 0xff)) | ((key.charCodeAt(i + 5) & 0xff) << 8) | ((key.charCodeAt(i + 6) & 0xff) << 16) | ((key.charCodeAt(i + 7) & 0xff) << 24), ((key.charCodeAt(i) & 0xff)) | ((key.charCodeAt(i + 1) & 0xff) << 8) | ((key.charCodeAt(i + 2) & 0xff) << 16) | ((key.charCodeAt(i + 3) & 0xff) << 24)];
	        k2 = [((key.charCodeAt(i + 12) & 0xff)) | ((key.charCodeAt(i + 13) & 0xff) << 8) | ((key.charCodeAt(i + 14) & 0xff) << 16) | ((key.charCodeAt(i + 15) & 0xff) << 24), ((key.charCodeAt(i + 8) & 0xff)) | ((key.charCodeAt(i + 9) & 0xff) << 8) | ((key.charCodeAt(i + 10) & 0xff) << 16) | ((key.charCodeAt(i + 11) & 0xff) << 24)];
	        k1 = this.x64Multiply(k1, c1);
	        k1 = this.x64Rotl(k1, 31);
	        k1 = this.x64Multiply(k1, c2);
	        h1 = this.x64Xor(h1, k1);
	        h1 = this.x64Rotl(h1, 27);
	        h1 = this.x64Add(h1, h2);
	        h1 = this.x64Add(this.x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
	        k2 = this.x64Multiply(k2, c2);
	        k2 = this.x64Rotl(k2, 33);
	        k2 = this.x64Multiply(k2, c1);
	        h2 = this.x64Xor(h2, k2);
	        h2 = this.x64Rotl(h2, 31);
	        h2 = this.x64Add(h2, h1);
	        h2 = this.x64Add(this.x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
	      }
	      k1 = [0, 0];
	      k2 = [0, 0];
	      switch(remainder) {
	        case 15:
	          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 14)], 48));
	        case 14:
	          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 13)], 40));
	        case 13:
	          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 12)], 32));
	        case 12:
	          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 11)], 24));
	        case 11:
	          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 10)], 16));
	        case 10:
	          k2 = this.x64Xor(k2, this.x64LeftShift([0, key.charCodeAt(i + 9)], 8));
	        case 9:
	          k2 = this.x64Xor(k2, [0, key.charCodeAt(i + 8)]);
	          k2 = this.x64Multiply(k2, c2);
	          k2 = this.x64Rotl(k2, 33);
	          k2 = this.x64Multiply(k2, c1);
	          h2 = this.x64Xor(h2, k2);
	        case 8:
	          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 7)], 56));
	        case 7:
	          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 6)], 48));
	        case 6:
	          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 5)], 40));
	        case 5:
	          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 4)], 32));
	        case 4:
	          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 3)], 24));
	        case 3:
	          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 2)], 16));
	        case 2:
	          k1 = this.x64Xor(k1, this.x64LeftShift([0, key.charCodeAt(i + 1)], 8));
	        case 1:
	          k1 = this.x64Xor(k1, [0, key.charCodeAt(i)]);
	          k1 = this.x64Multiply(k1, c1);
	          k1 = this.x64Rotl(k1, 31);
	          k1 = this.x64Multiply(k1, c2);
	          h1 = this.x64Xor(h1, k1);
	      }
	      h1 = this.x64Xor(h1, [0, key.length]);
	      h2 = this.x64Xor(h2, [0, key.length]);
	      h1 = this.x64Add(h1, h2);
	      h2 = this.x64Add(h2, h1);
	      h1 = this.x64Fmix(h1);
	      h2 = this.x64Fmix(h2);
	      h1 = this.x64Add(h1, h2);
	      h2 = this.x64Add(h2, h1);
	      return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
	    }
	  };
	  Fingerprint2.VERSION = "1.0.3";
	  return Fingerprint2;
	});
// -----
	/*
	 * CryptoJS v3.1.2 code.google.com/p/crypto-js (c) 2009-2013 by Jeff Mott.
	 * All rights reserved. code.google.com/p/crypto-js/wiki/License
	 */
	var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
	p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
	32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a)}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
	2),16)<<24-4*(f%8);return new p.init(b,c/2)}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},
	r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f}return new p.init(k,f)},clone:function(){var a=k.clone.call(this);
	a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new s.HMAC.init(a,
	d)).finalize(b)}}});var s=e.algo={};return e}(Math);
	(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
	g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l)})();
	(function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
	this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();
	/*
	 * CryptoJS v3.1.2 code.google.com/p/crypto-js (c) 2009-2013 by Jeff Mott.
	 * All rights reserved. code.google.com/p/crypto-js/wiki/License
	 */
	var CryptoJS=CryptoJS||function(h,s){var f={},t=f.lib={},g=function(){},j=t.Base={extend:function(a){g.prototype=this;var c=new g;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
	q=t.WordArray=j.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=s?c:4*a.length},toString:function(a){return(a||u).stringify(this)},concat:function(a){var c=this.words,d=a.words,b=this.sigBytes;a=a.sigBytes;this.clamp();if(b%4)for(var e=0;e<a;e++)c[b+e>>>2]|=(d[e>>>2]>>>24-8*(e%4)&255)<<24-8*((b+e)%4);else if(65535<d.length)for(e=0;e<a;e+=4)c[b+e>>>2]=d[e>>>2];else c.push.apply(c,d);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
	32-8*(c%4);a.length=h.ceil(c/4)},clone:function(){var a=j.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],d=0;d<a;d+=4)c.push(4294967296*h.random()|0);return new q.init(c,a)}}),v=f.enc={},u=v.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++){var e=c[b>>>2]>>>24-8*(b%4)&255;d.push((e>>>4).toString(16));d.push((e&15).toString(16))}return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b+=2)d[b>>>3]|=parseInt(a.substr(b,
	2),16)<<24-4*(b%8);return new q.init(d,c/2)}},k=v.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var d=[],b=0;b<a;b++)d.push(String.fromCharCode(c[b>>>2]>>>24-8*(b%4)&255));return d.join("")},parse:function(a){for(var c=a.length,d=[],b=0;b<c;b++)d[b>>>2]|=(a.charCodeAt(b)&255)<<24-8*(b%4);return new q.init(d,c)}},l=v.Utf8={stringify:function(a){try{return decodeURIComponent(escape(k.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return k.parse(unescape(encodeURIComponent(a)))}},
	x=t.BufferedBlockAlgorithm=j.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=l.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,d=c.words,b=c.sigBytes,e=this.blockSize,f=b/(4*e),f=a?h.ceil(f):h.max((f|0)-this._minBufferSize,0);a=f*e;b=h.min(4*a,b);if(a){for(var m=0;m<a;m+=e)this._doProcessBlock(d,m);m=d.splice(0,a);c.sigBytes-=b}return new q.init(m,b)},clone:function(){var a=j.clone.call(this);
	a._data=this._data.clone();return a},_minBufferSize:0});t.Hasher=x.extend({cfg:j.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){x.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(c,d){return(new a.init(d)).finalize(c)}},_createHmacHelper:function(a){return function(c,d){return(new w.HMAC.init(a,
	d)).finalize(c)}}});var w=f.algo={};return f}(Math);
	(function(h){for(var s=CryptoJS,f=s.lib,t=f.WordArray,g=f.Hasher,f=s.algo,j=[],q=[],v=function(a){return 4294967296*(a-(a|0))|0},u=2,k=0;64>k;){var l;a:{l=u;for(var x=h.sqrt(l),w=2;w<=x;w++)if(!(l%w)){l=!1;break a}l=!0}l&&(8>k&&(j[k]=v(h.pow(u,0.5))),q[k]=v(h.pow(u,1/3)),k++);u++}var a=[],f=f.SHA256=g.extend({_doReset:function(){this._hash=new t.init(j.slice(0))},_doProcessBlock:function(c,d){for(var b=this._hash.words,e=b[0],f=b[1],m=b[2],h=b[3],p=b[4],j=b[5],k=b[6],l=b[7],n=0;64>n;n++){if(16>n)a[n]=
	c[d+n]|0;else{var r=a[n-15],g=a[n-2];a[n]=((r<<25|r>>>7)^(r<<14|r>>>18)^r>>>3)+a[n-7]+((g<<15|g>>>17)^(g<<13|g>>>19)^g>>>10)+a[n-16]}r=l+((p<<26|p>>>6)^(p<<21|p>>>11)^(p<<7|p>>>25))+(p&j^~p&k)+q[n]+a[n];g=((e<<30|e>>>2)^(e<<19|e>>>13)^(e<<10|e>>>22))+(e&f^e&m^f&m);l=k;k=j;j=p;p=h+r|0;h=m;m=f;f=e;e=r+g|0}b[0]=b[0]+e|0;b[1]=b[1]+f|0;b[2]=b[2]+m|0;b[3]=b[3]+h|0;b[4]=b[4]+p|0;b[5]=b[5]+j|0;b[6]=b[6]+k|0;b[7]=b[7]+l|0},_doFinalize:function(){var a=this._data,d=a.words,b=8*this._nDataBytes,e=8*a.sigBytes;
	d[e>>>5]|=128<<24-e%32;d[(e+64>>>9<<4)+14]=h.floor(b/4294967296);d[(e+64>>>9<<4)+15]=b;a.sigBytes=4*d.length;this._process();return this._hash},clone:function(){var a=g.clone.call(this);a._hash=this._hash.clone();return a}});s.SHA256=g._createHelper(f);s.HmacSHA256=g._createHmacHelper(f)})(Math);

// -----
 function base64_encode(str){
                var c1, c2, c3;
                var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
                var i = 0, len= str.length, string = '';

                while (i < len){
                        c1 = str.charCodeAt(i++) & 0xff;
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                                string += "==";
                                break;
                        }
                        c2 = str.charCodeAt(i++);
                        if (i == len){
                                string += base64EncodeChars.charAt(c1 >> 2);
                                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                                string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                                string += "=";
                                break;
                        }
                        c3 = str.charCodeAt(i++);
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                        string += base64EncodeChars.charAt(c3 & 0x3F)
                }
                        return string
        }


	// --------
	var parseDomain=function (str) {
            if (!str) return '';
			if(fnValidateIPAddress(str)){
				return str.replace(/\s/g, "");
			}else{
            if (str.indexOf('://') != -1) str = str.substr(str.indexOf('://') + 3);
            var topLevel = ['com', 'net', 'org', 'gov', 'edu', 'mil', 'biz', 'name', 'info', 'mobi', 'pro', 'travel', 'museum', 'int', 'areo', 'post', 'rec'];
            var domains = str.split('.');
            if (domains.length <= 1) return str;
            if (!isNaN(domains[domains.length - 1])) return str;
            var i = 0;
            while (i < topLevel.length && topLevel[i] != domains[domains.length - 1]) i++;
            if (i != topLevel.length) return '.' +domains[domains.length - 2] + '.' + domains[domains.length - 1];
            else {
                i = 0;
                while (i < topLevel.length && topLevel[i] != domains[domains.length - 2]) i++;
                if (i == topLevel.length) return domains[domains.length - 2] + '.' + domains[domains.length - 1];
                else return '.' +domains[domains.length - 3] + '.' + domains[domains.length - 2] + '.' + domains[domains.length - 1];
            }
		}
        };
// ----------
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message Digest
 * Algorithm, as defined in RFC 1321. Version 2.1 Copyright (C) Paul Johnston
 * 1999 - 2002. Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License See http://pajhome.org.uk/crypt/md5 for
 * more info.
 */

/*
 * Configurable variables. You may need to tweak these to be compatible with the
 * server-side, but the defaults work in most cases.
 */
var hexcase = 0;
/* hex output format. 0 - lowercase; 1 - uppercase */
var b64pad = "";
/* base-64 pad character. "=" for strict RFC compliance */
var chrsz = 8;
/* bits per input character. 8 - ASCII; 16 - Unicode */

/*
 * These are the functions you'll usually want to call They take string
 * arguments and return either hex or base-64 encoded strings
 */
function hex_md5(s) {
    return binl2hex(core_md5(str2binl(s), s.length * chrsz));
}
function b64_md5(s) {
    return binl2b64(core_md5(str2binl(s), s.length * chrsz));
}
function str_md5(s) {
    return binl2str(core_md5(str2binl(s), s.length * chrsz));
}
function hex_hmac_md5(key, data) {
    return binl2hex(core_hmac_md5(key, data));
}
function b64_hmac_md5(key, data) {
    return binl2b64(core_hmac_md5(key, data));
}
function str_hmac_md5(key, data) {
    return binl2str(core_hmac_md5(key, data));
}

/*
 * Perform a simple self-test to see if the VM is working
 */
function md5_vm_test() {
    return hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
}

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5(x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << ((len) % 32);
    x[(((len + 64) >>> 9) << 4) + 14] = len;

    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;

    for (var i = 0; i < x.length; i += 16) {
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;

        a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
        b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
        d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
    }
    return Array(a, b, c, d);

}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn(q, a, b, x, s, t) {
    return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
}
function md5_ff(a, b, c, d, x, s, t) {
    return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function md5_gg(a, b, c, d, x, s, t) {
    return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function md5_hh(a, b, c, d, x, s, t) {
    return md5_cmn(b ^ c ^ d, a, b, x, s, t);
}
function md5_ii(a, b, c, d, x, s, t) {
    return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Calculate the HMAC-MD5, of a key and some data
 */
function core_hmac_md5(key, data) {
    var bkey = str2binl(key);
    if (bkey.length > 16) bkey = core_md5(bkey, key.length * chrsz);

    var ipad = Array(16), opad = Array(16);
    for (var i = 0; i < 16; i++) {
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }

    var hash = core_md5(ipad.concat(str2binl(data)), 512 + data.length * chrsz);
    return core_md5(opad.concat(hash), 512 + 128);
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally to
 * work around bugs in some JS interpreters.
 */
function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Convert a string to an array of little-endian words If chrsz is ASCII,
 * characters >255 have their hi-byte silently ignored.
 */
function str2binl(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz)
        bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (i % 32);
    return bin;
}

/*
 * Convert an array of little-endian words to a string
 */
function binl2str(bin) {
    var str = "";
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < bin.length * 32; i += chrsz)
        str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & mask);
    return str;
}

/*
 * Convert an array of little-endian words to a hex string.
 */
function binl2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
        str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
            hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8  )) & 0xF);
    }
    return str;
}

/*
 * Convert an array of little-endian words to a base-64 string
 */
function binl2b64(binarray) {
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i += 3) {
        var triplet = (((binarray[i >> 2] >> 8 * ( i % 4)) & 0xFF) << 16)
            | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8 )
            | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
        for (var j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binarray.length * 32) str += b64pad;
            else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
        }
    }
    return str;
}

// ----------
var swfobject = function () {
    var D = "undefined", r = "object", S = "Shockwave Flash", W = "ShockwaveFlash.ShockwaveFlash", q = "application/x-shockwave-flash", R = "SWFObjectExprInst", x = "onreadystatechange", O = window, j = document, t = navigator, T = false, U = [ h ], o = [], N = [], I = [], l, Q, E, B, J = false, a = false, n, G, m = true, M = function () {
        var aa = typeof j.getElementById != D
            && typeof j.getElementsByTagName != D
            && typeof j.createElement != D, ah = t.userAgent.toLowerCase(), Y = t.platform
            .toLowerCase(), ae = Y ? /win/.test(Y) : /win/.test(ah), ac = Y ? /mac/
            .test(Y)
            : /mac/.test(ah), af = /webkit/.test(ah) ? parseFloat(ah
            .replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, X = !+"\v1", ag = [
            0, 0, 0 ], ab = null;
        if (typeof t.plugins != D && typeof t.plugins[S] == r) {
            ab = t.plugins[S].description;
            if (ab
                && !(typeof t.mimeTypes != D && t.mimeTypes[q] && !t.mimeTypes[q].enabledPlugin)) {
                T = true;
                X = false;
                ab = ab.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
                ag[0] = parseInt(ab.replace(/^(.*)\..*$/, "$1"), 10);
                ag[1] = parseInt(ab.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
                ag[2] = /[a-zA-Z]/.test(ab) ? parseInt(ab.replace(
                    /^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0
            }
        } else {
            if (typeof O.ActiveXObject != D) {
                try {
                    var ad = new ActiveXObject(W);
                    if (ad) {
                        ab = ad.GetVariable("$version");
                        if (ab) {
                            X = true;
                            ab = ab.split(" ")[1].split(",");
                            ag = [ parseInt(ab[0], 10), parseInt(ab[1], 10),
                                parseInt(ab[2], 10) ]
                        }
                    }
                } catch (Z) {
                }
            }
        }
        return {
            w3: aa,
            pv: ag,
            wk: af,
            ie: X,
            win: ae,
            mac: ac
        }
    }(), k = function () {
        if (!M.w3) {
            return
        }
        if ((typeof j.readyState != D && j.readyState == "complete")
            || (typeof j.readyState == D && (j.getElementsByTagName("body")[0] || j.body))) {
            f()
        }
        if (!J) {
            if (typeof j.addEventListener != D) {
                j.addEventListener("DOMContentLoaded", f, false)
            }
            if (M.ie && M.win) {
                j.attachEvent(x, function () {
                    if (j.readyState == "complete") {
                        j.detachEvent(x, arguments.callee);
                        f()
                    }
                });
                if (O == top) {
                    (function () {
                        if (J) {
                            return
                        }
                        try {
                            j.documentElement.doScroll("left")
                        } catch (X) {
                            setTimeout(arguments.callee, 0);
                            return
                        }
                        f()
                    })()
                }
            }
            if (M.wk) {
                (function () {
                    if (J) {
                        return
                    }
                    if (!/loaded|complete/.test(j.readyState)) {
                        setTimeout(arguments.callee, 0);
                        return
                    }
                    f()
                })()
            }
            s(f)
        }
    }();

    function f() {
        if (J) {
            return
        }
        try {
            var Z = j.getElementsByTagName("body")[0].appendChild(C("span"));
            Z.parentNode.removeChild(Z)
        } catch (aa) {
            return
        }
        J = true;
        var X = U.length;
        for (var Y = 0; Y < X; Y++) {
            U[Y]()
        }
    }

    function K(X) {
        if (J) {
            X()
        } else {
            U[U.length] = X
        }
    }

    function s(Y) {
        if (typeof O.addEventListener != D) {
            O.addEventListener("load", Y, false)
        } else {
            if (typeof j.addEventListener != D) {
                j.addEventListener("load", Y, false)
            } else {
                if (typeof O.attachEvent != D) {
                    i(O, "onload", Y)
                } else {
                    if (typeof O.onload == "function") {
                        var X = O.onload;
                        O.onload = function () {
                            X();
                            Y()
                        }
                    } else {
                        O.onload = Y
                    }
                }
            }
        }
    }

    function h() {
        if (T) {
            V()
        } else {
            H()
        }
    }

    function V() {
        var X = j.getElementsByTagName("body")[0];
        var aa = C(r);
        aa.setAttribute("type", q);
        var Z = X.appendChild(aa);
        if (Z) {
            var Y = 0;
            (function () {
                if (typeof Z.GetVariable != D && typeof Z.GetVariable != "unknown") {
                    var ab = Z.GetVariable("$version");
                    if (ab) {
                        ab = ab.split(" ")[1].split(",");
                        M.pv = [ parseInt(ab[0], 10), parseInt(ab[1], 10),
                            parseInt(ab[2], 10) ]
                    }
                } else {
                    if (Y < 10) {
                        Y++;
                        setTimeout(arguments.callee, 10);
                        return
                    }
                }
                X.removeChild(aa);
                Z = null;
                H()
            })()
        } else {
            H()
        }
    }

    function H() {
        var ag = o.length;
        if (ag > 0) {
            for (var af = 0; af < ag; af++) {
                var Y = o[af].id;
                var ab = o[af].callbackFn;
                var aa = {
                    success: false,
                    id: Y
                };
                if (M.pv[0] > 0) {
                    var ae = c(Y);
                    if (ae) {
                        if (F(o[af].swfVersion) && !(M.wk && M.wk < 312)) {
                            w(Y, true);
                            if (ab) {
                                aa.success = true;
                                aa.ref = z(Y);
                                ab(aa)
                            }
                        } else {
                            if (o[af].expressInstall && A()) {
                                var ai = {};
                                ai.data = o[af].expressInstall;
                                ai.width = ae.getAttribute("width") || "0";
                                ai.height = ae.getAttribute("height") || "0";
                                if (ae.getAttribute("class")) {
                                    ai.styleclass = ae.getAttribute("class")
                                }
                                if (ae.getAttribute("align")) {
                                    ai.align = ae.getAttribute("align")
                                }
                                var ah = {};
                                var X = ae.getElementsByTagName("param");
                                var ac = X.length;
                                for (var ad = 0; ad < ac; ad++) {
                                    if (X[ad].getAttribute("name")
                                        .toLowerCase() != "movie") {
                                        ah[X[ad].getAttribute("name")] = X[ad]
                                            .getAttribute("value")
                                    }
                                }
                                P(ai, ah, Y, ab)
                            } else {
                                p(ae);
                                if (ab) {
                                    ab(aa)
                                }
                            }
                        }
                    }
                } else {
                    w(Y, true);
                    if (ab) {
                        var Z = z(Y);
                        if (Z && typeof Z.SetVariable != D) {
                            aa.success = true;
                            aa.ref = Z
                        }
                        ab(aa)
                    }
                }
            }
        }
    }

    function z(aa) {
        var X = null;
        var Y = c(aa);
        if (Y && Y.nodeName == "OBJECT") {
            if (typeof Y.SetVariable != D) {
                X = Y
            } else {
                var Z = Y.getElementsByTagName(r)[0];
                if (Z) {
                    X = Z
                }
            }
        }
        return X
    }

    function A() {
        return !a && F("6.0.65") && (M.win || M.mac) && !(M.wk && M.wk < 312)
    }

    function P(aa, ab, X, Z) {
        a = true;
        E = Z || null;
        B = {
            success: false,
            id: X
        };
        var ae = c(X);
        if (ae) {
            if (ae.nodeName == "OBJECT") {
                l = g(ae);
                Q = null
            } else {
                l = ae;
                Q = X
            }
            aa.id = R;
            if (typeof aa.width == D
                || (!/%$/.test(aa.width) && parseInt(aa.width, 10) < 310)) {
                aa.width = "310"
            }
            if (typeof aa.height == D
                || (!/%$/.test(aa.height) && parseInt(aa.height, 10) < 137)) {
                aa.height = "137"
            }
            j.title = j.title.slice(0, 47) + " - Flash Player Installation";
            var ad = M.ie && M.win ? "ActiveX" : "PlugIn", ac = "MMredirectURL="
                + O.location.toString().replace(/&/g, "%26")
                + "&MMplayerType=" + ad + "&MMdoctitle=" + j.title;
            if (typeof ab.flashvars != D) {
                ab.flashvars += "&" + ac
            } else {
                ab.flashvars = ac
            }
            if (M.ie && M.win && ae.readyState != 4) {
                var Y = C("div");
                X += "SWFObjectNew";
                Y.setAttribute("id", X);
                ae.parentNode.insertBefore(Y, ae);
                ae.style.display = "none";
                (function () {
                    if (ae.readyState == 4) {
                        ae.parentNode.removeChild(ae)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            }
            u(aa, ab, X)
        }
    }

    function p(Y) {
        if (M.ie && M.win && Y.readyState != 4) {
            var X = C("div");
            Y.parentNode.insertBefore(X, Y);
            X.parentNode.replaceChild(g(Y), X);
            Y.style.display = "none";
            (function () {
                if (Y.readyState == 4) {
                    Y.parentNode.removeChild(Y)
                } else {
                    setTimeout(arguments.callee, 10)
                }
            })()
        } else {
            Y.parentNode.replaceChild(g(Y), Y)
        }
    }

    function g(ab) {
        var aa = C("div");
        if (M.win && M.ie) {
            aa.innerHTML = ab.innerHTML
        } else {
            var Y = ab.getElementsByTagName(r)[0];
            if (Y) {
                var ad = Y.childNodes;
                if (ad) {
                    var X = ad.length;
                    for (var Z = 0; Z < X; Z++) {
                        if (!(ad[Z].nodeType == 1 && ad[Z].nodeName == "PARAM")
                            && !(ad[Z].nodeType == 8)) {
                            aa.appendChild(ad[Z].cloneNode(true))
                        }
                    }
                }
            }
        }
        return aa
    }

    function u(ai, ag, Y) {
        var X, aa = c(Y);
        if (M.wk && M.wk < 312) {
            return X
        }
        if (aa) {
            if (typeof ai.id == D) {
                ai.id = Y
            }
            if (M.ie && M.win) {
                var ah = "";
                for (var ae in ai) {
                    if (ai[ae] != Object.prototype[ae]) {
                        if (ae.toLowerCase() == "data") {
                            ag.movie = ai[ae]
                        } else {
                            if (ae.toLowerCase() == "styleclass") {
                                ah += ' class="' + ai[ae] + '"'
                            } else {
                                if (ae.toLowerCase() != "classid") {
                                    ah += " " + ae + '="' + ai[ae] + '"'
                                }
                            }
                        }
                    }
                }
                var af = "";
                for (var ad in ag) {
                    if (ag[ad] != Object.prototype[ad]) {
                        af += '<param name="' + ad + '" value="' + ag[ad]
                            + '" />'
                    }
                }
                aa.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'
                    + ah + ">" + af + "</object>";
                N[N.length] = ai.id;
                X = c(ai.id)
            } else {
                var Z = C(r);
                Z.setAttribute("type", q);
                for (var ac in ai) {
                    if (ai[ac] != Object.prototype[ac]) {
                        if (ac.toLowerCase() == "styleclass") {
                            Z.setAttribute("class", ai[ac])
                        } else {
                            if (ac.toLowerCase() != "classid") {
                                Z.setAttribute(ac, ai[ac])
                            }
                        }
                    }
                }
                for (var ab in ag) {
                    if (ag[ab] != Object.prototype[ab]
                        && ab.toLowerCase() != "movie") {
                        e(Z, ab, ag[ab])
                    }
                }
                aa.parentNode.replaceChild(Z, aa);
                X = Z
            }
        }
        return X
    }

    function e(Z, X, Y) {
        var aa = C("param");
        aa.setAttribute("name", X);
        aa.setAttribute("value", Y);
        Z.appendChild(aa)
    }

    function y(Y) {
        var X = c(Y);
        if (X && X.nodeName == "OBJECT") {
            if (M.ie && M.win) {
                X.style.display = "none";
                (function () {
                    if (X.readyState == 4) {
                        b(Y)
                    } else {
                        setTimeout(arguments.callee, 10)
                    }
                })()
            } else {
                X.parentNode.removeChild(X)
            }
        }
    }

    function b(Z) {
        var Y = c(Z);
        if (Y) {
            for (var X in Y) {
                if (typeof Y[X] == "function") {
                    Y[X] = null
                }
            }
            Y.parentNode.removeChild(Y)
        }
    }

    function c(Z) {
        var X = null;
        try {
            X = j.getElementById(Z)
        } catch (Y) {
        }
        return X
    }

    function C(X) {
        return j.createElement(X)
    }

    function i(Z, X, Y) {
        Z.attachEvent(X, Y);
        I[I.length] = [ Z, X, Y ]
    }

    function F(Z) {
        var Y = M.pv, X = Z.split(".");
        X[0] = parseInt(X[0], 10);
        X[1] = parseInt(X[1], 10) || 0;
        X[2] = parseInt(X[2], 10) || 0;
        return (Y[0] > X[0] || (Y[0] == X[0] && Y[1] > X[1]) || (Y[0] == X[0]
            && Y[1] == X[1] && Y[2] >= X[2])) ? true : false
    }

    function v(ac, Y, ad, ab) {
        if (M.ie && M.mac) {
            return
        }
        var aa = j.getElementsByTagName("head")[0];
        if (!aa) {
            return
        }
        var X = (ad && typeof ad == "string") ? ad : "screen";
        if (ab) {
            n = null;
            G = null
        }
        if (!n || G != X) {
            var Z = C("style");
            Z.setAttribute("type", "text/css");
            Z.setAttribute("media", X);
            n = aa.appendChild(Z);
            if (M.ie && M.win && typeof j.styleSheets != D
                && j.styleSheets.length > 0) {
                n = j.styleSheets[j.styleSheets.length - 1]
            }
            G = X
        }
        if (M.ie && M.win) {
            if (n && typeof n.addRule == r) {
                n.addRule(ac, Y)
            }
        } else {
            if (n && typeof j.createTextNode != D) {
                n.appendChild(j.createTextNode(ac + " {" + Y + "}"))
            }
        }
    }

    function w(Z, X) {
        if (!m) {
            return
        }
        var Y = X ? "visible" : "hidden";
        if (J && c(Z)) {
            c(Z).style.visibility = Y
        } else {
            v("#" + Z, "visibility:" + Y)
        }
    }

    function L(Y) {
        var Z = /[\\\"<>\.;]/;
        var X = Z.exec(Y) != null;
        return X && typeof encodeURIComponent != D ? encodeURIComponent(Y) : Y
    }

    var d = function () {
        if (M.ie && M.win) {
            window.attachEvent("onunload", function () {
                var ac = I.length;
                for (var ab = 0; ab < ac; ab++) {
                    I[ab][0].detachEvent(I[ab][1], I[ab][2])
                }
                var Z = N.length;
                for (var aa = 0; aa < Z; aa++) {
                    y(N[aa])
                }
                for (var Y in M) {
                    M[Y] = null
                }
                M = null;
                for (var X in swfobject) {
                    swfobject[X] = null
                }
                swfobject = null
            })
        }
    }();
    return {
        registerObject: function (ab, X, aa, Z) {
            if (M.w3 && ab && X) {
                var Y = {};
                Y.id = ab;
                Y.swfVersion = X;
                Y.expressInstall = aa;
                Y.callbackFn = Z;
                o[o.length] = Y;
                w(ab, false)
            } else {
                if (Z) {
                    Z({
                        success: false,
                        id: ab
                    })
                }
            }
        },
        getObjectById: function (X) {
            if (M.w3) {
                return z(X)
            }
        },
        embedSWF: function (ab, ah, ae, ag, Y, aa, Z, ad, af, ac) {
            var X = {
                success: false,
                id: ah
            };
            if (M.w3 && !(M.wk && M.wk < 312) && ab && ah && ae && ag && Y) {
                w(ah, false);
                K(function () {
                    ae += "";
                    ag += "";
                    var aj = {};
                    if (af && typeof af === r) {
                        for (var al in af) {
                            aj[al] = af[al]
                        }
                    }
                    aj.data = ab;
                    aj.width = ae;
                    aj.height = ag;
                    var am = {};
                    if (ad && typeof ad === r) {
                        for (var ak in ad) {
                            am[ak] = ad[ak]
                        }
                    }
                    if (Z && typeof Z === r) {
                        for (var ai in Z) {
                            if (typeof am.flashvars != D) {
                                am.flashvars += "&" + ai + "=" + Z[ai]
                            } else {
                                am.flashvars = ai + "=" + Z[ai]
                            }
                        }
                    }
                    if (F(Y)) {
                        var an = u(aj, am, ah);
                        if (aj.id == ah) {
                            w(ah, true)
                        }
                        X.success = true;
                        X.ref = an
                    } else {
                        if (aa && A()) {
                            aj.data = aa;
                            P(aj, am, ah, ac);
                            return
                        } else {
                            w(ah, true)
                        }
                    }
                    if (ac) {
                        ac(X)
                    }
                })
            } else {
                if (ac) {
                    ac(X)
                }
            }
        },
        switchOffAutoHideShow: function () {
            m = false
        },
        ua: M,
        getFlashPlayerVersion: function () {
            return {
                major: M.pv[0],
                minor: M.pv[1],
                release: M.pv[2]
            }
        },
        hasFlashPlayerVersion: F,
        createSWF: function (Z, Y, X) {
            if (M.w3) {
                return u(Z, Y, X)
            } else {
                return undefined
            }
        },
        showExpressInstall: function (Z, aa, X, Y) {
            if (M.w3 && A()) {
                P(Z, aa, X, Y)
            }
        },
        removeSWF: function (X) {
            if (M.w3) {
                y(X)
            }
        },
        createCSS: function (aa, Z, Y, X) {
            if (M.w3) {
                v(aa, Z, Y, X)
            }
        },
        addDomLoadEvent: K,
        addLoadEvent: s,
        getQueryParamValue: function (aa) {
            var Z = j.location.search || j.location.hash;
            if (Z) {
                if (/\?/.test(Z)) {
                    Z = Z.split("?")[1]
                }
                if (aa == null) {
                    return L(Z)
                }
                var Y = Z.split("&");
                for (var X = 0; X < Y.length; X++) {
                    if (Y[X].substring(0, Y[X].indexOf("=")) == aa) {
                        return L(Y[X].substring((Y[X].indexOf("=") + 1)))
                    }
                }
            }
            return ""
        },
        expressInstallCallback: function () {
            if (a) {
                var X = c(R);
                if (X && l) {
                    X.parentNode.replaceChild(l, X);
                    if (Q) {
                        w(Q, true);
                        if (M.ie && M.win) {
                            l.style.display = "block"
                        }
                    }
                    if (E) {
                        E(B)
                    }
                }
                a = false
            }
        }
    }
}();
// --------------------------
try{
	(function (window) {
	  'use strict';
	  var document = window.document,
	    Image = window.Image,
	    globalStorage = window.globalStorage,
	    swfobject = window.swfobject;

	  try{
	    var localStore = window.localStorage
	  }catch(ex){}
	  
	  try {
	    var sessionStorage = window.sessionStorage;
	  } catch (e) { }

	  function newImage(src) {
	    var img = new Image();
	    img.style.visibility = "hidden";
	    img.style.position = "absolute";
	    img.src = src;
	  }
	  function _ec_replace(str, key, value) {
	    if (str.indexOf("&" + key + "=") > -1 || str.indexOf(key + "=") === 0) {
	      // find start
	      var idx = str.indexOf("&" + key + "="),
	        end, newstr;
	      if (idx === -1) {
	        idx = str.indexOf(key + "=");
	      }
	      // find end
	      end = str.indexOf("&", idx + 1);
	      if (end !== -1) {
	        newstr = str.substr(0, idx) + str.substr(end + (idx ? 0 : 1)) + "&" + key + "=" + value;
	      } else {
	        newstr = str.substr(0, idx) + "&" + key + "=" + value;
	      }
	      return newstr;
	    } else {
	      return str + "&" + key + "=" + value;
	    }
	  }

	 function idb() {
	    if ('indexedDB' in window) {
	        return true
	    } else if (window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB) {
	        return true
	    } else {
	        return false
	    }
	  } 

	  // necessary for flash to communicate with js...
	  // please implement a better way
	  var _global_lso;
	  function _evercookie_flash_var(cookie) {
	    _global_lso = cookie;

	    // remove the flash object now
	    var swf = document.getElementById("myswf");
	    if (swf && swf.parentNode) {
	      swf.parentNode.removeChild(swf);
	    }
	  }

	  /*
		 * Again, ugly workaround....same problem as flash.
		 */
	  var _global_isolated;
	  function onSilverlightLoad(sender, args) {
	    var control = sender.getHost();
	    _global_isolated = control.Content.App.getIsolatedStorage();
	  }

	  function onSilverlightError(sender, args) {
	    _global_isolated = "";
	  }

	  var defaultOptionMap = {
	    history: false, // CSS history knocking or not .. can be network
						// intensive
	    java: false, // Java applet on/off... may prompt users for permission
						// to
					// run.
	    tests: 1,  // 1000 what is it, actually?
	    silverlight: false, // you might want to turn it off
							// https://github.com/samyk/evercookie/issues/45
	    domain: parseDomain((window.location.host).split(':')[0]), // Get
																	// current
																	// domain
																	// '.' +
																	// window.location.host.replace(/:\d+/,
																	// '')
	    baseurl: '', // base url for php, flash and silverlight assets
	    asseturi: '/assets', // assets = .fla, .jar, etc
	    phpuri: '/php', // php file path or route
	    authPath: false, // '/evercookie_auth.php', // set to false to
							// disable Basic Authentication cache
	    pngCookieName: 'evercookie_png',
	    pngPath: '/evercookie_png.php',
	    etagCookieName: 'evercookie_etag',
	    etagPath: '/evercookie_etag.php',
	    cacheCookieName: 'evercookie_cache',
	    cachePath: '/evercookie_cache.php'
	  };
	  
	  var _baseKeyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	  /**
		 * @class Evercookie
		 * @param {Object}
		 *            options
		 * @param {Boolean}
		 *            options.history CSS history knocking or not .. can be
		 *            network intensive
		 * @param {Boolean}
		 *            options.java Java applet on/off... may prompt users for
		 *            permission to run.
		 * @param {Number}
		 *            options.tests
		 * @param {Boolean}
		 *            options.silverlight you might want to turn it off
		 *            https://github.com/samyk/evercookie/issues/45
		 * @param {String}
		 *            options.domain (eg: www.sitename.com use .sitename.com)
		 * @param {String}
		 *            options.baseurl base url (eg: www.sitename.com/demo use
		 *            /demo)
		 * @param {String}
		 *            options.asseturi asset path (eg: www.sitename.com/assets
		 *            use /assets)
		 * @param {String}
		 *            options.phpuri php path/route (eg: www.sitename.com/php
		 *            use /php)
		 * @param {String|Function}
		 *            options.domain as a string, domain for cookie, as a
		 *            function, accept window object and return domain string
		 * @param {String}
		 *            options.pngCookieName
		 * @param {String}
		 *            options.pngPath
		 * @param {String}
		 *            options.etagCookieName:
		 * @param {String}
		 *            options.etagPath
		 * @param {String}
		 *            options.cacheCookieName
		 * @param {String}
		 *            options.cachePath
		 */
	  function Evercookie(options) {
	    options = options || {};
	    var opts = {};
	    for (var key in defaultOptionMap) {
	      var optValue = options[key];
	      if(typeof optValue !== 'undefined') {
	        opts[key] = optValue
	      } else {
	        opts[key] = defaultOptionMap[key];
	      }
	    }
	    if(typeof opts.domain === 'function'){
	      opts.domain = opts.domain(window);
	    }
	    var _ec_history = opts.history,
	      _ec_java =  opts.java,
	      _ec_tests = opts.tests,
	      _ec_baseurl = opts.baseurl,
	      _ec_asseturi = opts.asseturi,
	      _ec_phpuri = opts.phpuri,
	      _ec_domain = opts.domain;

	    // private property
	    var self = this;
	    this._ec = {};

	    this.get = function (name, cb, dont_reset) {
	      self._evercookie(name, cb, undefined, undefined, dont_reset);
	    };

	    this.set = function (name, value) {
	      self._evercookie(name, function () {}, value);
	    };

	    this._evercookie = function (name, cb, value, i, dont_reset) {
	      if (self._evercookie === undefined) {
	        self = this;
	      }
	      if (i === undefined) {
	        i = 0;
	      }
	      // first run
	      if (i === 0) {
	        //self.evercookie_database_storage(name, value);
	        self.evercookie_indexdb_storage(name, value);
	        // self.evercookie_png(name, value);
	       // self.evercookie_etag(name, value);
			  // self.evercookie_cache(name, value);
	      // self.evercookie_lso(name, value);
	        if (opts.authPath) {
	          self.evercookie_auth(name, value);
	        }
	        if (_ec_java) {
	          self.evercookie_java(name, value);
	        }
	        
	        self._ec.userData      = self.evercookie_userdata(name, value);
	        self._ec.cookieData    = self.evercookie_cookie(name, value);
	        self._ec.localData     = self.evercookie_local_storage(name, value);
	        self._ec.globalData    = self.evercookie_global_storage(name, value);
	        self._ec.sessionData   = self.evercookie_session_storage(name, value);
	        self._ec.windowData    = self.evercookie_window(name, value);

	        if (_ec_history) {
	          self._ec.historyData = self.evercookie_history(name, value);
	        }
	      }

	      // when writing data, we need to make sure lso and silverlight
			// object is there
	      if (value !== undefined) {
	        if ((typeof _global_lso === "undefined" ||
	          typeof _global_isolated === "undefined") &&
	          i++ < _ec_tests) {
	          setTimeout(function () {
	            self._evercookie(name, cb, value, i, dont_reset);
	          }, 300);
	        }
	      }

	      // when reading data, we need to wait for swf, db, silverlight, java
			// and png
	      else
	      {
	        if (
	          (
	            // we support local db and haven't read data in yet
	            (window.openDatabase && typeof self._ec.dbData === "undefined") ||
	            (idb() && (typeof self._ec.idbData === "undefined" || self._ec.idbData === "")) ||
	            (typeof _global_lso === "undefined") ||
	            (typeof self._ec.etagData === "undefined") ||
	            (typeof self._ec.cacheData === "undefined") ||
	            (typeof self._ec.javaData === "undefined") ||
	            (document.createElement("canvas").getContext && (typeof self._ec.pngData === "undefined" || self._ec.pngData === "")) ||
	            (typeof _global_isolated === "undefined")
	          ) &&
	          i++ < _ec_tests
	        )
	        {
	          setTimeout(function () {
	            self._evercookie(name, cb, value, i, dont_reset);
	          }, 20);
	        }

	        // we hit our max wait time or got all our data
	        else
	        {
	          // get just the piece of data we need from swf
	          self._ec.lsoData = self.getFromStr(name, _global_lso);
	          _global_lso = undefined;

	          // get just the piece of data we need from silverlight
	          self._ec.slData = self.getFromStr(name, _global_isolated);
	          _global_isolated = undefined;

	          var tmpec = self._ec,
	            candidates = [],
	            bestnum = 0,
	            candidate,
	            item;
	          self._ec = {};

	          // figure out which is the best candidate
	          for (item in tmpec) {
	            if (tmpec[item] && tmpec[item] !== "null" && tmpec[item] !== "undefined") {
	              candidates[tmpec[item]] = candidates[tmpec[item]] === undefined ? 1 : candidates[tmpec[item]] + 1;
	            }
	          }

	          for (item in candidates) {
	            if (candidates[item] > bestnum) {
	              bestnum = candidates[item];
	              candidate = item;
	            }
	          }

	          // reset cookie everywhere
	          if (candidate !== undefined && (dont_reset === undefined || dont_reset !== 1)) {
	            self.set(name, candidate);
	          }
	          if (typeof cb === "function") {
	            cb(candidate, tmpec);
	          }
	        }
	      }
	    };

	    this.evercookie_window = function (name, value) {
	      try {
	        if (value !== undefined) {
	          window.name = _ec_replace(window.name, name, value);
	        } else {
	          return this.getFromStr(name, window.name);
	        }
	      } catch (e) { }
	    };

	    this.evercookie_userdata = function (name, value) {
	      try {
	        var elm = this.createElem("div", "userdata_el", 1);
	        if (elm.addBehavior) {
	          elm.style.behavior = "url(#default#userData)";

	          if (value !== undefined) {
	            elm.setAttribute(name, value);
	            elm.save(name);
	          } else {
	            elm.load(name);
	            return elm.getAttribute(name);
	          }
	        }
	      } catch (e) {}
	    };

// this.ajax = function (settings) {
// var headers, name, transports, transport, i, length;
//
// headers = {
// 'X-Requested-With': 'XMLHttpRequest',
// 'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
// };
//
// transports = [
// function () { return new XMLHttpRequest(); },
// function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
// function () { return new ActiveXObject('Microsoft.XMLHTTP'); }
// ];
//
// for (i = 0, length = transports.length; i < length; i++) {
// transport = transports[i];
// try {
// transport = transport();
// break;
// } catch (e) {
// }
// }
//
// transport.onreadystatechange = function () {
// if (transport.readyState !== 4) {
// return;
// }
// settings.success(transport.responseText);
// };
// transport.open('get', settings.url, true);
// for (name in headers) {
// transport.setRequestHeader(name, headers[name]);
// }
// transport.send();
// };

	    this.evercookie_cache = function (name, value) {
	      if (value !== undefined) {
	        // make sure we have evercookie session defined first
	        document.cookie = opts.cacheCookieName + "=" + value + "; path=/; domain=" + _ec_domain;
	        // {{ajax request to opts.cachePath}} handles caching
	        self.ajax({
	          url: _ec_baseurl + _ec_phpuri + opts.cachePath + "?name=" + name + "&cookie=" + opts.cacheCookieName,
	          success: function (data) {}
	        });
	      } else {
	        // interestingly enough, we want to erase our evercookie
	        // http cookie so the php will force a cached response
	        var origvalue = this.getFromStr(opts.cacheCookieName, document.cookie);
	        self._ec.cacheData = undefined;
	        document.cookie = opts.cacheCookieName + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;

	        self.ajax({
	          url: _ec_baseurl + _ec_phpuri + opts.cachePath + "?name=" + name + "&cookie=" + opts.cacheCookieName,
	          success: function (data) {
	            // put our cookie back
	            document.cookie = opts.cacheCookieName + "=" + origvalue + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;

	            self._ec.cacheData = data;
	          }
	        });
	      }
	    };
	    this.evercookie_auth = function (name, value) {
	      if (value !== undefined) {
	        // {{opts.authPath}} handles Basic Access Authentication
	        newImage('//' + value + '@' + location.host + _ec_baseurl + _ec_phpuri + opts.authPath + "?name=" + name);
	      }
	      else {
	        self.ajax({
	          url: _ec_baseurl + _ec_phpuri + opts.authPath + "?name=" + name,
	          success: function (data) {
	            self._ec.authData = data;
	          }
	        });
	      }
	    };

	    this.evercookie_etag = function (name, value) {
	      if (value !== undefined) {
	        // make sure we have evercookie session defined first
	        document.cookie = opts.etagCookieName + "=" + value + "; path=/; domain=" + _ec_domain;
	        // {{ajax request to opts.etagPath}} handles etagging
	        self.ajax({
	          url: _ec_baseurl + _ec_phpuri + opts.etagPath + "?name=" + name + "&cookie=" + opts.etagCookieName,
	          success: function (data) {}
	        });
	      } else {
	        // interestingly enough, we want to erase our evercookie
	        // http cookie so the php will force a cached response
	        var origvalue = this.getFromStr(opts.etagCookieName, document.cookie);
	        self._ec.etagData = undefined;
	        document.cookie = opts.etagCookieName + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;

	        self.ajax({
	          url: _ec_baseurl + _ec_phpuri + opts.etagPath + "?name=" + name + "&cookie=" + opts.etagCookieName,
	          success: function (data) {
	            // put our cookie back
	            document.cookie = opts.etagCookieName + "=" + origvalue + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;

	            self._ec.etagData = data;
	          }
	        });
	      }
	    };
	    
	    this.evercookie_java = function (name, value) {
	      var div = document.getElementById("ecAppletContainer");

	      // Exit if dtjava.js was not included in the page header.
	      if (typeof dtjava === "undefined") {
		return;
	      }
	      
	      // Create the container div if none exists.
	      if (div===null || div === undefined || !div.length) {
	        div = document.createElement("div");
	        div.setAttribute("id", "ecAppletContainer");
	        div.style.position = "absolute";
	        div.style.top = "-3000px";
	        div.style.left = "-3000px";
	        div.style.width = "1px";
	        div.style.height = "1px";
	        document.body.appendChild(div);
	      }

	      // If the Java applet is not yet defined, embed it.
	      if (typeof ecApplet === "undefined") {
	        dtjava.embed({ 
	        	id: "ecApplet",
	        	url: _ec_baseurl + _ec_asseturi + "/evercookie.jnlp", 
	        	width: "1px", 
	        	height: "1px", 
	        	placeholder: "ecAppletContainer"
	          }, {},{ onJavascriptReady: doSetOrGet });
	        // When the applet is loaded we will continue in doSetOrGet()
	      }
	      else {
		// applet already running... call doGetOrSet() directly.
		doSetOrGet("ecApplet");
	      }
	      
	      function doSetOrGet(appletId) {
		var applet = document.getElementById(appletId);	
	        if (value !== undefined) {
	          applet.set(name,value);
	        }
	        else {
	          self._ec.javaData = applet.get(name);
	        }
	      }
	      
	      // The result of a get() is now in self._ec._javaData
	    };

	    this.evercookie_lso = function (name, value) {
	      var div = document.getElementById("swfcontainer"),
	        flashvars = {},
	        params = {},
	        attributes = {};
	      if (div===null || div === undefined || !div.length) {
	        div = document.createElement("div");
	        div.setAttribute("id", "swfcontainer");
	        document.body.appendChild(div);
	      }

	      if (value !== undefined) {
	        flashvars.everdata = name + "=" + value;
	      }
	      params.swliveconnect = "true";
	      attributes.id        = "myswf";
	      attributes.name      = "myswf";
	      swfobject.embedSWF(_ec_baseurl + _ec_asseturi + "/evercookie.swf", "swfcontainer", "1", "1", "9.0.0", false, flashvars, params, attributes);
	    };

	    this.evercookie_png = function (name, value) {
	      var canvas = document.createElement("canvas"),
	       img, ctx, origvalue;
	      canvas.style.visibility = "hidden";
	      canvas.style.position = "absolute";
	      canvas.width = 200;
	      canvas.height = 1;
	      if (canvas && canvas.getContext) {
	        // {{opts.pngPath}} handles the hard part of generating the image
	        // based off of the http cookie and returning it cached
	        img = new Image();
	        img.style.visibility = "hidden";
	        img.style.position = "absolute";
	        if (value !== undefined) {
	          // make sure we have evercookie session defined first
	          document.cookie = opts.pngCookieName + "=" + value + "; path=/; domain=" + _ec_domain;
	        } else {
	          self._ec.pngData = undefined;
	          ctx = canvas.getContext("2d");

	          // interestingly enough, we want to erase our evercookie
	          // http cookie so the php will force a cached response
	          origvalue = this.getFromStr(opts.pngCookieName, document.cookie);
	          document.cookie = opts.pngCookieName + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;

	          img.onload = function () {
	            // put our cookie back
	            document.cookie = opts.pngCookieName + "=" + origvalue + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;

	            self._ec.pngData = "";
	            ctx.drawImage(img, 0, 0);

	            // get CanvasPixelArray from given coordinates and dimensions
	            var imgd = ctx.getImageData(0, 0, 200, 1),
	              pix = imgd.data, i, n;

	            // loop over each pixel to get the "RGB" values (ignore alpha)
	            for (i = 0, n = pix.length; i < n; i += 4) {
	              if (pix[i] === 0) {
	                break;
	              }
	              self._ec.pngData += String.fromCharCode(pix[i]);
	              if (pix[i + 1] === 0) {
	                break;
	              }
	              self._ec.pngData += String.fromCharCode(pix[i + 1]);
	              if (pix[i + 2] === 0) {
	                break;
	              }
	              self._ec.pngData += String.fromCharCode(pix[i + 2]);
	            }
	          };
	        }
	        img.src = _ec_baseurl + _ec_phpuri + opts.pngPath + "?name=" + name + "&cookie=" + opts.pngCookieName;
	      }
	    };

	    this.evercookie_local_storage = function (name, value) {
	      try {
	        if (localStore) {
	          if (value !== undefined) {
	            localStore.setItem(name, value);
	          } else {
	            return localStore.getItem(name);
	          }
	        }
	      } catch (e) { }
	    };

	    this.evercookie_database_storage = function (name, value) {
	      try {
	        if (window.openDatabase) {
	          var database = window.openDatabase("sqlite_evercookie", "", "evercookie", 1024 * 1024);

	          if (value !== undefined) {
	            database.transaction(function (tx) {
	              tx.executeSql("CREATE TABLE IF NOT EXISTS cache(" +
	                "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
	                "name TEXT NOT NULL, " +
	                "value TEXT NOT NULL, " +
	                "UNIQUE (name)" +
	                ")", [], function (tx, rs) {}, function (tx, err) {});
	              tx.executeSql("INSERT OR REPLACE INTO cache(name, value) " +
	                "VALUES(?, ?)",
	                [name, value], function (tx, rs) {}, function (tx, err) {});
	            });
	          } else {
	            database.transaction(function (tx) {
	              tx.executeSql("SELECT value FROM cache WHERE name=?", [name],
	                function (tx, result1) {
	                  if (result1.rows.length >= 1) {
	                    self._ec.dbData = result1.rows.item(0).value;
	                  } else {
	                    self._ec.dbData = "";
	                  }
	                }, function (tx, err) {});
	            });
	          }
	        }
	      } catch (e) { }
	    };
	 
	    this.evercookie_indexdb_storage = function(name, value) {
	    try {
	    if (!('indexedDB' in window)) {

	        indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
	        IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
	        IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	    }

	    if (indexedDB) {
	        var ver = 1;
	        // FF incognito mode restricts indexedb access
	        var request = indexedDB.open("idb_evercookie", ver);


	        request.onerror = function(e) { ;
	        }

	        request.onupgradeneeded = function(event) {
	            var db = event.target.result;

	            var store = db.createObjectStore("evercookie", {
	                keyPath: "name",
	                unique: false
	            })

	        }

	        if (value !== undefined) {


	            request.onsuccess = function(event) {
	                var idb = event.target.result;
	                if (idb.objectStoreNames.contains("evercookie")) {
	                    var tx = idb.transaction(["evercookie"], "readwrite");
	                    var objst = tx.objectStore("evercookie");
	                    var qr = objst.put({
	                        "name": name,
	                        "value": value
	                    })
	                } idb.close();
	            }

	        } else {

	            request.onsuccess = function(event) {

	                var idb = event.target.result;

	                if (!idb.objectStoreNames.contains("evercookie")) {

	                    self._ec.idbData = undefined;
	                } else {
	                    var tx = idb.transaction(["evercookie"]);
	                    var objst = tx.objectStore("evercookie");
	                    var qr = objst.get(name);

	                    qr.onsuccess = function(event) {
	                        if (qr.result === undefined) {
	                            self._ec.idbData = undefined
	                        } else {
	                            self._ec.idbData = qr.result.value;
	                        }
	                    }
	                }
	           idb.close();
	            }
	        }
	    }
	 } catch (e) {}
	};

	    this.evercookie_session_storage = function (name, value) {
	      try {
	        if (sessionStorage) {
	          if (value !== undefined) {
	            sessionStorage.setItem(name, value);
	          } else {
	            return sessionStorage.getItem(name);
	          }
	        }
	      } catch (e) { }
	    };

	    this.evercookie_global_storage = function (name, value) {
	      if (globalStorage) {
	        var host = this.getHost();
	        try {
	          if (value !== undefined) {
	            globalStorage[host][name] = value;
	          } else {
	            return globalStorage[host][name];
	          }
	        } catch (e) { }
	      }
	    };


	    // public method for encoding
	    this.encode = function (input) {
	      var output = "",
	        chr1, chr2, chr3, enc1, enc2, enc3, enc4,
	        i = 0;

	      input = this._utf8_encode(input);

	      while (i < input.length) {

	        chr1 = input.charCodeAt(i++);
	        chr2 = input.charCodeAt(i++);
	        chr3 = input.charCodeAt(i++);

	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
	        enc4 = chr3 & 63;

	        if (isNaN(chr2)) {
	          enc3 = enc4 = 64;
	        } else if (isNaN(chr3)) {
	          enc4 = 64;
	        }

	        output = output +
	          _baseKeyStr.charAt(enc1) + _baseKeyStr.charAt(enc2) +
	          _baseKeyStr.charAt(enc3) + _baseKeyStr.charAt(enc4);

	      }

	      return output;
	    };

	    // public method for decoding
	    this.decode = function (input) {
	      var output = "",
	        chr1, chr2, chr3,
	        enc1, enc2, enc3, enc4,
	        i = 0;

	      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	      while (i < input.length) {
	        enc1 = _baseKeyStr.indexOf(input.charAt(i++));
	        enc2 = _baseKeyStr.indexOf(input.charAt(i++));
	        enc3 = _baseKeyStr.indexOf(input.charAt(i++));
	        enc4 = _baseKeyStr.indexOf(input.charAt(i++));

	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;

	        output = output + String.fromCharCode(chr1);

	        if (enc3 !== 64) {
	          output = output + String.fromCharCode(chr2);
	        }
	        if (enc4 !== 64) {
	          output = output + String.fromCharCode(chr3);
	        }
	      }
	      output = this._utf8_decode(output);
	      return output;
	    };

	    // private method for UTF-8 encoding
	    this._utf8_encode = function (str) {
	      str = str.replace(/\r\n/g, "\n");
	      var utftext = "", i = 0, n = str.length, c;
	      for (; i < n; i++) {
	        c = str.charCodeAt(i);
	        if (c < 128) {
	          utftext += String.fromCharCode(c);
	        } else if ((c > 127) && (c < 2048)) {
	          utftext += String.fromCharCode((c >> 6) | 192);
	          utftext += String.fromCharCode((c & 63) | 128);
	        } else {
	          utftext += String.fromCharCode((c >> 12) | 224);
	          utftext += String.fromCharCode(((c >> 6) & 63) | 128);
	          utftext += String.fromCharCode((c & 63) | 128);
	        }
	      }
	      return utftext;
	    };

	    // private method for UTF-8 decoding
	    this._utf8_decode = function (utftext) {
	      var str = "",
	      i = 0, n = utftext.length,
	      c = 0, c1 = 0, c2 = 0, c3 = 0;
	      while (i < n) {
	        c = utftext.charCodeAt(i);
	        if (c < 128) {
	          str += String.fromCharCode(c);
	          i += 1;
	        } else if ((c > 191) && (c < 224)) {
	          c2 = utftext.charCodeAt(i + 1);
	          str += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
	          i += 2;
	        } else {
	          c2 = utftext.charCodeAt(i + 1);
	          c3 = utftext.charCodeAt(i + 2);
	          str += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
	          i += 3;
	        }
	      }
	      return str;
	    };

	    // this is crazy but it's 4am in dublin and i thought this would be
		// hilarious
	    // blame the guinness
	    this.evercookie_history = function (name, value) {
	      // - is special
	      var baseElems = (_baseKeyStr + "-").split(""),
	        // sorry google.
	        url = "http://www.bsfit.com.cn/evercookie/cache/" + this.getHost() + "/" + name,
	        i, base,
	        letter = "",
	        val = "",
	        found = 1;

	      if (value !== undefined) {
	        // don't reset this if we already have it set once
	        // too much data and you can't clear previous values
	        if (this.hasVisited(url)) {
	          return;
	        }

	        this.createIframe(url, "if");
	        url = url + "/";

	        base = this.encode(value).split("");
	        for (i = 0; i < base.length; i++) {
	          url = url + base[i];
	          this.createIframe(url, "if" + i);
	        }

	        // - signifies the end of our data
	        url = url + "-";
	        this.createIframe(url, "if_");
	      } else {
	        // omg you got csspwn3d
	        if (this.hasVisited(url)) {
	          url = url + "/";

	          while (letter !== "-" && found === 1) {
	            found = 0;
	            for (i = 0; i < baseElems.length; i++) {
	              if (this.hasVisited(url + baseElems[i])) {
	                letter = baseElems[i];
	                if (letter !== "-") {
	                  val = val + letter;
	                }
	                url = url + letter;
	                found = 1;
	                break;
	              }
	            }
	          }

	          // lolz
	          return this.decode(val);
	        }
	      }
	    };

	    this.createElem = function (type, name, append) {
	      var el;
	      if (name !== undefined && document.getElementById(name)) {
	        el = document.getElementById(name);
	      } else {
	        el = document.createElement(type);
	      }
	      el.style.visibility = "hidden";
	      el.style.position = "absolute";

	      if (name) {
	        el.setAttribute("id", name);
	      }

	      if (append) {
	        document.body.appendChild(el);
	      }
	      return el;
	    };

	    this.createIframe = function (url, name) {
	      var el = this.createElem("iframe", name, 1);
	      el.setAttribute("src", url);
	      return el;
	    };

	    // wait for our swfobject to appear (swfobject.js to load)
	    var waitForSwf = this.waitForSwf = function (i) {
	      if (i === undefined) {
	        i = 0;
	      } else {
	        i++;
	      }

	      // wait for ~2 seconds for swfobject to appear
	      if (i < _ec_tests && typeof swfobject === "undefined") {
	        setTimeout(function () {
	          waitForSwf(i);
	        }, 300);
	      }
	    };

	    this.evercookie_cookie = function (name, value) {
	      if (value !== undefined) {
	        // expire the cookie first
	        document.cookie = name + "=; expires=Mon, 20 Sep 2010 00:00:00 UTC; path=/; domain=" + _ec_domain;
	        document.cookie = name + "=" + value + "; expires=Tue, 31 Dec 2030 00:00:00 UTC; path=/; domain=" + _ec_domain;
	      } else {
	        return this.getFromStr(name, document.cookie);
	      }
	    };

	    // get value from param-like string (eg, "x=y&name=VALUE")
	    this.getFromStr = function (name, text) {
	      if (typeof text !== "string") {
	        return;
	      }
	      var nameEQ = name + "=",
	        ca = text.split(/[;&]/),
	        i, c;
	      for (i = 0; i < ca.length; i++) {
	        c = ca[i];
	        while (c.charAt(0) === " ") {
	          c = c.substring(1, c.length);
	        }
	        if (c.indexOf(nameEQ) === 0) {
	          return c.substring(nameEQ.length, c.length);
	        }
	      }
	    };

	    this.getHost = function () {
	      // return window.location.host.replace(/:\d+/, '');
	    	return parseDomain((window.location.host).split(':')[0]);
	    };

	    this.toHex = function (str) {
	      var r = "",
	        e = str.length,
	        c = 0,
	        h;
	      while (c < e) {
	        h = str.charCodeAt(c++).toString(16);
	        while (h.length < 2) {
	          h = "0" + h;
	        }
	        r += h;
	      }
	      return r;
	    };

	    this.fromHex = function (str) {
	      var r = "",
	        e = str.length,
	        s;
	      while (e >= 0) {
	        s = e - 2;
	        r = String.fromCharCode("0x" + str.substring(s, e)) + r;
	        e = s;
	      }
	      return r;
	    };

	    /**
		 * css history knocker (determine what sites your visitors have been to)
		 * 
		 * originally by Jeremiah Grossman
		 * http://jeremiahgrossman.blogspot.com/2006/08/i-know-where-youve-been.html
		 * 
		 * ported to additional browsers by Samy Kamkar
		 * 
		 * compatible with ie6, ie7, ie8, ff1.5, ff2, ff3, opera, safari,
		 * chrome, flock - code@samy.pl
		 */
	    this.hasVisited = function (url) {
	      if (this.no_color === -1) {
	        var no_style = this._getRGB("http://bsfit-was-here-this-should-never-be-visited.com", -1);
	        if (no_style === -1) {
	          this.no_color = this._getRGB("http://bsfit-was-here-" + Math.floor(Math.random() * 9999999) + "rand.com");
	        }
	      }

	      // did we give full url?
	      if (url.indexOf("https:") === 0 || url.indexOf("http:") === 0) {
	        return this._testURL(url, this.no_color);
	      }

	      // if not, just test a few diff types if (exact)
	      return this._testURL("http://" + url, this.no_color) ||
	        this._testURL("https://" + url, this.no_color) ||
	        this._testURL("http://www." + url, this.no_color) ||
	        this._testURL("https://www." + url, this.no_color);
	    };

	    /* create our anchor tag */
	    var _link = this.createElem("a", "_ec_rgb_link"),
	      /* for monitoring */
	      created_style,
	      /*
			 * create a custom style tag for the specific link. Set the CSS
			 * visited selector to a known value
			 */
	      _cssText = "#_ec_rgb_link:visited{display:none;color:#FF0000}",
		  style;

	    /* Methods for IE6, IE7, FF, Opera, and Safari */
	    try {
	      created_style = 1;
	      style = document.createElement("style");
	      if (style.styleSheet) {
	        style.styleSheet.innerHTML = _cssText;
	      } else if (style.innerHTML) {
	        style.innerHTML = _cssText;
	      } else {
	        style.appendChild(document.createTextNode(_cssText));
	      }
	    } catch (e) {
	      created_style = 0;
	    }

	    /* if test_color, return -1 if we can't set a style */
	    this._getRGB = function (u, test_color) {
	      if (test_color && created_style === 0) {
	        return -1;
	      }

	      /* create the new anchor tag with the appropriate URL information */
	      _link.href = u;
	      _link.innerHTML = u;
	      // not sure why, but the next two appendChilds always have to happen
			// vs just once
	      document.body.appendChild(style);
	      document.body.appendChild(_link);

	      /* add the link to the DOM and save the visible computed color */
	      var color;
	      if (document.defaultView) {
	        if (document.defaultView.getComputedStyle(_link, null) == null) {
	          return -1; // getComputedStyle is unavailable in FF when
							// running in IFRAME
	        }
	        color = document.defaultView.getComputedStyle(_link, null).getPropertyValue("color");
	      } else {
	        color = _link.currentStyle.color;
	      }
	      return color;
	    };

	    this._testURL = function (url, no_color) {
	      var color = this._getRGB(url);

	      /*
			 * check to see if the link has been visited if the computed color
			 * is red
			 */
	      if (color === "rgb(255, 0, 0)" || color === "#ff0000") {
	        return 1;
	      } else if (no_color && color !== no_color) {
	        /* if our style trick didn't work, just compare default style colors */
	        return 1;
	      }
	      /* not found */
	      return 0;
	    };

	  };

	  window._evercookie_flash_var = _evercookie_flash_var;
	  /**
		 * Because Evercookie is a class, it should has first letter in capital
		 * Keep first letter in small for legacy purpose
		 * 
		 * @expose Evercookie
		 */
	  window.evercookie = window.Evercookie = Evercookie;
	}(window));
	}catch(ex){}
// --------------------------
/**
 * 
 * 
 * @type {evercookie}
 */
function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}
function setCookie(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if (expires != -1) {
        expires = expires * 1000 * 60 * 60 * 24;
        var expires_date = new Date(today.getTime() + (expires));
        cookieString = name + "=" + escape(value)
            + ((expires) ? ";expires=" + expires_date.toGMTString() : "")
            + ((path) ? ";path=" + path : "")
            + ((domain) ? ";domain=" + domain : "")
            + ((secure) ? ";secure" : "")
    } else {
        var expires_date = -1;
        cookieString = name + "=" + escape(value)
            + ((expires) ? ";expires=" + expires_date : "")
            + ((path) ? ";path=" + path : "")
            + ((domain) ? ";domain=" + domain : "")
            + ((secure) ? ";secure" : "")
    }
    document.cookie = cookieString
}
function checkCookie(cookieId, cookieValue, expires) {
    var value = getCookie(cookieId);
    if (value != cookieValue) {
        value = null
    }
    if (value != null && value != "") {
        return
    } else {
        if (cookieValue == null) {
            value = makeid()
        } else {
            value = cookieValue
        }
        if (value != null && value != "") {
            if (expires == -1) {
                setCookie(cookieId, value, expires, "/", parseDomain((window.location.host).split(':')[0]), null)
            } else {
                expires = 3000;
                setCookie(cookieId, value, expires, "/", parseDomain((window.location.host).split(':')[0]), null)
            }
        }
    }
}
function fnValidateIPAddress(ipaddr) {
    ipaddr = ipaddr.replace(/\s/g, "");
    var re = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    if (re.test(ipaddr)) {
        var parts = ipaddr.split(".");
        if (parseInt(parseFloat(parts[0])) == 0) {
            return false
        }
        if (parseInt(parseFloat(parts[3])) == 0) {
            return false
        }
        for (var i = 0; i < parts.length; i++) {
            if (parseInt(parseFloat(parts[i])) > 255) {
                return false
            }
        }
        return true
    } else {
        return false
    }
}
function trimDomain() {
    values = document.domain.split(".");
    if (values.length == 1) {
        return null
    } else {
        if (fnValidateIPAddress(document.domain)) {
            return null
        } else {
            document.domain = document.domain.substr(values[0].length + 1);
            return document.domain
        }
    }
}
function makeid() {
    var res = "";
    var chars = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B",
        "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O",
        "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ];
    for (var i = 0; i < 32; i++) {
        var id = Math.ceil(Math.random() * 35);
        res += chars[id]
    }
    return res
}
function prepareIframe() {
}
function PackageContent(key,value){
	this.key = key;
	this.value = value;
}
var 
    newCookie = "",
    cookiePrefix = "UDCREDIT_DEVICEID",
    frmsDomain = null,
    arrayCount = 0,
    expTim = 0,
    repostTimeOut =0,
    unique2Name = "UDCREDIT_OkLJUJ";
	
function setCookie(cookiename, cookievalue, days) {
    var date = new Date();
    date.setTime(date.getTime() + Number(days) * 24 * 3600 * 1000);
    document.cookie = cookiename + "=" + cookievalue + "; path=/;expires = " + date.toGMTString()+';domain='+parseDomain((window.location.host).split(':')[0]);
}

function FingerPrint() {
this.ec = new evercookie();
this.deviceEc = new evercookie();
this.cfp = new Fingerprint2(); 
this.moreInfoArray = [];
}
FingerPrint.prototype = {
    constructor: FingerPrint(),
    checkBroswer: function () {
        var broswer = checkIEVersion();
        function checkIEVersion() {
            var ua = navigator.userAgent.toString();
            var s = "MSIE";
            var i = ua.indexOf(s);
            if (i >= 0) {
                broswer = "IE"
            } else {
                broswer = "other"
            }
            return broswer
        }
    },
    checkOperaBroswer: function () {
        return window.opera
    },
    getCanvansCode: function (canvasCode) {
        return  new PackageContent("canvasCode", canvasCode);
    },
    getCookieCode: function () {
    	// console.log("cookieCode"+getCookie(unique2Name))
        return   new PackageContent("cookieCode", getCookie(unique2Name));
    },
    getUserAgent: function () {
           return  new PackageContent("userAgent", navigator.userAgent.toString());
    },
    getScrHeight: function () {
    	return  new PackageContent("scrHeight", window.screen.height.toString());
    },
    getScrWidth: function () {
    	return  new PackageContent("scrWidth", window.screen.width.toString());
    },
    getScrAvailHeight: function () {
    	return  new PackageContent("scrAvailHeight", window.screen.availHeight.toString());
    },
    getScrAvailWidth: function () {
    	return  new PackageContent("scrAvailWidth", window.screen.availWidth.toString());
    },
    md5ScrColorDepth: function () {
    	return  new PackageContent("scrColorDepth", window.screen.colorDepth.toString());
    },
    getScrDeviceXDPI: function () {
        var ScrColorDepth="";
        if (this.checkBroswer() == "IE") {
        	ScrColorDepth = window.screen.deviceXDPI.toString();
        } else {
        	ScrColorDepth = "";
        }
    	return   new PackageContent("scrDeviceXDPI", ScrColorDepth);
    },
    getAppCodeName: function () {
    	return  new PackageContent("appCodeName", navigator.appCodeName.toString());
    },
    getAppName: function () {
    	return  new PackageContent("appName", navigator.appName.toString());
    },
    getAppVersion: function () {
    	return  new PackageContent("appVersion", navigator.appVersion.toString());
    },
    // 获取浏览器是否支持java，chrome于ver45.0.00开始不支持java，
    // Firefox没有明确指出不支持java，不过测试结果也是不支持。IE现在暂时支持java.
    // 国内的360浏览器还是支持java存在的
    getJavaEnabled: function () {
    	return  new PackageContent("javaEnabled", navigator.javaEnabled().toString());
    },
    getMimeTypes: function () {
    	var mimelist =  navigator.mimeTypes;
    	var mimeTypeStr = "";
    	    	for(var i=0;i<mimelist.length;i++){
    	    		mimeTypeStr+= mimelist[i].type+"#";
    	    	}
    	    	
    	return new PackageContent("mimeTypes",mimeTypeStr.substr(0,mimeTypeStr.length-1));
    },
    getPlatform: function () {
    	return  new PackageContent("platform", navigator.platform.length.toString());
    },
    getAppMinorVersion: function () {
        var appMinorVersion="";
        if (this.checkBroswer() == "IE") {
            appMinorVersion = navigator.appMinorVersion.toString();
               
        } else {
        	appMinorVersion = ""
        }
    	return  new PackageContent("appMinorVersion", appMinorVersion);
    },
    getBrowserLanguage: function () {
        var browserLanguage="";
        if (this.checkBroswer() == "IE" || this.checkOperaBroswer()) {
        	browserLanguage = navigator.browserLanguage.toString();
        } else {
        	browserLanguage = this.getLanguage();
        }
    	return  new PackageContent("browserLanguage", browserLanguage);
    },
    getLanguage: function () {
        if (navigator.language != null) {
            return  navigator.language.toString();
        } else {
            return   "";
        }
    },
    getCookieEnabled: function () {
    	return  new PackageContent("cookieEnabled", navigator.cookieEnabled.toString());
    },
    getCpuClass: function () {
        var cpuClass;
        if (this.checkBroswer() == "IE") {
        	cpuClass = navigator.cpuClass.toString();
        } else {
        	cpuClass = ""
        }
    	return  new PackageContent("cpuClass", cpuClass);
    },
    getOnLine: function () {
    	return  new PackageContent("onLine", navigator.onLine.toString());
    },
    getSystemLanguage: function () {
        var systemLanguage ="";
        if (this.checkBroswer() == "IE" || this.checkOperaBroswer()) {
        	systemLanguage = navigator.systemLanguage.toString();
        } else {
        	systemLanguage = ""
        }
    	return  new PackageContent("systemLanguage", systemLanguage);
    },
    getUserLanguage: function () {
        var userLanguage = "";
        if (this.checkBroswer() == "IE" || this.checkOperaBroswer()) {
        	userLanguage = navigator.userLanguage.toString()
        } else {
        	userLanguage = ""
        }
    	return  new PackageContent("userLanguage", userLanguage);
    },
    // 获取当前的时区 格式是GMT + 时区
    getTimeZone:function(){
    	var d = new Date();
    	var gmtHours = d.getTimezoneOffset()/60;
    	return  new PackageContent("timeZone", gmtHours);
    },
    // get all plugins detail，ie broswer is special, can not use navigator to
	// get all acticexobjects
    getPlugins: function (pluginsStr) {
    	  if (this.checkBroswer() == "IE"){
    		  return new PackageContent("plugins",pluginsStr.replace(new RegExp(',','gm'),'#'));
    	  }else{
    		  	var pluginArr = navigator.plugins;
    		  	var pluginStr="";
    		  	for(i =0;i<pluginArr.length;i++){
    	    		pluginStr+=pluginArr[i].name.toString()+'#';
    		  		}
    		  return new PackageContent("plugins", pluginStr);
    	  		}
    	
    },
    // 获取flash是否安装，已经安装的flash的版本
    getFlashVersion: function(){
       var hasFlash = 0; // 是否安装了flash
       var flashVersion = 0; // flash版本
       if (this.checkBroswer() == "IE") {
           var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
           if (swf) {
               hasFlash = 1;
               flashVersion = Number(swf.GetVariable('$version').split(' ')[1].replace(/,/g, '.').replace(/^(d+.d+).*$/, "$1"));
           }
       } else {
           if (navigator.plugins && navigator.plugins.length > 0) {
               var swf = navigator.plugins["Shockwave Flash"];
               if (swf) {
                   hasFlash = 1;
   				flashArr =  swf.description.split(" ");
   				
                   flashVersion = flashArr[2]+" "+flashArr[3];
   				
               }
           }
       }
       return  new PackageContent("flashVersion", flashVersion);
    },
    // 获取浏览器曾经访问过页面的数量,可以作为辅助判断，若浏览器从没有一次其他页面的访问，或者多次设备指纹获取之间都是0，该设备的访问可信度较低
    getHistoryList:function(){
    	return new PackageContent("historyList", window.history.length);
    },
    // 增加partnerCode
    getPartnerCode:function(){
    	return new PackageContent("partnerCode", partnerCode);
    },
    // 增加version
    getVersion:function(){
    	return new PackageContent("sdkVersion", version);
    },
    getWebGLCode:function(){
    	var webGLCode = this.cfp.getWebglFp();
    	return new PackageContent("webGLCode",webGLCode);
    },
    //需求新增字段
    getBrowserName:function(){
    	//IE、Firefox、Chrome、Opera、Safari
    	var Sys = {},ua = navigator.userAgent.toLowerCase(),s,broswerName;
	    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
	    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	    for(var e in Sys){
	    	broswerName=e;
	    }
    	return new PackageContent("broswerName", broswerName);
    },
    getBrowserVersion:function(){
    	var Sys = {},ua = navigator.userAgent.toLowerCase(),s,broswerVersion;
	    (s = ua.match(/rv:([\d.]+)\) like gecko/)) ? Sys.ie = s[1] :
	    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	    (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	    (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	    (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	    (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	    for(var e in Sys){
	    	broswerVersion=Sys[e];
	    }
    	return new PackageContent("broswerVersion", broswerVersion);
    },
    getSystemOS:function(){
    	//Mac、Unix、Linux、Win2000、WinXP、Win2003、WinVista、Win7、Win8、Win8.1、Win10
		function detectOS() {
		    var sUserAgent = navigator.userAgent;
		    var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
		    var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
		    if (isMac) return "Mac";
		    if ((navigator.platform == "X11") && !isWin && !isMac) return "Unix";
		    if ((String(navigator.platform).indexOf("Linux") > -1)) return "Linux";
		    if (isWin) {
		        if (sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1) return "Win2000";
		        if (sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1) return "WinXP";
		        if (sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1) return "Win2003";
		        if (sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1) return "WinVista";
		        if (sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1) return "Win7";
		        if (sUserAgent.indexOf("Windows NT 6.2") > -1 || sUserAgent.indexOf("Windows 8") > -1) return "Win8";
		        if (sUserAgent.indexOf("Windows NT 6.3") > -1 || sUserAgent.indexOf("Windows 8.1") > -1) return "Win8.1";
		        if (sUserAgent.indexOf("Windows NT 10.0") > -1 || sUserAgent.indexOf("Windows 10") > -1) return "Win10";
		    }
		    return "other";
		}
    	return new PackageContent("systemOS", detectOS());
    },
    getSystemKernel:function(){
    	return new PackageContent("systemKernel", "");
    },


    getSessionStorage:function(checkCode){
    	return new PackageContent("sessionStorage", checkCode);
    },
    getLocalStorage:function(checkCode){
    	return new PackageContent("localStorage", checkCode);
    },
    getIndexedDb:function(checkCode){
    	return new PackageContent("indexedDb",checkCode);
    },
    getOpenDatabase:function(checkCode){
    	return new PackageContent("openDatabase", checkCode);
    },
    getDoNotTrack:function(checkCode){
    	return new PackageContent("doNotTrack",checkCode);
    },
    getAdblock:function(checkCode){
    	return new PackageContent("adblock", checkCode);
    },
    getHasLiedLanguages:function(checkCode){
    	return new PackageContent("hasLiedLanguages", checkCode);
    },
    getHasLiedResolution:function(checkCode){
    	return new PackageContent("hasLiedResolution", checkCode);
    },
    getHasLiedOs:function(checkCode){
    	return new PackageContent("hasLiedOs", checkCode);
    },
    getHasLiedBrowser:function(checkCode){
    	return new PackageContent("hasLiedBrowser", checkCode);
    },
    getTouchSupport:function(touchList){
    	return new PackageContent("touchSupport", touchList.replace(new RegExp(',','gm'),'#'));
    },
    getJsFonts:function(fontList){
    	return new PackageContent("jsFonts", fontList.replace(new RegExp(',','gm'),'#'));
    },
    isPhone:function(){
    	var userAgent = navigator.userAgent.toLowerCase();
    	if(userAgent.indexOf("windows phone") >= 0){
			return  true;
		} else if(userAgent.indexOf("symbianos") >= 0){
			return true;
		} else if(userAgent.indexOf("android") >= 0){
			return true;
		} else if(userAgent.indexOf("iphone") >= 0 || userAgent.indexOf("ipad") >= 0 || userAgent.indexOf("iPod") >= 0 || userAgent.indexOf("ios") >= 0){
			return true;
		} else{
			return false;
		}
    },
    getDfpMoreInfo:function(){
    	var self = this;
    	self.cfp.get(function(key,dfpArray){
    		if(!self.isPhone()){
	    		self.moreInfoArray.push(self.getCanvansCode(key+""));
	    	}
    		for(var p in dfpArray){
    			var key = dfpArray[p].key;
    			var value = dfpArray[p].value+"";
    		switch (key) {
			case 'session_storage':
				self.moreInfoArray.push(self.getSessionStorage(value));
				break;
			case 'local_storage':
				self.moreInfoArray.push(self.getLocalStorage(value));
				break;
			case'indexed_db':
				self.moreInfoArray.push(self.getIndexedDb(value));
				break;
			case'open_database':
				self.moreInfoArray.push(self.getOpenDatabase(value));
				break;
			case'do_not_track':
				self.moreInfoArray.push(self.getDoNotTrack(value));
				break;
			case'ie_plugins':
				self.moreInfoArray.push(self.getPlugins(value));
				break;
			case'regular_plugins':
				self.moreInfoArray.push(self.getPlugins());
				break;
			case'adblock':
				self.moreInfoArray.push(self.getAdblock(value));
				break;
			case'has_lied_languages':
				self.moreInfoArray.push(self.getHasLiedLanguages(value));
				break;
			case'has_lied_resolution':
				self.moreInfoArray.push(self.getHasLiedResolution(value));
				break;
			case'has_lied_os':
				self.moreInfoArray.push(self.getHasLiedOs(value));
				break;
			case'has_lied_browser':
				self.moreInfoArray.push(self.getHasLiedBrowser(value));
				break;
			case'touch_support':
				self.moreInfoArray.push(self.getTouchSupport(value));
				break;
			case'js_fonts':
				self.moreInfoArray.push(self.getJsFonts(value));
				break;
			default:
				break;
			}
    		}
    	});
    },
    // 需要在getMachineCode 获取增加 时区，插件，flashver 元素
    getMachineCode: function () {
        return [this.getCookieCode(),
            this.getUserAgent(), this.getScrHeight(), this.getScrWidth(),
            this.getScrAvailHeight(), this.getScrAvailWidth(),
            this.md5ScrColorDepth(), this.getScrDeviceXDPI(),
            this.getAppCodeName(), this.getAppName(), this.getAppVersion(),
            this.getJavaEnabled(), this.getMimeTypes(), this.getPlatform(),
            this.getAppMinorVersion(),
            this.getBrowserLanguage(), this.getCookieEnabled(),
            this.getCpuClass(), this.getOnLine(), this.getSystemLanguage(),
            this.getUserLanguage(),this.getTimeZone(),
            this.getFlashVersion(),this.getHistoryList(),
            this.getBrowserName(),this.getBrowserVersion(),this.getSystemOS()];
            //this.getPartnerCode(),this.getVersion(),
    },
    getpackStr:function(){
    	var machineArray = this.getMachineCode();
		var validateArr = machineArray.concat(this.moreInfoArray);
  		// 按照ASCII码进行排序
		
          var validateArray=  validateArr.sort(by("key"));
		       function by(key){
        	    return function(o, p){
        	        var a, b;
        	        if (typeof o === "object" && typeof p === "object" && o && p) {
        	            a = o[key];
        	            b = p[key];
        	            if (a === b) {
        	                return 0;
        	            }
        	            if (typeof a === typeof b) {
        	                return a < b ? -1 : 1;
        	            }
        	            return typeof a < typeof b ? -1 : 1;
        	        }
        	        else {
        	            throw ("error");
        	        }
        	    }
        	};
		var fingerStr={};
		for (var i = 0; i < validateArray.length; i++) {
			if(minDictionaries[validateArray[i].key]){
				fingerStr[minDictionaries[validateArray[i].key]]=encodeURIComponent(validateArray[i].value).toUpperCase();
			}
		}
		return fingerStr;
		
          var fingerStr ="" ;
          for (var i = 0; i < validateArray.length; i++) {
          	if(minDictionaries[validateArray[i].key]){
        	  fingerStr += encodeURIComponent(minDictionaries[validateArray[i].key])+"="+encodeURIComponent(validateArray[i].value).toUpperCase()+"&";
          	}
          }
          fingerStr = fingerStr.substr(0,fingerStr.length-1);
		  // console.log(fingerStr);
          // var packSign = CryptoJS.SHA256(fingerStr).toString().toLowerCase();
		 // console.log(packSign)
         return  fingerStr ;//= fingerStr+"&sign="+packSign;
    },
    getSignature:function(){
    	var packageStr = this.getpackStr();
    	var content = "packageStr="+encodeURIComponent(packageStr)+"&partnerCode="+encodeURIComponent(partnerCode)+"&platform="+encodeURIComponent(platform);
		// console.log(content);
	return CryptoJS.HmacSHA1(content,secretKey).toString();
    },
    getSignatureNew:function(obj){
    	var content = obj.appkey+"&"+obj.uuid+"&"+obj.data+"&"+obj.sdkversion;
    	if(obj.deviceid){
    		content=content+"&"+obj.deviceid
    	}
    	if(obj.accesskey){
    		content=content+"&"+obj.accesskey
    	}
		// console.log(content);
	return hex_md5(content).toString();
    },
    getIEVersion:function(){     
   	 var userAgent = navigator.userAgent.toLowerCase();   
   	 	if(userAgent.match(/msie ([\d.]+)/)!=null){
   	 		//ie6--ie9                
   	 			uaMatch = userAgent.match(/msie ([\d.]+)/);               
   	 			 return 'IE'+parseInt(uaMatch[1]);        
   	 	}else if(userAgent.match(/(trident)\/([\w.]+)/)){
   	 	    uaMatch = userAgent.match(/trident\/([\w.]+)/);
   	 	        switch (uaMatch[1]){
   	 	                        	 case "4.0": return "IE8" ;break; 
   	                                 case "5.0": return "IE9" ;break; 
   	                                 case "6.0": return "IE10";break;
   	                                 case "7.0": return "IE11";break;                                
   	                                 default:return "undefined" ;            
   	                             }  
   	                         }       
   	                             return "undefined";  
    },
    initEc: function () {
		var self = this;
		this.getDfpMoreInfo();
		this.ec.get(unique2Name,function(value){
			if(value == undefined||value==null){
					self.ec.set(unique2Name,makeid());
			}
			if(new Date().getTime()-getCookie("UDCREDIT_EXPIRATION")<getCookie("UDCREDIT_EXPIRATION_TIME") &&getCookie(cookiePrefix)!=null&&getCookie(cookiePrefix)!=undefined){
				return ;
			}
			if(getCookie(unique2Name)==null||getCookie(unique2Name)==undefined||getCookie(unique2Name)==""){
				return ;
			}
			var isIE = self.getIEVersion();
			var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
			if(isIE=="IE7"||isIE=="IE8"){
				xmlhttp = new ActiveXObject("microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange=state_Change;
        	xmlhttp.open("POST",dfpURL,true);
        	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        	var accesskey ="";
        	var postObj = {
        		appkey:appKey||"", 
        		uuid:self.getCookieCode().value||"",
        		deviceid:self.getCanvansCode().value||"",
        		accesskey:accesskey||"",
				data:self.getpackStr()||"",
				sdkversion:"4.0"
			}
			postObj.signature=self.getSignatureNew(postObj);
			console.log(postObj)
        	xmlhttp.send(JSON.stringify(postObj));
			function state_Change(){						 
        	if(xmlhttp.readyState==4){
        		if (xmlhttp.status==200){
        			var json =JSON.parse(xmlhttp.responseText);
        			var expirationValue=0;
        			for(var p in json){// 遍历json对象的每个key/value对,p为key
        			  // 遍历json对象的每个key/value对,p为key
        			  // console.log(p + " " + json[p]);
        			   if(p=='deviceId'){
						   if(getCookie(cookiePrefix)!=json[p]){
							   setCookie(cookiePrefix,json[p]);
						   }
        				   self.deviceEc.set(cookiePrefix,json[p]);
        			   }else if(p=='expiration'){
							setCookie('UDCREDIT_EXPIRATION',json[p]);
							setCookie('UDCREDIT_EXPIRATION_TIME',new Date().getTime());
							expirationValue=json[p];
        			   }else if(p=='traceId'){
        				   setCookie('UDCREDIT_TRACEID',json[p]);
        			   }
        			}
        			if(expirationValue>0){
        				clearTimeout(repostTimeOut);
	        			repostTimeOut=setTimeout(function(){
							new FingerPrint().getFingerPrint();
						},expirationValue);
	        		}
        		}else if(xmlhttp.status==401){
        			
        		}
        	}
		}
			
		});	
	
    },
    getFingerPrint: function () {
        var self = this;
        self.initEc();
		// console.log(self.getSignature());  
    }
    
};

function repeatTime(){
	var expTime = getCookie("UDCREDIT_EXPIRATION");
	var expStartTime = getCookie("UDCREDIT_EXPIRATION_TIME");	
	if(!expTime||expTime==-1){
		for(var repeatTime=0;repeatTime<10;repeatTime++){
			setTimeout(function(){
				new FingerPrint().getFingerPrint();
			},(20+(20*Math.pow(repeatTime,repeatBones)*100)));
		}
	}else{
		if(!expStartTime||new Date().getTime()-expStartTime>expTime){
			expTime=10;
		}
		repostTimeOut=setTimeout(function(){
			new FingerPrint().getFingerPrint();
		},expTime)
	}
}
repeatTime();

})();

