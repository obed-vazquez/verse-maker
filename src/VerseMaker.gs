/*
 * Module:          VerseMaker.gs
 * Author mail:     oscarvir123@gmail.com
 * Author mail:     obed.vazquez@gmail.com
 * GoogleProyect:   https://script.google.com/d/14Qrk-vG5uDw_2Cws9NePZEazz8oEEVxHUlAKP_pp4Iut6PrF83YmYOtY/edit
 * License:         (Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/
 * Legal Code:      (Spanish) http://creativecommons.org/licenses/by-nc/2.5/mx/legalcode
 * Updated:         Migrated to V8 compatibility
 */

/**
* This is a temporal flag to know if it is working on a Development environment or in production.
* If the plug-in has being deployed please set this flag into false.
* @type    {boolean}
* @author  Obed Vazquez
* @since   27/07/2016
*/
const devMode = false;

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
const regexFirstOf = "(((1(((st)|[ao])[\\s]))|([1Ii][\\s]?))|((([Ff][Ii][Rr][Ss][Tt]([\\s][Oo][Ff])?)|([Pp][Rr][Ii][Mm][Ee][Rr][AaOo]([\\s][Dd][Ee])?))[\\s]))";
/**
 * @type    {string}
 * @author  Obed Vazquez
 * @since   26/01/2016
 */
const regexSecondOf = "(((2(((nd)|[ao])[\\s]))|((2|((II)|(ii)))[\\s]?))|((([Ss][Ee][Cc][Oo][Nn][Dd]([\\s][Oo][Ff])?)|([Ss][Ee][Gg][Uu][Nn][Dd][AaOo]([\\s][Dd][Ee])?))[\\s]))";
/**
 * @type    {string}
 * @author  Obed Vazquez
 * @since   26/01/2016
 */
const regexThirdOf = "(((3(((rd)|[ao])[\\s]))|((3|(III|(iii)))[\\s]?))|((([Tt][Hh][Ii][Rr][Dd]([\\s][Oo][Ff])?)|([Tt][Ee][Rr][Cc][Ee][Rr][AaOo]([\\s][Dd][Ee])?))[\\s]))";

/**
 * This is an array with all the regex on the Bible used to identify an abbreviation or full name of a book in the Bible.
 * list of books abreviations: https://docs.google.com/spreadsheets/d/140t98l2sZFA0CXipsg6zmlrhYPqGw3oHxSSh7MLI8MU/edit#gid=1285639834
 * accented elements https://lefunes.wordpress.com/2007/11/14/caracteres-especiales-en-javascript/
 * @type    {Object}
 * @author  Obed Vazquez
 * @author  Oscar Villareal
 * @since   26/01/2016
 */
