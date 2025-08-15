/*
 * Module:          VerseMaker.gs
 * Author mail:     oscarvir123@gmail.com
 * Author mail:     obed.vazquez@gmail.com
 * GoogleProyect:   https://script.google.com/d/14Qrk-vG5uDw_2Cws9NePZEazz8oEEVxHUlAKP_pp4Iut6PrF83YmYOtY/edit
 * License:         (Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/
 * Legal Code:      (Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/legalcode
 */
 
 /**
 * This is a temporal flag to know if it is working on a Development evironment or in production.
 * If the plug-in has being deployed please set this flag into false.
 * @type    {boolean}
 * @author  Obed Vazquez
 * @since   27/07/2016
 */
var devMode=false;

/**
 * This class contains all the process of the project.
 * It has the view element as the logic elements of the project.
 * Is it like this because the functionality is very basic but its expected as the functionality
 * grows that it will be modularized by the developer that is responsible for this.
 *
 * @author Obed Vazquez
 * @author Oscar Villareal
 * @since 26/01/2016
 * @ProyectKey MNuj1w5fvwhzODeTTPfEMYnd8W73qGbVI
 * @modifies Obed Vazquez Lopez
 * @version 15/Mar/2018
 */
function VerseMaker() {

}
/**
 * This are reusable regex used in the books array. For the first second and third books or letters in the Bible.
 * @type    {string}
 * @author  Obed Vazquez
 * @since   26/01/2016
 */
var regexFirstOf = "(((1(((st)|[ao])[\\s]))|([1Ii][\\s]?))|((([Ff][Ii][Rr][Ss][Tt]([\\s][Oo][Ff])?)|([Pp][Rr][Ii][Mm][Ee][Rr][AaOo]([\\s][Dd][Ee])?))[\\s]))";
/**
 * @type    {string}
 * @author  Obed Vazquez
 * @since   26/01/2016
 */
var regexSecondOf = "(((2(((nd)|[ao])[\\s]))|((2|((II)|(ii)))[\\s]?))|((([Ss][Ee][Cc][Oo][Nn][Dd]([\\s][Oo][Ff])?)|([Ss][Ee][Gg][Uu][Nn][Dd][AaOo]([\\s][Dd][Ee])?))[\\s]))";
/**
 * @type    {string}
 * @author  Obed Vazquez
 * @since   26/01/2016
 */
var regexThirdOf = "(((3(((rd)|[ao])[\\s]))|((3|(III|(iii)))[\\s]?))|((([Tt][Hh][Ii][Rr][Dd]([\\s][Oo][Ff])?)|([Tt][Ee][Rr][Cc][Ee][Rr][AaOo]([\\s][Dd][Ee])?))[\\s]))";

/**
 * This is an array with all the regex on the Bible used to identify an abbreviation or full name of a book in the Bible.
 * list of books abreviations: https://docs.google.com/spreadsheets/d/140t98l2sZFA0CXipsg6zmlrhYPqGw3oHxSSh7MLI8MU/edit#gid=1285639834
 * accented elements https://lefunes.wordpress.com/2007/11/14/caracteres-especiales-en-javascript/
 * @type    {Array}
 * @author  Obed Vazquez
 * @author  Oscar Villareal
 * @since   26/01/2016
 */