const books = {
    "gen": "\\b([Gg][Ee\u00c9\u00e9][Nn][Ee][Ss][Ii][Ss]|[Gg][Ee\u00c9\u00e9][Nn]|[Gg][Ee\u00c9\u00e9]|[Gg][Nn])",
    "exo": "\\b([Ee\u00c9\u00e9][Xx][Oo][Dd][Oo]|[Ee\u00c9\u00e9][Xx][Oo]|[Ee\u00c9\u00e9][Xx])",
    "lev": "\\b([Ll][Ee][Vv][Ii\u00CD\u00ed][Tt][Ii][Cc][Oo]|[Ll][Ee][Vv][Ii\u00CD\u00ed][Tt][Ii][Cc]|[Ll][Ee][Vv][Ii\u00CD\u00ed][Tt]|[Ll][Ee][Vv][Ii\u00CD\u00ed]|[Ll][Ee][Vv]|[Ll][Vv])",
    "num": "\\b([Nn][Uu\u00da\u00fa][Mm][Ee][Rr][Oo][Ss]|[Nn][Uu][Mm][Bb][Ee][Rr][Ss]|[Nn][Uu\u00da\u00fa][Mm]|[Nn][Mm]|[Nn][Bb])",
    "deu": "\\b([Dd][Ee][Uu][Tt][Ee][Rr][Oo][Nn][Oo][Mm][Ii][Oo]|[Dd][Ee][Uu][Tt][Ee][Rr][Oo][Nn][Oo][Mm][Yy]|[Dd][Ee][Uu][Tt][Ee][Rr][Oo]|[Dd][Ee][Uu][Tt]|[Dd][Ee][Uu]|[Dd][Ee]|[Dd][Tt])",
    "jos": "\\b([Jj][Oo][Ss][Uu][Ee\u00c9\u00e9]|[Jj][Oo][Ss][Hh][Uu][Aa]|[Jj][Oo][Ss][Hh]|[Jj][Oo][Ss]|[Jj][Ss][Hh]|[Jj][Ss])",
    "jdg": "\\b([Jj][Uu][Ee][Cc][Ee][Ss]|[Jj][Uu][Dd][Gg][Ee][Ss]|[Jj][Dd][Gg][Ss]|[Jj][Uu][Dd][Gg]|[Jj][Dd][Gg]|[Jj][Uu][Ee]|[Jj][Gg])",
    "rut": "\\b([Rr][Uu][Tt][Hh]|[Rr][Uu][Tt]|[Rr][Tt][Hh]|[Rr][Uu]|[Rr][Tt])",
    "1sa": "\\b(" + regexFirstOf + "([Ss][Aa][Mm][Uu][Ee][Ll]|[Ss][Aa][Mm]|[Ss][Aa]|[Ss][Mm]|[Ss]))",
    "2sa": "\\b(" + regexSecondOf + "([Ss][Aa][Mm][Uu][Ee][Ll]|[Ss][Aa][Mm]|[Ss][Aa]|[Ss][Mm]|[Ss]))",
    "1ki": "\\b(" + regexFirstOf + "([Rr][Ee][Yy][Ee][Ss]|[Kk][Ii][Nn][Gg][Ss]|[Kk][Gg][Ss]|[Kk][Ii][Nn]|[Rr][Ee]|[Rr]\\.|[Kk][Ii]|[Kk]))",
    "2ki": "\\b(" + regexSecondOf + "([Rr][Ee][Yy][Ee][Ss]|[Kk][Ii][Nn][Gg][Ss]|[Kk][Gg][Ss]|[Kk][Ii][Nn]|[Rr][Ee]|[Rr]\\.|[Kk][Ii]|[Kk]))",
    "1ch": "\\b(" + regexFirstOf + "([Cc][Rr][Oo\u00d3\u00f3][Nn][Ii][Cc][Aa][Ss]|[Cc][Hh][Rr][Oo][Nn][Ii][Cc][Ll][Ee][Ss]|[Cc][Rr][Oo\u00d3\u00f3][Nn]|[Cc][Hh][Rr][Oo][Nn]|[Cc][Rr][Oo\u00d3\u00f3]|[Cc][Hh][Rr]|[Cc][Rr]|[Cc][Hh]))",
    "2ch": "\\b(" + regexSecondOf + "([Cc][Rr][Oo\u00d3\u00f3][Nn][Ii][Cc][Aa][Ss]|[Cc][Hh][Rr][Oo][Nn][Ii][Cc][Ll][Ee][Ss]|[Cc][Rr][Oo\u00d3\u00f3][Nn]|[Cc][Hh][Rr][Oo][Nn]|[Cc][Rr][Oo\u00d3\u00f3]|[Cc][Hh][Rr]|[Cc][Rr]|[Cc][Hh]))",
    "ezr": "\\b([Ee][Ss][Dd][Rr][Aa][Ss]|[Ee][Zz][Rr][Aa]|[Ee][Ss][Dd]|[Ee][Zz][Rr])",
    "neh": "\\b([Nn][Ee][Hh][Ee][Mm][Ii\u00CD\u00ed][Aa][Ss]|[Nn][Ee][Hh][Ee][Mm][Ii][Aa][Hh]|[Nn][Ee][Hh]|[Nn][Hh][Mm])",
    "est": "\\b([Ee][Ss][Tt][Hh][Ee][Rr]|[Ee][Ss][Tt][Ee][Rr]|[Ee][Ss][Tt][Hh]|[Ee][Ss][Tt]|[Ee][Ss])",
    "job": "\\b([Jj][Oo][Bb])",
    "psa": "\\b([Ss][Aa][Ll][Mm][Oo][Ss]|[Pp][Ss][Aa][Ll][Mm][Ss]|[Pp][Ss][Aa][Ll][Mm]|[Ss][Aa][Ll][Mm][Oo]|[Pp][Ss][Ll][Mm]|[Pp][Ss][Mm][Ss]|[Ss][Aa][Ll]|[Pp][Ss][Aa]|[Pp][Ss][Mm]|[Pp][Ss][Ss]|[Pp][Ss])",
    "pro": "\\b([Pp][Rr][Oo][Vv][Ee][Rr][Bb][Ii][Oo][Ss]|[Pp][Rr][Oo][Vv][Ee][Rr][Bb][Ss]|[Pp][Rr][Oo][Vv]|[Pp][Rr][Vv]|[Pp][Rr][Oo]|[Pp][Vv]|[Pp][Rr])",
    "ecc": "\\b([Ee][Cc][Cc][Ll][Ee][Ss][Ii][Aa][Ss][Tt][Ee][Ss]|[Ee][Cc][Ll][Ee][Ss][Ii][Aa][Ss][Tt][Ee\u00C9\u00e9][Ss]|[Qq][Oo][Hh][Ee][Ll][Ee][Tt][Hh]|[Ee][Cc][Cc][Ll][Ee][Ss]|[Qq][Oo][Hh][Ee][Cc][Ll]|[Ee][Cc][Cc][Ll]|[Ee][Cc])",
    "sng": "\\b([Cc][Aa][Nn][Tt][Aa][Rr][Ee][Ss]|[Ss][Oo][Nn][Gg]([\\s][Oo][Ff][\\s][Ss][Oo][Ll][Oo][Mm][Oo][Nn])?|[Cc][Aa][Nn][Tt]|[Cc][Nn][Tt]|[Cc][Aa][Nn]|[Ss][Oo][Ss])",
    "isa": "\\b([Ii][Ss][Aa][Ii\u00cd\u00ed][Aa][Ss]|[Ii][Ss][Aa][Ii][Aa][Hh]|[Ii][Ss][Aa]|[Ii][Ss])",
    "jer": "\\b([Jj][Ee][Rr][Ee][Mm][Ii\u00cd\u00ed][Aa][Ss]|[Jj][Ee][Rr][Ee][Mm][Ii][Aa][Hh]|[Jj][Ee][Rr]|[Jj][Ee])",
    "lam": "\\b([Ll][Aa][Mm][Ee][Nn][Tt][Aa][Cc][Ii][Oo][Nn][Ee][Ss]|[Ll][Aa][Mm]|[Ll][Aa]|[Ll][Mm])",
    "ezk": "\\b([Ee][Zz][Ee][Kk][Ii][Ee][Ll]|[Ee][Zz][Ee][Qq][Uu][Ii][Ee][Ll]|[Ee][Zz][Ee][Kk]|[Ee][Zz][Ee][Qq]|[Ee][Zz][Kk]|[Ee][Zz][Qq]|[Ee][Zz][Ee]|[Ee][Zz])",
    "dan": "\\b([Dd][Aa][Nn][Ii][Ee][Ll]|[Dd][Aa][Nn]|[Dd][Aa])",
    "hos": "\\b([Oo][Ss][Ee][Aa][Ss]|[Hh][Oo][Ss][Ee][Aa]|[Hh][Oo][Ss]|[Oo][Ss])",
    "jol": "\\b([Jj][Oo][Ee][Ll]|[Jj][Oo][Ll]|[Jj][Ll])",
    "amo": "\\b([Aa][Mm][Oo][Ss]|[Aa][Mm][Oo]|[Aa][Mm])",
    "oba": "\\b([Aa][Bb][Dd][Ii\u00cd\u00ed][Aa][Ss]|[Oo][Bb][Aa][Dd][Ii][Aa][Hh]|[Aa][Bb][Dd]|[Oo][Bb][Aa][Dd]|[Oo][Bb][Dd]|[Oo][Bb])",
    "jon": "\\b([Jj][Oo][Nn][Aa][Ss]|[Jj][Oo][Nn])",
    "mic": "\\b([Mm][Ii][Qq][Uu][Ee][Aa][Ss]|[Mm][Ii][Cc][Aa][Hh]|[Mm][Ii][Qq]|[Mm][Ii][Cc]|[Mm][Ii])",
    "nam": "\\b([Nn][Aa][Hh][Uu][Mm]|[Nn][Aa][Hh][Uu][Mm]|[Nn][Aa][Hh]|[Nn][Hh][Mm]|[Nn][Aa])",
    "hab": "\\b([Hh][Aa][Bb][Aa][Kk][Kk][Uu][Kk]|[Hh][Aa][Bb][Aa][Cc][Uu][Cc]|[Hh][Aa][Bb]|[Hh][Bb])",
    "zep": "\\b([Ss][Oo][Ff][Oo][Nn][Ii\u00cd\u00ed][Aa][Ss]|[Zz][Ee][Pp][Hh][Aa][Nn][Ii][Aa][Hh]|[Zz][Ee][Pp][Hh]|[Ss][Oo][Ff]|[Zz][Ee][Pp])",
    "hag": "\\b([Hh][Aa][Gg][Ee][Oo]|[Hh][Aa][Gg]|[Hh][Gg])",
    "zec": "\\b([Zz][Aa][Cc][Aa][Rr][Ii\u00ED\u00CD][Aa][Ss]|[Zz][Ee][Cc][Hh][Aa][Rr][Ii][Aa][Hh]|[Zz][Ee][Cc][Hh]|[Zz][Aa][Cc]|[Zz][Ee][Cc]|[Zz][Aa])",
    "mal": "\\b([Mm][Aa][Ll][Aa][Qq][Uu][Ii][Aa][Ss]|[Mm][Aa][Ll][Aa][Cc][Hh][Ii]|[Mm][Aa][Ll])",
    "mat": "\\b([Mm][Aa][Tt][Ee][Oo]|[Mm][Aa][Tt][Tt][Hh][Ee][Ww]|[Mm][Aa][Tt][Tt]|[Mm][Tt][Tt]|[Mm][Aa][Tt]|[Mm][Tt])",
    "mrk": "\\b([Mm][Aa][Rr][Cc][Oo][Ss]|[Mm][Aa][Rr][Kk]|[Mm][Rr][Kk]|[Mm][Aa][Rr]|[Mm][Cc]|[Mm][Rr]|[Mm][Kk])",
    "luk": "\\b([Ll][Uu][Cc][Aa][Ss]|[Ll][Uu][Kk][Ee]|[Ll][Uu][Kk]|[Ll][Uu][Cc]|[Ll][Kk]|[Ll][Cc])",
    "jhn": "\\b([Jj][Uu][Aa][Nn]|[Jj][Oo][Hh][Nn]|[Jj][Hh][Nn]|[Jj][Uu][Aa]|[Jj][Nn])",
    "act": "\\b(([Hh][Ee][Cc][Hh][Oo][Ss]([\\s][Dd][Ee][\\s][Ll][Oo][Ss][\\s][Aa][Pp][Oo\u00d3\u00f3][Ss][Tt][Oo][Ll][Ee][Ss])?)|[Aa][Cc][Tt][Ss]|[Hh][Cc][Hh][Ss]|[Aa][Cc][Tt]|[Hh][Cc][Hh]|[Aa][Cc])",
    "rom": "\\b([Rr][Oo][Mm][Aa][Nn][Oo][Ss]|[Rr][Oo][Mm][Aa][Nn][Ss]|[Rr][Mm][Nn][Ss]|[Rr][Oo][Mm][Ss]|[Rr][Oo][Mm]|[Rr][Mm][Nn]|[Rr][Oo]|[Rr][Mm])",
    "1co": "\\b(" + regexFirstOf + "([Cc][Oo][Rr][Ii][Nn][Tt][Ii][Oo][Ss]|[Cc][Oo][Rr][Ii][Nn][Tt][Hh][Ii][Aa][Nn][Ss]|[Cc][Oo][Rr]|[Cc][Oo]))",
    "2co": "\\b(" + regexSecondOf + "([Cc][Oo][Rr][Ii][Nn][Tt][Ii][Oo][Ss]|[Cc][Oo][Rr][Ii][Nn][Tt][Hh][Ii][Aa][Nn][Ss]|[Cc][Oo][Rr]|[Cc][Oo]))",
    "gal": "\\b([Gg][Aa\u00c1\u00e1][Ll][Aa][Tt][Aa][Ss]|[Gg][Aa][Ll][Aa][Tt][Ii][Aa][Nn][Ss]|[Gg][Aa\u00c1\u00e1][Ll]|[Gg][Aa][Ll]|[Gg][Aa\u00c1\u00e1]|[Gg][Ll]|[Gg][Aa])",
    "eph": "\\b([Ee][Ff][Ee][Ss][Ii][Oo][Ss]|[Ee][Pp][Hh][Ee][Ss][Ii][Aa][Nn][Ss]|[Ee][Pp][Hh][Ee]|[Ee][Pp][Hh]|[Ee][Ff][Ee]|[Ee][Ff])",
    "php": "\\b([Ff][Ii][Ll][Ii][Pp][Ee][Nn][Ss][Ee][Ss]|[Pp][Hh][Ii][Ll][Ii][Pp][Pp][Ii][Aa][Nn][Ss]|[Pp][Hh][Ii][Ll]|[Ff][Ii][Ll]|[Pp][Hh][Pp]|[Ff][Ll][Pp]|[Ff][Ll])",
    "col": "\\b([Cc][Oo][Ll][Oo][Ss][Ee][Nn][Ss][Ee][Ss]|[Cc][Oo][Ll][Oo][Ss][Ss][Ii][Aa][Nn][Ss]|[Cc][Oo][Ll])",
    "1th": "\\b(" + regexFirstOf + "([Tt][Ee][Ss][Aa][Ll][Oo][Nn][Ii][Cc][Ee][Nn][Ss][Ee][Ss]|[Tt][Hh][Ee][Ss][Ss][Aa][Ll][Oo][Nn][Ii][Aa][Nn][Ss]|[Tt][Hh][Ee][Ss][Ss]|[Tt][Ee][Ss]|[Tt][Hh]|[Tt][Ss]))",
    "2th": "\\b(" + regexSecondOf + "([Tt][Ee][Ss][Aa][Ll][Oo][Nn][Ii][Cc][Ee][Nn][Ss][Ee][Ss]|[Tt][Hh][Ee][Ss][Ss][Aa][Ll][Oo][Nn][Ii][Aa][Nn][Ss]|[Tt][Hh][Ee][Ss][Ss]|[Tt][Ee][Ss]|[Tt][Hh]|[Tt][Ss]))",
    "1ti": "\\b(" + regexFirstOf + "([Tt][Ii][Mm][Oo][Tt][Ee][Oo]|[Tt][Ii][Mm][Oo][Tt][Hh][Yy]|[Tt][Ii][Mm]|[Tt][Mm]))",
    "2ti": "\\b(" + regexSecondOf + "([Tt][Ii][Mm][Oo][Tt][Ee][Oo]|[Tt][Ii][Mm][Oo][Tt][Hh][Yy]|[Tt][Ii][Mm]|[Tt][Mm]))",
    "tit": "\\b([Tt][Ii][Tt][Oo]|[Tt][Ii][Tt][Uu][Ss]|[Tt][Ii][Tt]|[Tt][Ii])",
    "phm": "\\b([Ff][Ii][Ll][Ee][Mm][Oo\u00f3\u00d3][Nn]|[Pp][Hh][Ii][Ll][Ee][Mm][Oo][Nn]|[Pp][Hh][Mm]|[Ff][Ii])",
    "heb": "\\b([Hh][Ee][Bb][Rr][Ee][Oo][Ss]|[Hh][Ee][Bb][Rr][Ee][Ww][Ss]|[Hh][Ee][Bb]|[Hh][Ee])",
    "jas": "\\b([Ss][Aa][Nn][Tt][Ii][Aa][Gg][Oo]|[Jj][Aa][Mm][Ee][Ss]|[Ss][Aa][Nn]|[Jj][Aa][Ss]|[Jj][Aa][Mm]|[Ss][Tt]|[Ss][Aa]|[Ss])",
    "1pe": "\\b(" + regexFirstOf + "([Pp][Ee][Dd][Rr][Oo]|[Pp][Ee][Tt][Ee][Rr]|[Pp][Ee][Tt]|[Pp][Ee][Dd]|[Pp][Ee]))",
    "2pe": "\\b(" + regexSecondOf + "([Pp][Ee][Dd][Rr][Oo]|[Pp][Ee][Tt][Ee][Rr]|[Pp][Ee][Tt]|[Pp][Ee][Dd]|[Pp][Ee]))",
    "1jn": "\\b(" + regexFirstOf + "([Jj][Uu][Aa]([Nn])?|[Jj][Oo][Hh][Nn]|[Jj][Nn]))",
    "2jn": "\\b(" + regexSecondOf + "([Jj][Uu][Aa]([Nn])?|[Jj][Oo][Hh][Nn]|[Jj][Nn]))",
    "3jn": "\\b(" + regexThirdOf + "([Jj][Uu][Aa]([Nn])?|[Jj][Oo][Hh][Nn]|[Jj][Nn]))",
    "jud": "\\b([Jj][Uu][Dd][Aa][Ss]|[Jj][Uu][Dd][Ee]|[Jj][Uu][Dd]|[Jj][Dd])",
    "rev": "\\b([Rr][Ee][Vv][Ee][Ll][Aa][Cc][Ii][Oo\u00f3\u00d3][Nn]([Ee][Ss])?|[Aa][Pp][Oo][Cc][Aa][Ll][Ii][Pp][Ss][Ii][Ss]|[Rr][Ee][Vv][Ee][Ll][Aa][Tt][Ii][Oo][Nn]|[Aa][Pp][Oo][Cc]|[Rr][Ee][Vv]|[Rr][Vv]|[Aa][Pp])"
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
const allVersesRegex = "[\\.]?[\\s]*[0-9]+(?:[-–][0-9]+)?(?:[:\\.][0-9]+(?:[-–][0-9]+)?)?(?:[,;][\\s]*[0-9]+(?:[-–][0-9]+)?(?:[:\\.][0-9]+(?:[-–][0-9]+)?)?)*";
//bible.com no acepta referencias entre varios capitulos por ejemplo: Jn 1:3-2:3  Ó Jn 3:2;4:1 (con el ultimo se identificaria como: Jn 3:2,4)
//El ; se elimino para que solo identifique la , pues es muy claro que es estandar.

/**
 * Language identifier for bible.com (spanish:149 and english 1).
 *
 * @type    {string}
 * @author  Obed Vazquez
 * @since   26/01/2016
 */
let idiomID;

/**
 * Turns all the references to the Bible in the document to an hyperlink to the actual
 * Bible digital verse in bible.com with the help of the method setBibleHyperlinks()
 * and it specifies that the referenced Bible verses must be in the King James Version (English)
 *
 * @author Obed Vazquez Lopez
 * @since 26/01/2016
 * @version 28/Jul/2016
 * @throws VerseMakerException Unknown Exception.
 */
VerseMaker.prototype.setBibleHyperlinksEnglish = function setBibleHyperlinksEnglish() {
    const methodName = 'setBibleHyperlinksEnglish';
    Logger.log(this.constructor.name + "." + methodName + "() :: ");
    try {
        idiomID = 1;
        const versesFoundCounter = this.setBibleHyperlinks();
        if (versesFoundCounter === 0) {
            this.alert("VerseMaker couldn't found any Biblical citation, if you need help you can go to the About menu to learn how to make your own Bible verse citation.", "Oops!");
        } else {
            this.alert(versesFoundCounter + " verses have been set as hyperlinks to the KJV version.", "Success");
        }
    } catch (e) {
        const errorTitle = "UnknownError";
        const errorMessage = "Impossible to set the language to english";
        const rootError = new VerseMakerException(errorTitle, errorMessage, this.constructor.name, methodName, e);
        Logger.log("FULL STACK TRACE:");
        Logger.log(rootError.stack || rootError);
        throw rootError;
    }
};

/**
 * Turns all the references to the Bible in the document to an hyperlink to the actual
 * Bible digital verse in bible.com with the help of the method setBibleHyperlinks()
 * and it specifies that the referenced Bible verses must be in the Reina Valera de 1960 (Spanish),
 * it accomplish this through the idiomID global parameter
 *
 * @author Obed Vazquez Lopez
 * @since 27/Jul/2016
 * @throws VerseMakerException Unknown Exception
 */
VerseMaker.prototype.setBibleHyperlinksSpanish = function setBibleHyperlinksSpanish() {
    const methodName = 'setBibleHyperlinksSpanish';
    Logger.log(this.constructor.name + "." + methodName + "() :: ");
    try {
        idiomID = 149;
        const versesFoundCounter = this.setBibleHyperlinks();
        if (versesFoundCounter === 0) {
            this.alert("No se ha encontrado ninguna cita Bíblica, si necesitas ayuda ve al menú de About para aprender a hacer tu propia cita bíblica.", "Oops!");
        } else {
            this.alert(versesFoundCounter + " versículos se han establecido como hipervínculos a la versión RVR60.", "Éxito");
        }
    } catch (e) {
        const errorTitle = "UnknownError";
        const errorMessage = "Impossible to set the language to spanish";
        const rootError = new VerseMakerException(errorTitle, errorMessage, this.constructor.name, methodName, e);
        Logger.log("FULL STACK TRACE:");
        Logger.log(rootError.stack || rootError);
        throw rootError;
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
    const methodName = 'setBibleHyperlinks';
    Logger.log(this.constructor.name + "." + methodName + "() :: ");
    if (idiomID === null || idiomID === undefined) {
        const errorMessage = "The language has not being set. This is an unexpected Error, please provide feedback on its occurrence.";
        throw {
            name: "ValidationError",
            message: errorMessage,
            methodName: methodName,
            toString: function () {
                return ("Exception " + this.name + " at " + VerseMaker.name + "." + methodName + "() :: " + this.message);
            }
        };
    }
    try {
        let versesFoundCounter = 0;
        const doc = DocumentApp.getActiveDocument();
        for (let i = 0; i < doc.getNumChildren(); i++) {
            const element = doc.getBody().getChild(i);
            const textElem = element.asText();
            versesFoundCounter = versesFoundCounter + this.findBooks(textElem);
        }
        return versesFoundCounter;
    } catch (e) {
        const errorTitle = "UnknownError";
        const errorMessage = "Impossible to set the Bible Hyperlinks due to an unknown issue.";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, methodName, e);
    }
};

/**
 * The solely intention of this method is to find the actual regex in the physical document,
 * for this, the regex must be preconfigured and the method will call the setLinkUrl() function
 * to turn all of the occurrences as Hyperlinks in the given text element from the document.
 *
 * @param {Text} textElem - Text element on the document, more information: https://developers.google.com/apps-script/reference/document/text
 */
VerseMaker.prototype.findBooks = function findBooks(textElem) {
    const methodName = 'findBooks';
    Logger.log(this.constructor.name + "." + methodName + "(" + textElem + ") :: ");
    if (textElem === null) return null;
    try {
        let versesFoundCounter = 0;

        for (const bibleURLBookName in books) {
            let bookVersesFoundCounter = 0;

            const bookRegex = books[bibleURLBookName];
            let range = textElem.findText(bookRegex + allVersesRegex);
            while (range !== null) {
                const textReference = range.getElement().asText();
                const start = range.getStartOffset();
                const end = range.getEndOffsetInclusive();
                textReference.setLinkUrl(start, end, this.getURL(bibleURLBookName, textElem, range, bookRegex));
                bookVersesFoundCounter++;
                range = textElem.findText(bookRegex + allVersesRegex, range); //find the next match and puts it into the range
            }

            versesFoundCounter = versesFoundCounter + bookVersesFoundCounter;
        }

        return versesFoundCounter;
    } catch (e) {
        const errorTitle = "UnknownError";
        const errorMessage = "Impossible to look for the regex in the element [" + textElem + " ]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, methodName, e);
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
    const methodName = 'getURL';
    Logger.log(this.constructor.name + "." + methodName + "(" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + ") :: ");
    this.validateGetURLParameters(bibleURLBookName, textElem, range, bookRegex);

    try {
        // now using this https://www.bible.com/bible/149/MAT.6.RVR1960
        const urlToReturn = "www.bible.com/bible/" + idiomID + "/" + bibleURLBookName + "." +
            this.getCurrentVerses(textElem.getText().replace(/–/g, "-").substring(
                range.getStartOffset(), range.getEndOffsetInclusive() + 1), bibleURLBookName, bookRegex);
        Logger.log(this.constructor.name + "." + methodName + "(" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + ") :: returnValue= " + urlToReturn);
        return urlToReturn;
    } catch (e) {
        const errorTitle = "UnknownError";
        const errorMessage = "Impossible to complete the operation with parameter(s) [" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + "]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, methodName, e);
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
    const methodName = 'validateGetURLParameters';
    Logger.log(this.constructor.name + "." + methodName + "(" + bibleURLBookName + "," + textElem + "," + range + "," + bookRegex + ") :: ");
    let errorMessage;
    if (bibleURLBookName === null || bibleURLBookName === "") {
        errorMessage = "The Name of the Book on http://bible.com was not provided. Try with abbreviations like 'Gen' (for Genesis)";
        throw new ValidationException(errorMessage, this.constructor.name, methodName, null);
    } else if (textElem === null || textElem === "") {
        errorMessage = "The TextElement object must be provided in order to be able to get the verse to obtain the final URL. More info:https://developers.google.com/apps-script/reference/document/text";
        throw new ValidationException(errorMessage, this.constructor.name, methodName, null);
    } else if (range === null || range === "") {
        errorMessage = "The range parameter must be provided to know where to insert the link. More info: https://developers.google.com/apps-script/reference/document/range-element.";
        throw new ValidationException(errorMessage, this.constructor.name, methodName, null);
    } else if (bookRegex === null || bookRegex === "") {
        errorMessage = "The bookRegex is the way to find the book name, and must be provided to continue with the process. You can use this variable to identify them: allVersesRegex";
        throw new ValidationException(errorMessage, this.constructor.name, methodName, null);
    }
};

/**
 * Obtains the formatted verse section of the URL to insert the link.
 *
 * @author Obed Vazquez
 * @since 09/Apr/2016
 * @param {string} verse - Any type of bible verse (full or abbreviated), ie: Jhn 1.1 or John 1.1 or Juan 1.1, Jn 1.1-2, etc.
 * @param {string} bibleURLBookName - The bible.
 * @param {string} bookRegex - The regex of the Bible book name.
 * @throws ValidationException In case any of the parameters is not provided.
 * @modifies Obed Vazquez Lopez
 * @version 15/Mar/2018
 */
VerseMaker.prototype.getCurrentVerses = function getCurrentVerses(verse, bibleURLBookName, bookRegex) {
    const methodName = 'getCurrentVerses';
    Logger.log(this.constructor.name + "." + methodName + "(" + verse + "," + bibleURLBookName + "," + bookRegex + ") :: ");
    this.validateGetURLParameters(bibleURLBookName, "textElem", "range", bookRegex);
    if (verse === null || verse === "") {
        const errorMessage = "the verse must be provided in order to format it. it can be any verse in the Bible in any format";
        throw new ValidationException(errorMessage, this.constructor.name, methodName, null);
    }
    try {
        const regexExpression = new RegExp(bookRegex + "[\\.]?", "g");
        let chaptersAndVerses = verse.replace(regexExpression, "");
        chaptersAndVerses = chaptersAndVerses.replace(/:/g, ".");
        //eliminating spaces on the URL (previously)
        chaptersAndVerses = chaptersAndVerses.replace(/\s/g, "");

        if (bibleURLBookName === "jud" && (verse.indexOf("1.") <= -1)) {
            chaptersAndVerses = "1." + chaptersAndVerses;
        }

        chaptersAndVerses = chaptersAndVerses.replace(/;/g, ",");

        const returnValue = chaptersAndVerses.trim();
        Logger.log(this.constructor.name + "." + methodName + "(" + verse + "," + bibleURLBookName + "," + bookRegex + ") :: returnValue= " + returnValue);
        return returnValue;
    } catch (e) {
        const errorTitle = "UnknownError";
        const errorMessage = "Impossible to complete the operation with parameter(s) [" + verse + "," + bibleURLBookName + "," + bookRegex + "]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, methodName, e);
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
    const methodName = 'alert';
    try {
        const ui = DocumentApp.getUi();
        const titulo = title || "Information";
        const result = ui.alert(
            titulo,
            message,
            ui.ButtonSet.OK);
    } catch (e) {
        const errorTitle = "UnknownError";
        const errorMessage = "Impossible to alert the message [" + message + "]";
        throw new VerseMakerException(errorTitle, errorMessage, this.constructor.name, methodName, e);
    }
};

function onOpen() {
    try {
        const ui = DocumentApp.getUi();
        ui.createMenu("VerseMaker")
            .addSubMenu(ui.createMenu("Set Hyperlinks")
                .addItem("Spanish [Español]", "spanish")
                .addItem("English", "english"))
            .addItem("About", "help")
            .addToUi();
    } catch (e) {
        if (devMode) {
            Logger.log(e + " -> " + (e.lineNumber || 'unknown line'));
            DocumentApp.getUi().alert("Impossible to set up VerseMaker Add-on", "Error");
        } else {
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e + " -> " + (e.lineNumber || 'unknown line'));
                Logger.log(ex + " -> " + (ex.lineNumber || 'unknown line'));
                DocumentApp.getUi().alert("An Error has been found, please report it to bible.verse.maker@gmail.com");
            }
        }
    }
}

function getMenuStructure() {
    const menu = {
        name: "VerseMaker",
        functionName: "",
        submenus: [
            {
                name: "Set Hyperlinks",
                functionName: "",
                submenus: [
                    {
                        name: "Spanish [Español]",
                        functionName: "spanish",
                        submenus: []
                    }, {
                        name: "English",
                        functionName: "english",
                        submenus: []
                    }
                ]
            }, {
                name: "Help",
                functionName: "help",
                submenus: []
            }
        ]
    };
    return menu;
}

function createMenu(menu) {
    const uiMenu = DocumentApp.getUi().createMenu(menu.name);
    addSubmenus(uiMenu, menu.submenus);
    return uiMenu;
}

function addSubmenus(uiMenu, submenus) {
    if (submenus === null)
        return;

    for (let i = 0; i < submenus.length; i++) {
        const menu = submenus[i];
        if (menu.submenus.length > 0) {
            const uiSubmenu = DocumentApp.getUi().createMenu(menu.name);
            addSubmenus(uiSubmenu, menu.submenus);
            uiMenu.addSubMenu(uiSubmenu);
        } else {
            uiMenu.addItem(menu.name, menu.functionName).addToUi();
        }
    }
}

function english() {
    try {
        const verseMaker = new VerseMaker();
        verseMaker.setBibleHyperlinksEnglish();
    } catch (e) {
        if (devMode) {
            Logger.log(e + " -> " + (e.lineNumber || 'unknown line'));
            DocumentApp.getUi().alert("An Error has been found, please check the logs of the plug-in");
        } else {
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e);
                Logger.log(ex);
                DocumentApp.getUi().alert("An Error has been found, please report it to bible.verse.maker@gmail.com");
            }
        }
    }
}