var books = {
    "gen": "\\b([Gg][Ee][Nn][Ee][Ss][Ii][Ss]|[Gg][\u00c9\u00e9][Nn][Ee][Ss][Ii][Ss]|[Gg][Ee][Nn]|[Gg][\u00c9\u00e9][Nn]|[Gg][Ee]|[Gg][Nn]|[Gg][\u00c9\u00e9])",
    "exo": "\\b([Ee][Xx][Oo][Dd][Oo]|[Ee][Xx]|[Ee][Xx][Oo]|[\u00c9\u00e9][Xx][Oo][Dd][Oo]|[\u00c9\u00e9][Xx]|[\u00c9\u00e9][Xx][Oo])",
    "lev": "\\b([Ll][Ee][Vv][Ii][Tt][Ii][Cc][Oo]|[Ll][Ee][Vv][\u00CD\u00ed][Tt][Ii][Cc][Oo]|[Ll][Ee][Vv][Ii][Tt][Ii][Cc]|[Ll][Ee][Vv][\u00CD\u00ed][Tt]|[Ll][Ee][Vv][\u00CD\u00ed]|[Ll][Ee][Vv][Ii][Tt]|[Ll][Ee][Vv][Ii]|[Ll][Ee][Vv]|[Ll][Ee]|[Ll][Vv])",
    "num": "\\b([Nn][Uu][Mm][Ee][Rr][Oo][Ss]|[Nn][Uu][Mm]|[Nn][Uu]|[Nn][Mm]|[Nn][\u00da\u00fa][Mm][Ee][Rr][Oo][Ss]|[Nn][\u00da\u00fa][Mm]|[Nn][\u00da\u00fa]|[Nn][Uu][Mm][Bb][Ee][Rr][Ss]|[Nn][Bb])",
    "deu": "\^([Dd][Ee][Uu][Tt][Ee][Rr][Oo][Nn][Oo][Mm][Ii][Oo]|[Dd][Ee][Uu][Tt][Ee][Rr][Oo]|[Dd][Ee][Uu][Tt]|[Dd][Ee][Uu]|[Dd][Ee]|[Dd][Tt]|[Dd][Ee][Uu][Tt][Ee][Rr][Oo][Nn][Oo][Mm][Yy])",
    "jos": "\\b([Jj][Oo][Ss][Uu][Ee]|[Jj][Oo][Ss]|[Jj][Ss]|[Jj][Oo][Ss][Uu][\u00c9\u00e9]|[Jj][Oo][Ss][Hh][Uu][Aa]|[Jj][Oo][Ss][Hh]|[Jj][Oo][Ss]|[Jj][Ss][Hh])",
    "jdg": "\\b([Jj][Uu][Ee][Cc][Ee][Ss]|[Jj][Uu][Ee]|[Jj][Uu][Dd][Gg][Ee][Ss]|[Jj][Uu][Dd][Gg]|[Jj][Dd][Gg]|[Jj][Gg]|[Jj][Dd][Gg][Ss])",
    "rut": "\\b([Rr][Uu][Tt]|[Rr][Uu]|[Rr][Tt]|[Rr][Uu][Tt][Hh]|[Rr][Tt][Hh])",
    "1sa": "\\b(" + regexFirstOf + "([Ss][Aa][Mm][Uu][Ee][Ll]|[Ss][Aa][Mm]|[Ss][Aa]|[Ss][Mm]|[Ss]))",
    "2sa": "\\b(" + regexSecondOf + "([Ss][Aa][Mm][Uu][Ee][Ll]|[Ss][Aa][Mm]|[Ss][Aa]|[Ss][Mm]|[Ss]))",
    "1ki": "\\b(" + regexFirstOf  + "([Rr][Ee][Yy][Ee][Ss]|[Rr][Ee]|[Rr]\\.|[Kk][Ii][Nn][Gg][Ss]|[Kk][Gg][Ss]|[Kk][Ii][Nn]|[Kk][Ii]|[Kk]))",
    "2ki": "\\b(" + regexSecondOf + "([Rr][Ee][Yy][Ee][Ss]|[Rr][Ee]|[Rr]\\.|[Kk][Ii][Nn][Gg][Ss]|[Kk][Gg][Ss]|[Kk][Ii][Nn]|[Kk][Ii]|[Kk]))",
    "1ch": "\\b(" + regexFirstOf + "([Cc][Rr][Oo][Nn][Ii][Cc][Aa][Ss]|[Cc][Rr][\u00d3\u00f3][Nn][Ii][Cc][Aa][Ss]|[Cc][Rr][Oo]|[Cc][Rr][\u00d3\u00f3]|[Cc][Rr][\u00d3\u00f3][Nn]|[Cc][Rr]|[Cc][Hh][Rr][Oo][Nn][Ii][Cc][Ll][Ee][Ss]|[Cc][Hh][Rr][Oo][Nn]|[Cc][Hh][Rr]|[Cc][Hh]))",
    "2ch": "\\b(" + regexSecondOf + "([Cc][Rr][Oo][Nn][Ii][Cc][Aa][Ss]|[Cc][Rr][\u00d3\u00f3][Nn][Ii][Cc][Aa][Ss]|[Cc][Rr][Oo]|[Cc][Rr][\u00d3\u00f3]|[Cc][Rr][\u00d3\u00f3][Nn]|[Cc][Rr]|[Cc][Hh][Rr][Oo][Nn][Ii][Cc][Ll][Ee][Ss]|[Cc][Hh][Rr][Oo][Nn]|[Cc][Hh][Rr]|[Cc][Hh]))",
    "esd": "\\b([Ee][Ss][Dd][Rr][Aa][Ss]|[Ee][Ss][Dd]|[Ee][Zz][Rr][Aa]|[Ee][Zz][Rr])",
    // "neh": "",
    "est": "\\b([Ee][Ss][Tt][Hh][Ee][Rr]|[Ee][Ss][Tt][Hh]|[Ee][Ss][Tt]|[Ee][Ss]|[Ee][Ss][Tt][Ee][Rr])",
    // "job": "",
    "psa": "\\b([Ss][Aa][Ll][Mm][Oo][Ss]|[Ss][Aa][Ll][Mm][Oo]|[Ss][Aa][Ll]|[Pp][Ss][Aa][Ll][Mm]|[Pp][Ss][Ll][Mm]|[Pp][Ss]|[Pp][Ss][Aa][Ll][Mm][Ss]|[Pp][Ss][Aa]|[Pp][Ss][Mm]|[Pp][Ss][Mm][Ss]|[Pp][Ss][Ss])",
    "pro": "\\b([Pp][Rr][Oo][Vv][Ee][Rr][Bb][Ii][Oo][Ss]|[Pp][Rr][Oo][Vv][Ee][Rr][Bb][Ss]|[Pp][Rr][Oo][Vv]|[Pp][Rr][Oo]|[Pp][Rr][Vv]|[Pp][Rr]|[Pp][Vv])",
    "ecc": "\\b([Ee][Cc][Cc][Ll][Ee][Ss][Ii][Aa][Ss][Tt][Ee][Ss]|[Ee][Cc][Ll][Ee][Ss][Ii][Aa][Ss][Tt][Ee\u00C9\u00e9][Ss]|[Qq][Oo][Hh][Ee][Ll][Ee][Tt][Hh]|[Ee][Cc][Cc][Ll][Ee][Ss]|[Ee][Cc][Cc][Ll]|[Qq][Oo][Hh][Ee][Cc][Ll]|[Ee][Cc])",
    // "sng": "",
    "isa": "\\b([Ii][Ss][Aa][\u00cd\u00ed][Aa][Ss]|[Ii][Ss][Aa][Ii][Aa][Ss]|[Ii][Ss][Aa]|[Ii][Ss]|[Ii][Ss][Aa][Ii][Aa][Hh])",
    "jer": "\\b(Jeremias|Jerem\u00edas|Jer|Je)",
    // "lam": "",
    "ezk": "\\b([Ee][Zz][Ee][Kk][Ii][Ee][Ll]|[Ee][Zz][Ee][Kk]|[E][Zz][Ee]|[Ee][Zz][Kk]|[Ee][Zz][Ee][Qq][Uu][Ii][Ee][Ll]|[Ee][Zz][Ee][Qq]|[Ee][Zz][Qq]|[Ee][Zz])",
    "dan": "\\b([Dd][Aa][Nn][Ii][Ee][Ll]|[Dd][Aa][Nn]|[Dd][Aa])",
    // "oz": "",
    // "jol": "",
    // "amo": "",
    // "abd": "",
    "jon": "\\b([Jj][Oo][Nn][Aa][Ss]|[Jj][Oo][Nn])",
    "mic": "\\b([Mm][Ii][Qq][Uu][Ee][Aa][Ss]|[Mm][Ii][Qq]|[Mm][Ii][Cc]|[Mm][Ii])",
    // "nah": "",
    "hab": "\\b([Hh][Aa][Bb][Aa][Kk][Kk][Uu][Kk]|[Hh][Aa][Bb][Aa][Cc][Uu][Cc]|[Hh][Aa][Bb]|[H][Bb])",
    // "sof": "",
    // "hag": "",
    "zac": "\\b([Zz][Aa][Cc][Aa][Rr][[Ii]|[\u00ED\u00CD]][Aa][Ss]|[Zz][Ee][Cc][Hh][Aa][Rr][Ii][Aa][Hh]|[Zz][Aa][Cc]|[Zz][Aa]|[Zz][Ee][Cc][Hh]|[Zz][Ee][Cc])",
    "mal": "\\b([Mm][Aa][Ll][Aa][Qq][Uu][Ii][Aa][Ss]|[Mm][Aa][Ll])",
    "mat": "\\b([Mm][Aa][Tt][Ee][Oo]|[Mm][Aa][Tt]|[Mm][Tt]|[Mm][Aa][Tt][Tt][Hh][Ee][Ww]|[Mm][Aa][Tt][Tt]|[Mm][Tt][Tt])",
    "mrk": "\\b([Mm][Aa][Rr][Cc][Oo][Ss]|[Mm][Aa][Rr]|[Mm][Aa][Rr][Kk]|[Mm][Rr][Kk]|[Mm][Cc]|[Mm][Rr]|[Mm][Kk])",
    "luk": "\\b([Ll][Uu][Cc][Aa][Ss]|[Ll][Uu][Cc]|[Ll][Cc]|[Ll][Uu][Kk][Ee]|[Ll][Uu][Kk]|[Ll][Kk])",
    "jhn": "\\b([Jj][Uu][Aa][Nn]|[Jj][Oo][Hh][Nn]|[Jj][Hh][Nn]|[Jj][Nn]|[Jj][Uu][Aa])",
    "act": "\\b(([Hh][Ee][Cc][Hh][Oo][Ss]([\\s][Dd][Ee][\\s][Ll][Oo][Ss][\\s][Aa][Pp][Oo\u00d3\u00f3][Ss][Tt][Oo][Ll][Ee][Ss])?)|[Hh][Cc][Hh][Ss]|[Hh][Cc][Hh]|[Aa][Cc][Tt][Ss]|[Aa][Cc][Tt]|[Aa][Cc])",
    "rom": "\\b(Romanos|Romans|Roms|Rmns|Rom|Ro|Rmn|Rm)", 
    "1co": "\\b(" + regexFirstOf + "(Corintios|Cor|Co|Corinthians))",
    "2co": "\\b((((2(((nd)|[ao])[\\s]))|((2|((II)|(ii)))[\\s]?))|((([Ss][Ee][Cc][Oo][Nn][Dd]([\\s][Oo][Ff])?)|([Ss][Ee][Gg][Uu][Nn][Dd][AaOo]([\\s][Dd][Ee])?))[\\s]))(Corintios|Cor|Co|Corinthians))",
    "gal": "\\b([Gg][\u00c1\u00e1Aa][Ll][Aa][Tt][Aa][Ss]|[Gg][Aa][Ll]|[Gg][Ll]|[Gg][Aa]|[Gg][A\u0301])",
    "ef": "\\b(Efesios|Efe|Ef)",
    "fil": "\\b(Filipenses|Fil|Fl|Flp)",
    "col": "\\b(Colosenses|Colossians|Col)",
    "1th": "\\b(" + regexFirstOf + "(Tesalonicenses|Thessalonians|Tes|Ts|Thess|Th))",
    "2th": "\\b(" + regexSecondOf + "(Tesalonicenses|Thessalonians|Tes|Thess|Th))",
    "tit": "\\b(Tito|Titus|Tit|Ti)", //se invirtieron estos pues si identifica despues un 1Ti lo pondra como timoteo y no como tito
    "1ti": "\\b(" + regexFirstOf + "(Timoteo|Timothy|Tim|Tm))",
    "2ti": "\\b(" + regexSecondOf + "(Timoteo|Timothy|Tim|Tm))",
    "phm": "\\b(Filemon|Filemu00f3n|Fi)",
    "heb": "\\b(Hebreos|Heb|He)", //TODO y el ingles... u.u
    "san": "\\b(Santiago|San|Sa|St|S)",
    "1pe": "\\b(" + regexFirstOf + "(Pedro|Peter|Pet|Ped|Pe))",
    "2pe": "\\b(" + regexSecondOf + "(Pedro|Peter|Pet|Ped|Pe))",
    "1jn": "\\b(" + regexFirstOf + "(Jua(n)?|Jn))",
    "2jn": "\\b(" + regexSecondOf + "(Jua(n)?|Jn))",
    "3jn": "\\b(" + regexThirdOf + "(Jua(n)?|Jn))",
    "jud": "\\b(Judas|Jude|Jud|Jd)",
    "Ap": "\\b(Revelaciones|Apocalipsis|Apoc|Rev|Rv|Ap)"
};