function spanish() {
    try {
        const verseMaker = new VerseMaker();
        verseMaker.setBibleHyperlinksSpanish();
    } catch (e) {
        if (devMode) {
            Logger.log(e + " -> " + (e.lineNumber || 'unknown line'));
            DocumentApp.getUi().alert("An Error has been found, please check the logs of the plug-in");
        } else {
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e);
                Logger.log(ex);
                DocumentApp.getUi().alert("An Error has been found, please report it to bible.verse.maker@gmail.com");
            }
        }
    }
}

function help() {
    try {
        const htmlOutput = HtmlService
            .createHtmlOutputFromFile("About--how-to.html")
            .setSandboxMode(HtmlService.SandboxMode.IFRAME)
            .setWidth(900)
            .setHeight(400);
        DocumentApp.getUi().showModalDialog(htmlOutput, 'Help');
    } catch (e) {
        if (devMode) {
            Logger.log(e + " -> " + (e.lineNumber || 'unknown line'));
            DocumentApp.getUi().alert("An Error has been found, please check the logs of the plug-in");
        } else {
            try {
                exceptionMail(e);
            } catch (ex) {
                Logger.log(e + " -> " + (e.lineNumber || 'unknown line'));
                Logger.log(ex + " -> " + (ex.lineNumber || 'unknown line'));
                DocumentApp.getUi().alert("An Error has been found, please report it to bible.verse.maker@gmail.com");
            }
        }
    }
}

function exceptionMail(trace) {
    try {
        const googleLogoUrl = "http://www.google.com/intl/en_com/images/srpr/logo3w.png";
        const googleLogoBlob = UrlFetchApp
            .fetch(googleLogoUrl)
            .getBlob();
        MailApp.sendEmail({
            to: "bible.verse.maker@gmail.com",
            subject: "Exception on VerseMaker User Add-on",
            htmlBody: "Exception details:<br>" + trace + "<br><br>" + "<img src='cid:googleLogo'> ",
            inlineImages: {
                googleLogo: googleLogoBlob
            }
        });
    } catch (e) {
        const exceptionMessage = "Impossible to send the error trace mail due to an Unknown Error.";
        throw {
            name: "Fatal Error",
            message: exceptionMessage,
            methodName: "exceptionMail",
            toString: function () {
                return ("Exception " + this.name + " at exceptionMail() :: " + this.message);
            }
        };
    }
}