/**
 * This is a regex to identify every chapter with or without a verse in the Bible,
 * used in combination with the book's reference to find every citation on the
 * Bible inside the document.
 *
 * @type {string}
 * @author Obed Vazquez
 * @since 26/01/2016
 */
var allVersesRegex = "[\\.]?[\\s]?[\\d]*[:|\\.]?[\\d]+(([-]{1}[\\d]+)?([,][\\s]?[\\d]+([-]{1}[\\d]+)?)*)?"; 
//bible.com no acepta referencias entre varios capitulos por ejemplo: Jn 1:3-2:3  ó Jn 3:2;4:1 (con el ultimo se identificaria como: Jn 3:2,4)
//El ; se elimino para que solo identifique la , pues es muy claro que es estandar.

/**
 * Language identifier for bible.com (spanish:149 and english 1).
 *
 * @type    {string}
 * @author  Obed Vazquez
 * @since   26/01/2016
 */
var idiomID;




/**
 * Turns all the references to the Bible in the document to an hyperlink to the actual
 * Bible digital verse in bible.com with the help of the method setBibleHyperlinks()
 * and it specifies that the referenced Bible verses must be in the King James Version (English)
 *
 * @author Obed Vazquez Lopez
 * @since 26/01/2016
 * @version 28/Jul/2016
 * @throws VerseMakerException Uknown Exception.
 */
VerseMaker.prototype.setBibleHyperlinksEnglish = function setBibleHyperlinksEnglish() {
    Logger.log(this.name + "." + arguments.callee.name + "() :: ");
    try {

        idiomID = 1;
        var versesFoundCounter=this.setBibleHyperlinks();
        this.alert("VerseMaker couldn't found any Biblical citation, if you need help you can go to the About menu to learn how to make your own Bible verse citation.","Oops!");

    } catch (e) {
        var errorTitle = "UnknownError";
        var errorMessage = "Impossible to set the language to english";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};

/**
 * Turns all the references to the Bible in the document to an hyperlink to the actual
 * Bible digital verse in bible.com with the help of the method setBibleHyperlinks()
 * and it specifies that the referenced Bible verses must be in the Reina Valera de 1960 (Spanish),
 * it acomplish this thought the idiomID global parameter
 *
 * @author Obed Vazquez Lopez
 * @since 27/Jul/2016
 * @throws VerseMakerException Uknown Exception
 */
VerseMaker.prototype.setBibleHyperlinksSpanish = function setBibleHyperlinksSpanish() {
    Logger.log(this.name + "." + arguments.callee.name + "() :: ");
    try {
        idiomID = 149;
        var versesFoundCounter=this.setBibleHyperlinks();
        if(versesFoundCounter==0){
            this.alert("No se ha encontrado ninguna cita Biblica, si necesitas ayuda ve al menu de About para aprender a hacer tu propia cita bilica.","Oops!");
        }else{
            this.alert(versesFoundCounter+" versiculos se han establecio como hypervinculos a la version RVR60.","Exito");
        }

    } catch (e) {
        var errorTitle = "UnknownError";
        var errorMessage = "Impossible to set the language to english";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};



/**
 * Turns all the references to the Bible in the document to an hyperlink to the actual
 * Bible digital verse in bible.com.
 * If not specified the referenced Bible verses should be in the RVR60 [Version Reina Valera Revision de 1960] (Spanish).
 * Taking all the text elements only in the document and calling the findBooks() method to find any Bible Reference.
 *
 * @author Obed Vazquez
 * @since 26/01/2016
 * @throws ValidationException In case of the initial parameters has not being set (this should not occur).
 */
VerseMaker.prototype.setBibleHyperlinks = function setBibleHyperlinks() {
    Logger.log(this.name + "." + arguments.callee.name + "() :: ");
    if (idiomID === null) {
        var errorMessage = "The language has not being set. This is an unexpected Error, please provide feedback on its occurrence.";
        throw {
            name: "ValidationError",
            message: errorMessage,
            methodName: arguments.callee.name,
            toString: function() {
                return ("Exception " + this.name + " at " + this.constructor.name + "." + arguments.callee.name + "() ::" + this.lineNumber + ":: " + this.message);
            }
        };
    }
    try {
        var versesFoundCounter=0;
        var doc = DocumentApp.getActiveDocument();
        for (var i = 0; i < doc.getNumChildren(); i++) {
            var element = doc.getBody().getChild(i);
            var textElem = element.asText();
            versesFoundCounter=versesFoundCounter+this.findBooks(textElem);
        }
        return versesFoundCounter;

    } catch (e) {
        var errorTitle = "UnknownError";
        var errorMessage = "Impossible to set the Bible Hyperlinks due to an unknown issue.";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};

/**
 * The solely intention of this method is to find the actual regex in the physical document,
 * for this, the regex  must be preconfigured and the method will call the setLinkUrl() function
 * to turn all of the occurrences as Hyperlinks in the given text element from the document.
 *
 * @author Oscar Villarreal
 * @since 26/01/2016
 * @modifies Obed Vazquez
 * @version 28/Jul/2016
 * @param {Text} textElem - Text element on the document, more information: https://developers.google.com/apps-script/reference/document/text
 */
VerseMaker.prototype.findBooks = function findBooks(textElem) {
    Logger.log(this.name + "." + arguments.callee.name + "(" + textElem + ") :: ");
    if (textElem === null) {
        return null;
    }
    try {
        
        var versesFoundCounter=0;
        
        for (var bibleURLBookName in books) {
            var bookVersesFoundCounter=0;
            
            var bookRegex = books[bibleURLBookName];
            var range = textElem.findText(bookRegex + allVersesRegex);
            while (range !== null) {
                var textReference = range.getElement().asText();
                var start = range.getStartOffset();
                var end = range.getEndOffsetInclusive();
                textReference.setLinkUrl(start, end, this.getURL(bibleURLBookName, textElem, range, bookRegex));
                bookVersesFoundCounter++;
                range = textElem.findText(bookRegex + allVersesRegex, range); //find the next match and puts it into the range
            }
            
            versesFoundCounter=versesFoundCounter+bookVersesFoundCounter;
        }
        
        return versesFoundCounter;

    } catch (e) {
        var errorTitle = "UnknownError";
        var errorMessage = "Impossible to look for the regex in the element [" + textElem + " ]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};

/**
 * Obtains a URL structured as follows:
 * bible.com/ idiomID /book . chapter . verse [, more verses] [- final verse (as a range of verses)]
 *
 * @author Obed Vazquez
 * @since 26/01/2016
 * @param {string} bibleURLBookName - Bible book name in the 'bible.com' URL.
 * @param {Text} textElem - Text element on the document where will insert the URL as an Hyperlink, more info:https://developers.google.com/apps-script/reference/document/text
 * @param {RangeElement} range - Exact text in the element (and document) where the hyperlink will be inserted;
 *                                  more info: https://developers.google.com/apps-script/reference/document/range-element.
 * @param {string} bookRegex - Bible book regex.
 * @return {string} the structured URL to replace for in the text element.
 * @throws ValidationException In case one of the Parameters is not provided.
 */
VerseMaker.prototype.getURL = function getURL(bibleURLBookName, textElem, range, bookRegex) {
    Logger.log(this.name + "." + arguments.callee.name + "(" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + ") :: ");
    this.validateGetURLParameters(bibleURLBookName, textElem, range, bookRegex);

    try {
        // now using this https://www.bible.com/bible/149/MAT.6.RVR1960
        var urlToReturn = "www.bible.com/bible/" + idiomID + "/" + bibleURLBookName + "." +
            this.getCurrentVerses(textElem.getText().substring(
                range.getStartOffset(), range.getEndOffsetInclusive() + 1), bibleURLBookName, bookRegex);
        Logger.log(this.name + "." + arguments.callee.name + "(" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + ") :: returnValue= " + urlToReturn);
        return urlToReturn;

    } catch (e) {
        var errorTitle = "UnknownError";
        var errorMessage = "Impossible to complete the operation with parameter(s) [" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + "]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};

/**
 * Validates the received parameters of the method <code>getURL()</code>.
 *
 * @author Obed Vazquez
 * @since 08/Apr/2016
 * @param {string} bibleURLBookName - Bible book name in the 'bible.com' URL.
 * @param {Text} textElem - Text element on the document where will insert the URL as an Hyperlink, more info:https://developers.google.com/apps-script/reference/document/text
 * @param {RangeElement} range - Exact text in the element (and document) where the hyperlink will be inserted;
 *                                  more info: https://developers.google.com/apps-script/reference/document/range-element.
 * @throws ValidationException In case one of the Parameters is not provided.
 */
VerseMaker.prototype.validateGetURLParameters = function validateGetURLParameters(bibleURLBookName, textElem, range, bookRegex) {
    Logger.log(this.name + "." + arguments.callee.name + "(" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + ") :: ");
    var errorTitle;
    var errorMessage;
    if (bibleURLBookName === null || bibleURLBookName === "") {
        errorMessage = "The Name of the Book on http://bible.com was not provided. Try with abreviations like 'Gen' (for Genesis)";
        throw new ValidationException(errorMessage, this.constructor.name, arguments.callee.name, e);
    } else if (textElem === null || textElem === "") {
        errorMessage = "The TextElement object must be provided in order to be able to get the verse to obtain the final URL. More info:https://developers.google.com/apps-script/reference/document/text";
        throw new ValidationException(errorMessage, this.constructor.name, arguments.callee.name, e);
    } else if (range === null || range === "") {
        errorMessage = "The range parameter must be provided to know where to insert the link. More info: https://developers.google.com/apps-script/reference/document/range-element.";
        throw new ValidationException(errorMessage, this.constructor.name, arguments.callee.name, e);
    } else if (bookRegex === null || bookRegex === "") {
        errorMessage = "The bookRegex is the way to find the book name, and must be provided to continue with the proccess. You can use this variable to identify them: allVersesRegex";
        throw new ValidationException(errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};

/**
 * Obtains the formated verse section of the URL to insert the link.
 *
 * @author Obed Vazquez
 * @since 09/Apr/2016
 * @param {string} verse - Any tipe of bible verse (ful or abbreviated), ie: Jhn 1.1 or John 1.1 or Juan 1.1, Jn 1.1-2, etc.
 * @param {string} bibleURLBookName - The bible.
 * @param {string} bookRegex - The regex of the Bible book name.
 * @throws ValidationException In case any of the parameters is not provided.
 * @modifies Obed Vazquez Lopez
 * @version 15/Mar/2018
 */
VerseMaker.prototype.getCurrentVerses = function getCurrentVerses(verse, bibleURLBookName, bookRegex) {
    Logger.log(this.name + "." + arguments.callee.name + "(" + verse + "," + bibleURLBookName + "," + bookRegex + ") :: ");
    this.validateGetURLParameters(bibleURLBookName, "textElem", "range", bookRegex);
    if (verse === null || verse === "") {
        errorMessage = "the verse must be provided in order to format it. it can be any verse in the Bible in any format";
        throw new ValidationException(errorMessage, this.constructor.name, arguments.callee.name, e);
    }
    try {

        var regexExpression = new RegExp(bookRegex+"[\\.]?", "g");
        var chaptersAndVerses = verse.replace(regexExpression, "");
        chaptersAndVerses = chaptersAndVerses.replace(/:/g, ".");
        //eliminating spaces on the URL (previously)
        chaptersAndVerses = chaptersAndVerses.replace(/\s/g, "");

        if (bibleURLBookName === "jud" && (verse.indexOf("1.") <= -1)) {
            chaptersAndVerses = "1."+chaptersAndVerses;
        }

        chaptersAndVerses = chaptersAndVerses.replace(/;/g, ",");

        var returnValue = chaptersAndVerses.trim();
        Logger.log(this.name + "." + arguments.callee.name + "(" + verse + "," + bibleURLBookName + "," + bookRegex + ") :: returnValue= " + returnValue);
        return returnValue;

    } catch (e) {
        var errorTitle = "UnknownError";
        var errorMessage = "Impossible to complete the operation with parameter(s) [" + verse + "," + bibleURLBookName + "," + bookRegex + "]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};

/**
 * Normal alert in GAS.
 *
 * @author Obed Vazquez
 * @since 09/Apr/2016
 * @param {string} message - Message of the alert.
 * @param {string} [title] - Title of the alert.
 */
VerseMaker.prototype.alert = function alert(message, title) {
    //DocumentApp.getUi().alert(message);

    try {
        var ui = DocumentApp.getUi();
        var titulo = title || "Information";
        var result = ui.alert(
            titulo,
            message,
            ui.ButtonSet.OK);

    } catch (e) {
        var errorTitle = "UnknownError";
        var errorMessage = "Impossible to alert the message [" + message + "]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, arguments.callee.name, e);
    }
};






function onOpen() {
    try{
        var ui=DocumentApp.getUi();
        ui.createMenu("VerseMaker").
            addSubMenu(ui.createMenu("Set Hyperlinks").
                addItem("Spanish [Español]", "spanish").
                addItem("English", "english")).
            addItem("About", "help").addToUi();
    }catch(e){
        if(devMode){
            Logger.log(e +" -> "+ e.lineNumber);
            DocumentApp.getUi().alert("Imposible to set up VerseMaker Add-on","Error");//No se por que no ejecuta esto :S
        }else{
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e +" -> "+ e.lineNumber);
                Logger.log(ex +" -> "+ ex.lineNumber);
                DocumentApp.getUi().alert("An Error has being found, please report it to bible.verse.maker@gmail.com"); //pass v3r53m4k3r
            }
        }
    }
}

function getMenuStructure(){
    var menu={
            name:"VerseMaker",
            functionName:"",
            submenus:[
                {
                    name:"Set Hyperlinks",
                    functionName:"",
                    submenus:[
                        {
                            name:"Spanish [Español]",
                            functionName:"spanish",
                            submenus:[]
                        },{
                            name:"English",
                            functionName:"english",
                            submenus:[]
                        }
                    ]
                },{
                        name:"Help",
                        functionName:"help",
                        submenus:[]
                    }
            
            ]
    };
    return menu;
}

function createMenu(menu){
    var uiMenu = DocumentApp.getUi().createMenu(menu.name);
    addSubmenus(uiMenu,menu.submenus);
    return uiMenu;
}
function addSubmenus(uiMenu,submenus){
    if(submenus===null)
        return;
        
    for(var i=0;i<submenus.length;i++) {
        menu=submenus[i];
        if(menu.submenus.length>0){
            var uiSubmenu=DocumentApp.getUi().createMenu(menu.name);
            addSubmenus(uiSubmenu,menu.submenus);
            uiMenu.addSubMenu(uiSubmenu);
        }else{
            uiMenu.addItem(menu.name, menu.functionName).addToUi();
        }
    }
}

function english() {
    try {
        var verseMaker = new VerseMaker();
        verseMaker.setBibleHyperlinksEnglish();
    } catch (e) {
        if(devMode){
            Logger.log(e +" -> "+ e.lineNumber);
            DocumentApp.getUi().alert("An Error has being found, please check the logs of the plug-in"); //pass v3r53m4k3r
        }else{
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e);
                Logger.log(ex);
                DocumentApp.getUi().alert("An Error has being found, please report it to bible.verse.maker@gmail.com"); //pass v3r53m4k3r
            }
        }
    }
}

function spanish() {
    try {
        var verseMaker = new VerseMaker();
        verseMaker.setBibleHyperlinksSpanish();
        
    } catch (e) {
        if(devMode){
            Logger.log(e +" -> "+ e.lineNumber);
            DocumentApp.getUi().alert("An Error has being found, please check the logs of the plug-in"); //pass v3r53m4k3r
        }else{
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e);
                Logger.log(ex);
                DocumentApp.getUi().alert("An Error has being found, please report it to bible.verse.maker@gmail.com"); //pass v3r53m4k3r
            }
        }
    }
}

function help(){
    try {
        var htmlOutput = HtmlService
             .createHtmlOutputFromFile("About--how-to.html")
             .setSandboxMode(HtmlService.SandboxMode.IFRAME)
             .setWidth(900)
             .setHeight(400);
        DocumentApp.getUi().showModalDialog(htmlOutput, 'Help');
    } catch (e) {
        if(devMode){
            Logger.log(e +" -> "+ e.lineNumber);
            DocumentApp.getUi().alert("An Error has being found, please check the logs of the plug-in"); //pass v3r53m4k3r
        }else{
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e +" -> "+ e.lineNumber);
                Logger.log(ex +" -> "+ ex.lineNumber);
                DocumentApp.getUi().alert("An Error has being found, please report it to bible.verse.maker@gmail.com"); //pass v3r53m4k3r
            }
        }
    }
    //make a Bible Verse citation you can look at https://en.wikipedia.org/wiki/Bible_citation
}



function exceptionMail(trace) {
    try {
        var googleLogoUrl = "http://www.google.com/intl/en_com/images/srpr/logo3w.png";
        var googleLogoBlob = UrlFetchApp
            .fetch(googleLogoUrl)
            .getBlob();
        MailApp.sendEmail({
                to: "bible.verse.maker@gmail.com",
                subject: "Exception on VerseMaker User Add-on",
                htmlBody: "Pelas vato:<br>" + trace + "<br><br>" + "<img src='cid:googleLogo'> ",
                inlineImages: {
                    googleLogo: googleLogoBlob
                }
            });
    } catch (e) {
        var exceptionMessage = "Impossible to send the error trace mail due to an Uknown Error.";
        throw {
            name: "Fatal Error",
            message: exceptionMessage,
            methodName: arguments.callee.name,
            toString: function() {
                return ("Exception " + this.name + " at " + this.constructor.name + "." + arguments.callee.name + "() ::" + this.lineNumber + ":: " + this.message);
            }
        };
    }
}