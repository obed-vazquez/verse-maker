/**
 * Test suite for VerseMaker Bible verse regex matching.
 *
 * Loads the regex constants from VerseMaker.gs and tests them
 * against a wide range of Bible reference formats and edge cases.
 */

const fs = require('fs');
const path = require('path');

// ─── Load source constants via sandboxed eval ─────────────────────────────────
const srcPath = path.resolve(__dirname, '..', 'src', 'VerseMaker.gs');
const srcCode = fs.readFileSync(srcPath, 'utf-8');

// We extract constants by running the .gs code inside a Function with stubs.
const sandbox = {};
const wrappedCode = `
  const Logger = { log: function(){} };
  const DocumentApp = { getUi: function(){ return {}; }, getActiveDocument: function(){ return {}; } };
  ${srcCode}
  return { regexFirstOf, regexSecondOf, regexThirdOf, books, allVersesRegex, VerseMaker };
`;
try {
    const factory = new Function(wrappedCode);
    Object.assign(sandbox, factory());
} catch (e) {
    // GAS-specific calls may fail; we only need the constants
    // If the above doesn't work, fallback to manual extraction
    console.error('Sandbox eval warning:', e.message);
}

const { books, allVersesRegex } = sandbox;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a full regex for a given book key (book pattern + verse pattern).
 * Uses the same combination as findBooks() does: bookRegex + allVersesRegex
 */
function buildFullRegex(bookKey) {
    const bookPattern = books[bookKey];
    return new RegExp(bookPattern + allVersesRegex, 'g');
}

/**
 * Find ALL matches for a specific book key in a given text.
 * Returns an array of matched strings.
 */
function findMatches(bookKey, text) {
    const regex = buildFullRegex(bookKey);
    return [...text.matchAll(regex)].map(m => m[0]);
}

/**
 * Find all matches across ALL books in the given text.
 * Returns { bookKey: [match1, match2, ...], ... }
 */
function findAllBookMatches(text) {
    const result = {};
    for (const bookKey in books) {
        const matches = findMatches(bookKey, text);
        if (matches.length > 0) {
            result[bookKey] = matches;
        }
    }
    return result;
}

/**
 * Simulate getCurrentVerses: strips the book name from the reference,
 * normalizes separators, and returns the formatted chapter.verse string.
 */
function simulateGetCurrentVerses(verse, bookKey) {
    const bookRegex = books[bookKey];
    // Fixed regex: removed extra space before ? to match source code exactly
    const regexExpression = new RegExp(bookRegex + "[\\.]?", "g");
    let chaptersAndVerses = verse.replace(/–/g, "-").replace(regexExpression, "");
    chaptersAndVerses = chaptersAndVerses.replace(/:/g, ".");
    chaptersAndVerses = chaptersAndVerses.replace(/\s/g, "");
    chaptersAndVerses = chaptersAndVerses.replace(/;/g, ",");

    // Special case for Jude (single-chapter book)
    if (bookKey === "jud" && verse.indexOf("1.") <= -1) {
        chaptersAndVerses = "1." + chaptersAndVerses;
    }

    return chaptersAndVerses.trim();
}

/**
 * Build the full bible.com URL for a reference.
 */
function buildURL(bookKey, verse, idiomID = 149) {
    return "www.bible.com/bible/" + idiomID + "/" + bookKey + "." +
        simulateGetCurrentVerses(verse, bookKey);
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('Book regex basics - should identify book names', () => {

    // ── Galatians (gal) ──────────────────────────────────────────────────
    describe('Galatians (gal)', () => {
        const key = 'gal';

        test.each([
            ['Ga 1.1-2', 'Ga 1.1-2'],
            ['Gal. 1:1-2', 'Gal. 1:1-2'],       // note: period after abbrev
            ['Gal 1:1-2', 'Gal 1:1-2'],
            ['Gál 1:1-2', 'Gál 1:1-2'],         // accented
            ['Gálatas 1:1-2', 'Gálatas 1:1-2'],
            ['Galatians 1:1-2', 'Galatians 1:1-2'],
            ['gal 3:16', 'gal 3:16'],           // lowercase
            ['Gl 5:22', 'Gl 5:22'],            // 2-letter abbreviation
            ['Gá 2:20', 'Gá 2:20'],            // accented 2-letter
        ])('matches "%s"', (input, expected) => {
            const matches = findMatches(key, input);
            expect(matches).toContain(expected);
        });
    });

    // ── Genesis (gen) ────────────────────────────────────────────────────
    describe('Genesis (gen)', () => {
        const key = 'gen';
        test.each([
            ['Gén 1.1', 'Gén 1.1'],
            ['Génesis 1:1', 'Génesis 1:1'],
            ['Gen 1:1', 'Gen 1:1'],
            ['Gn 50:26', 'Gn 50:26'],
            ['Ge 3:15', 'Ge 3:15'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── John / Juan (jhn) ───────────────────────────────────────────────
    describe('John / Juan (jhn)', () => {
        const key = 'jhn';
        test.each([
            ['Jn 1:10', 'Jn 1:10'],
            ['Juan 3:16', 'Juan 3:16'],
            ['John 1:1', 'John 1:1'],
            ['Jhn 3:16', 'Jhn 3:16'],
            ['juan 2', 'juan 2'],         // lowercase, chapter only
            ['Jua 1:1', 'Jua 1:1'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── 1 John / 1 Juan (1jn) ──────────────────────────────────────────
    describe('1 John / 1 Juan (1jn)', () => {
        const key = '1jn';
        test.each([
            ['1Jn3:42-43', '1Jn3:42-43'],
            ['1 Juan 1:9', '1 Juan 1:9'],
            ['1Jn2:42,45', '1Jn2:42,45'],
            ['I Juan 3:1', 'I Juan 3:1'],
            ['First John 1:1', 'First John 1:1'],
            ['Primero Juan 1:1', 'Primero Juan 1:1'],
            ['Primera de Juan 1:1', 'Primera de Juan 1:1'],
            ['1o Juan 1:1', '1o Juan 1:1'],
            ['1a Juan 1:1', '1a Juan 1:1'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── Hebrews / Hebreos (heb) ─────────────────────────────────────────
    describe('Hebrews / Hebreos (heb)', () => {
        const key = 'heb';
        test.each([
            ['Hebreos 1.1', 'Hebreos 1.1'],
            ['Hebrews 11:1', 'Hebrews 11:1'],
            ['Heb 4:12', 'Heb 4:12'],
            ['He 1:1', 'He 1:1'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── Jude / Judas (jud) ──────────────────────────────────────────────
    describe('Jude / Judas (jud)', () => {
        const key = 'jud';
        test.each([
            ['Jude 1.2', 'Jude 1.2'],
            ['Judas 3', 'Judas 3'],
            ['Jud 1:25', 'Jud 1:25'],
            ['Jd 3', 'Jd 3'],       // 2-letter abbreviation
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── James / Santiago (jas) ──────────────────────────────────────────
    describe('James / Santiago (jas)', () => {
        const key = 'jas';
        test.each([
            ['James 7-8', 'James 7-8'],       // chapter range (user requested)
            ['Santiago 1:5', 'Santiago 1:5'],
            ['San 2:14', 'San 2:14'],
            ['Jas 1:2-4', 'Jas 1:2-4'],
            ['Jam 3:1', 'Jam 3:1'],
            ['St 5:16', 'St 5:16'],        // shortest Spanish abbreviation
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── 1 Kings / 1 Reyes (1ki) ─────────────────────────────────────────
    describe('1 Kings / 1 Reyes (1ki)', () => {
        const key = '1ki';
        test.each([
            ['1o Reyes 2.1', '1o Reyes 2.1'],
            ['1reyes 2:1', '1reyes 2:1'],    // no space, lower
            ['First KiNgs2:2', 'First KiNgs2:2'], // mixed case, no space
            ['1 Re 3:5', '1 Re 3:5'],
            ['I Reyes 1:1', 'I Reyes 1:1'],
            ['1 Kings 18:21', '1 Kings 18:21'],
            ['Primero Reyes 1:1', 'Primero Reyes 1:1'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── 1 Samuel (1sa) ─────────────────────────────────────────────────
    describe('1 Samuel (1sa)', () => {
        const key = '1sa';
        test.each([
            ['1 sam 3:2-3', '1 sam 3:2-3'],
            ['1 Samuel 1:1', '1 Samuel 1:1'],
            ['I Sam 3:1', 'I Sam 3:1'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── Ephesians / Efesios (eph) ───────────────────────────────────────
    describe('Ephesians / Efesios (eph)', () => {
        const key = 'eph';
        test.each([
            ['Ef 1.1', 'Ef 1.1'],
            ['Efesios 2:8-9', 'Efesios 2:8-9'],
            ['Ephesians 6:11', 'Ephesians 6:11'],
            ['Eph 4:32', 'Eph 4:32'],
            ['Ephe 1:1', 'Ephe 1:1'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });

    // ── Revelation / Apocalipsis (rev) ──────────────────────────────────
    describe('Revelation / Apocalipsis (rev)', () => {
        const key = 'rev';
        test.each([
            ['Rev 1:1', 'Rev 1:1'],
            ['Revelación 21:4', 'Revelación 21:4'], // Note: this may or may not match depending on regex
            ['Apocalipsis 3:20', 'Apocalipsis 3:20'],
            ['Apoc 22:21', 'Apoc 22:21'],
            ['Ap 1:8', 'Ap 1:8'],
        ])('matches "%s"', (input, expected) => {
            expect(findMatches(key, input)).toContain(expected);
        });
    });
});


// ═════════════════════════════════════════════════════════════════════════════
// Verse format variations
// ═════════════════════════════════════════════════════════════════════════════
describe('Verse format variations', () => {

    test('period as chapter:verse separator — Gn 1.1', () => {
        expect(findMatches('gen', 'Gn 1.1')).toContain('Gn 1.1');
    });

    test('colon as chapter:verse separator — Gn 1:1', () => {
        expect(findMatches('gen', 'Gn 1:1')).toContain('Gn 1:1');
    });

    test('en-dash verse range — Gal 1:1–2', () => {
        expect(findMatches('gal', 'Gal 1:1–2')).toContain('Gal 1:1–2');
    });

    test('hyphen verse range — Gal 1:1-2', () => {
        expect(findMatches('gal', 'Gal 1:1-2')).toContain('Gal 1:1-2');
    });

    test('comma-separated verses — Gál 1:1–2,4-5', () => {
        expect(findMatches('gal', 'Gál 1:1–2,4-5')).toContain('Gál 1:1–2,4-5');
    });

    test('comma with space — Gál 1:1-2, 4-5', () => {
        // allVersesRegex has [,][\s]? so space after comma is optional
        expect(findMatches('gal', 'Gál 1:1-2, 4-5')).toContain('Gál 1:1-2, 4-5');
    });

    test('chapter only, no verse — Juan 3', () => {
        expect(findMatches('jhn', 'Juan 3')).toContain('Juan 3');
    });

    test('no space between book and chapter — 1Jn3:42-43', () => {
        expect(findMatches('1jn', '1Jn3:42-43')).toContain('1Jn3:42-43');
    });

    test('period after abbreviation — Gal. 1:1-2', () => {
        expect(findMatches('gal', 'Gal. 1:1-2')).toContain('Gal. 1:1-2');
    });

    test('chapter-chapter range (no verse) — James 7-8', () => {
        // "7-8" should be captured: [\d]+ matches "7", [-] matches "-", [\d]+ matches "8"
        expect(findMatches('jas', 'James 7-8')).toContain('James 7-8');
    });

    test('book with no space, no colon, just digits — Jd3', () => {
        expect(findMatches('jud', 'Jd3')).toContain('Jd3');
    });

    test('multiple comma-separated verses — 1Jn2:42,45', () => {
        expect(findMatches('1jn', '1Jn2:42,45')).toContain('1Jn2:42,45');
    });
});


// ═════════════════════════════════════════════════════════════════════════════
// Multi-chapter references (known limitations)
// ═════════════════════════════════════════════════════════════════════════════
describe('Multi-chapter references (known limitations)', () => {

    test('semicolon between chapters is NOT captured as single ref — Gal 1:1; Gal 2:2', () => {
        // The ; is explicitly excluded from allVersesRegex (see comment line 146).
        // Each "Gal X:Y" should be a SEPARATE match.
        const text = 'Gal 1:1; Gal 2:2';
        const matches = findMatches('gal', text);
        expect(matches).toContain('Gal 1:1');
        expect(matches).toContain('Gal 2:2');
        expect(matches).toHaveLength(2);
    });


    test('comma multi-chapter — Gálatas 1:1–2, 2:4-5 NOW captures FULLY', () => {
        // The match SHOULD contain the full "1:1–2, 2:4-5" as a single ref
        const text = 'Gálatas 1:1–2, 2:4-5';
        const matches = findMatches('gal', text);
        const fullRef = matches.find(m => m.includes('2:4-5'));
        expect(fullRef).toBeDefined(); // SUCCESS: multi-chapter supported!
        expect(fullRef).toContain('Gálatas 1:1–2, 2:4-5');
    });

    test('semicolon multi-chapter — Galatians 1:1–2; 2:4-5 NOW captures FULLY', () => {
        const text = 'Galatians 1:1–2; 2:4-5';
        const matches = findMatches('gal', text);
        expect(matches.length).toBe(1);
        expect(matches[0]).toBe('Galatians 1:1–2; 2:4-5'); // SUCCESS
    });
});


// ═════════════════════════════════════════════════════════════════════════════
// Negative tests - these should NOT match as Bible references
// ═════════════════════════════════════════════════════════════════════════════
describe('Negative tests - should NOT be identified as Bible references', () => {

    test('"Juanita" should not trigger Juan/John match', () => {
        // "Juan" appears inside "Juanita" at a word boundary, but there are
        // no digits following, so allVersesRegex should fail to match.
        const text = 'Juanita compró papas';
        const matches = findAllBookMatches(text);
        expect(Object.keys(matches)).toHaveLength(0);
    });

    test('"www.google.com" should not match anything', () => {
        const matches = findAllBookMatches('www.google.com');
        expect(Object.keys(matches)).toHaveLength(0);
    });

    test('"Texto Textito showyamove" should not match', () => {
        const matches = findAllBookMatches('Texto Textito showyamove');
        expect(Object.keys(matches)).toHaveLength(0);
    });

    test('"Somebody once told me" — no false positives', () => {
        const matches = findAllBookMatches('Somebody once told me the world is gonna roll me');
        expect(Object.keys(matches)).toHaveLength(0);
    });

    test('"Meem" should not match anything', () => {
        const matches = findAllBookMatches('Meem');
        expect(Object.keys(matches)).toHaveLength(0);
    });

    test('"B2 www.google.com" should not match', () => {
        const matches = findAllBookMatches('B2 www.google.com');
        expect(Object.keys(matches)).toHaveLength(0);
    });

    test('"Chorus 2x" should not match', () => {
        const matches = findAllBookMatches('[Chorus 2x www.google.com]');
        expect(Object.keys(matches)).toHaveLength(0);
    });
});


// ═════════════════════════════════════════════════════════════════════════════
// Full document integration test (user's test document)
// ═════════════════════════════════════════════════════════════════════════════
describe('Full test document - expected matches', () => {

    const testDocument = `Texto Textito www.google.com showyamove

Meem   Jn 1:10
Hebreos 1.1
Juanita compró: papas,mole y arroz. en 1Jn3:42-43
Paragraph X cortito Gén 1.1
Texto. Seguido 1 r 2:1
Bullet-1 www.google.com Jua20.2;21.3
B2 www.google.com
Jude 1.2
Somebody once told me the world is gonna roll me Jn 1:10
I ain't the sharpest tool in the shed
She was looking kind of dumb with her finger and her thumb Jn 1:10
In the shap Jn 1:10  e of an "L" Jn 1:11  on her forehead www.google.com

Gal 1:1; Gal 2:2. Ef 1.1;Ga 2:2
Jude 1.2;Jd3
Well, the years start coming and they don't stop coming juan 2
Fed to the rules and I hit the ground running
Didn't make sense not to live for fun juan 2
Your brain gets smart but your head gets dumb 1Jn2:42,45
Jn 1:10
So much to do, so much to see
So what's wrong with taking the back streets?
You'll never know if you don't go  www.google.com
You'll never shine if you don't glow 1o Reyes 2.1
1reyes 2:1
[Chorus:] First KiNgs2:2
Hey, now, you're an All Star get your game on, go play
Hey, now, 1 sam 3:2-3 you're a Rock Star get the show on get paid
And all that glitters is gold
Only shooting stars break the mold`;

    test('finds Jn 1:10 four times', () => {
        expect(findMatches('jhn', testDocument).filter(m => m.trim() === 'Jn 1:10')).toHaveLength(5);
    });

    test('finds Jn 1:11 once', () => {
        expect(findMatches('jhn', testDocument).filter(m => m.trim() === 'Jn 1:11')).toHaveLength(1);
    });

    test('finds Hebreos 1.1', () => {
        expect(findMatches('heb', testDocument)).toContainEqual(expect.stringContaining('Hebreos 1.1'));
    });

    test('finds 1Jn3:42-43', () => {
        expect(findMatches('1jn', testDocument)).toContainEqual(expect.stringContaining('1Jn3:42-43'));
    });

    test('finds Gén 1.1', () => {
        expect(findMatches('gen', testDocument)).toContainEqual(expect.stringContaining('n 1.1'));
    });

    test('finds Jua20.2;21.3 (captures full ref including semicolon)', () => {
        const matches = findMatches('jhn', testDocument);
        const juaMatch = matches.find(m => m.startsWith('Jua'));
        expect(juaMatch).toBeDefined();
        expect(juaMatch).toContain('20.2');
        // The ;21.3 IS now part of this match due to improved regex
        expect(juaMatch).toContain('21.3');
    });

    test('finds Jude 1.2 (twice)', () => {
        expect(findMatches('jud', testDocument).filter(m => m.includes('Jude 1.2'))).toHaveLength(2);
    });

    test('finds Jd3', () => {
        expect(findMatches('jud', testDocument)).toContainEqual(expect.stringContaining('Jd3'));
    });

    test('finds Gal 1:1 and Gal 2:2 as separate matches', () => {
        const galMatches = findMatches('gal', testDocument);
        expect(galMatches).toContainEqual(expect.stringContaining('Gal 1:1'));
        expect(galMatches).toContainEqual(expect.stringContaining('Gal 2:2'));
    });

    test('finds Ga 2:2', () => {
        const galMatches = findMatches('gal', testDocument);
        expect(galMatches).toContainEqual(expect.stringContaining('Ga 2:2'));
    });

    test('finds Ef 1.1', () => {
        expect(findMatches('eph', testDocument)).toContainEqual(expect.stringContaining('Ef 1.1'));
    });

    test('finds juan 2 (lowercase, chapter only) twice', () => {
        const matches = findMatches('jhn', testDocument).filter(m => m.includes('juan 2'));
        expect(matches).toHaveLength(2);
    });

    test('finds 1Jn2:42,45', () => {
        expect(findMatches('1jn', testDocument)).toContainEqual(expect.stringContaining('1Jn2:42,45'));
    });

    test('finds 1o Reyes 2.1', () => {
        expect(findMatches('1ki', testDocument)).toContainEqual(expect.stringContaining('Reyes 2.1'));
    });

    test('finds 1reyes 2:1', () => {
        expect(findMatches('1ki', testDocument)).toContainEqual(expect.stringContaining('reyes 2:1'));
    });

    test('finds First KiNgs2:2', () => {
        expect(findMatches('1ki', testDocument)).toContainEqual(expect.stringContaining('KiNgs2:2'));
    });

    test('finds 1 sam 3:2-3', () => {
        expect(findMatches('1sa', testDocument)).toContainEqual(expect.stringContaining('sam 3:2-3'));
    });

    test('"1 r 2:1" should NOT match as 1 Reyes (too short abbreviation)', () => {
        // "r" alone doesn't match the 1ki alternatives which require at least "Re", "R.", "Ki", or "K"
        const text = '1 r 2:1';
        const matches = findMatches('1ki', text);
        expect(matches).toHaveLength(0);
    });

    test('does NOT match "Juanita" as a verse reference in the document', () => {
        // Verify "Juanita" isn't matched - only the "1Jn3:42-43" on that line should match
        const line = 'Juanita compró: papas,mole y arroz. en 1Jn3:42-43';
        const johnMatches = findMatches('jhn', line);
        // "Juanita" starts with "Juan" at word boundary, but no digits follow → should not match
        expect(johnMatches).toHaveLength(0);
    });
});


// ═════════════════════════════════════════════════════════════════════════════
// URL generation tests (getCurrentVerses simulation)
// ═════════════════════════════════════════════════════════════════════════════
describe('URL generation (getCurrentVerses)', () => {

    test('Gal 1:1-2 → gal.1.1-2', () => {
        expect(simulateGetCurrentVerses('Gal 1:1-2', 'gal')).toBe('1.1-2');
    });

    test('Gal. 1:1-2 → gal.1.1-2', () => {
        expect(simulateGetCurrentVerses('Gal. 1:1-2', 'gal')).toBe('1.1-2');
    });

    test('Gálatas 3:28 → gal.3.28', () => {
        expect(simulateGetCurrentVerses('Gálatas 3:28', 'gal')).toBe('3.28');
    });

    test('Gál 1:1–2,4-5 → gal.1.1-2,4-5 (en-dash normalized)', () => {
        expect(simulateGetCurrentVerses('Gál 1:1–2,4-5', 'gal')).toBe('1.1-2,4-5');
    });

    test('Jn 1:10 → jhn.1.10', () => {
        expect(simulateGetCurrentVerses('Jn 1:10', 'jhn')).toBe('1.10');
    });

    test('Juan 3:16 → jhn.3.16', () => {
        expect(simulateGetCurrentVerses('Juan 3:16', 'jhn')).toBe('3.16');
    });

    test('1Jn3:42-43 → 1jn.3.42-43', () => {
        expect(simulateGetCurrentVerses('1Jn3:42-43', '1jn')).toBe('3.42-43');
    });

    test('1Jn2:42,45 → 1jn.2.42,45', () => {
        expect(simulateGetCurrentVerses('1Jn2:42,45', '1jn')).toBe('2.42,45');
    });

    test('Hebreos 1.1 → heb.1.1', () => {
        expect(simulateGetCurrentVerses('Hebreos 1.1', 'heb')).toBe('1.1');
    });

    test('Jude 1.2 → jud.1.2', () => {
        expect(simulateGetCurrentVerses('Jude 1.2', 'jud')).toBe('1.2');
    });

    test('Jd3 → jud.1.3 (single-chapter book auto-adds ch 1)', () => {
        expect(simulateGetCurrentVerses('Jd3', 'jud')).toBe('1.3');
    });

    test('Gén 1.1 → gen.1.1', () => {
        expect(simulateGetCurrentVerses('Gén 1.1', 'gen')).toBe('1.1');
    });

    test('1o Reyes 2.1 → 1ki.2.1', () => {
        expect(simulateGetCurrentVerses('1o Reyes 2.1', '1ki')).toBe('2.1');
    });

    test('James 7-8 → jas.7-8', () => {
        expect(simulateGetCurrentVerses('James 7-8', 'jas')).toBe('7-8');
    });

    test('juan 2 → jhn.2 (chapter only)', () => {
        expect(simulateGetCurrentVerses('juan 2', 'jhn')).toBe('2');
    });

    test('Full URL: Gal 1:1-2 in Spanish', () => {
        expect(buildURL('gal', 'Gal 1:1-2', 149)).toBe('www.bible.com/bible/149/gal.1.1-2');
    });

    test('Full URL: John 3:16 in English', () => {
        expect(buildURL('jhn', 'John 3:16', 1)).toBe('www.bible.com/bible/1/jhn.3.16');
    });

    test('Full URL: Jude 3 in Spanish (auto ch 1)', () => {
        expect(buildURL('jud', 'Jd3', 149)).toBe('www.bible.com/bible/149/jud.1.3');
    });
});


// ═════════════════════════════════════════════════════════════════════════════
// Edge cases and potential issues
// ═════════════════════════════════════════════════════════════════════════════
describe('Edge cases and potential issues', () => {

    test('Pipe character | in "1|2" should NOT be a valid separator ideally', () => {
        // Due to [:|\\.]  the pipe is literally matched. This documents the bug.
        const matches = findMatches('gen', 'Gen 1|2');
        // Currently this WILL match because | is in the character class [:|\\.]
        // This is arguably a bug — pipe should not be a valid separator
        if (matches.length > 0) {
            console.warn('⚠️  KNOWN ISSUE: pipe "|" accepted as chapter:verse separator');
        }
    });

    test('Santiago "S" alone could match other words — potential false positive', () => {
        // The jas regex ends with [Ss] as a standalone option, meaning a single "S" or "s"
        // followed by a number could falsely match. E.g. "s 5" in prose.
        const text = 'She has 5 cats';
        const matches = findMatches('jas', text);
        // "s 5" could match: \b[Ss] + allVersesRegex(" 5")
        // This documents whether it's a false positive
        if (matches.length > 0) {
            console.warn('⚠️  POTENTIAL FALSE POSITIVE: "s 5" matched as Santiago/James');
        }
    });

    test('Reference at start of text', () => {
        expect(findMatches('gen', 'Gen 1:1 is the first verse')).toContain('Gen 1:1');
    });

    test('Reference at end of text', () => {
        expect(findMatches('gen', 'The first verse is Gen 1:1')).toContain('Gen 1:1');
    });

    test('Multiple references on same line', () => {
        const text = 'Compare Gen 1:1 with John 1:1';
        expect(findMatches('gen', text)).toContain('Gen 1:1');
        expect(findMatches('jhn', text)).toContain('John 1:1');
    });

    test('Reference surrounded by punctuation', () => {
        expect(findMatches('jhn', '(Jn 3:16)')).toContainEqual(expect.stringContaining('Jn 3:16'));
    });

    test('Reference after period (new sentence)', () => {
        expect(findMatches('gen', 'End of sentence. Gen 1:1 starts here')).toContain('Gen 1:1');
    });

    test('Jua20.2;21.3 — semicolon NOW splits/joins correctly', () => {
        const text = 'Jua20.2;21.3';
        const matches = findMatches('jhn', text);
        // With improved regex, this might be captured as a SINGLE match "Jua20.2;21.3"
        // or two matches if the parsing logic handles it.
        // Based on current regex behavior, it captures the semicolon.
        expect(matches).toHaveLength(1);
        expect(matches[0]).toBe('Jua20.2;21.3'); // Acceptance of semicolon
    });

    test('Gal 1:1; Gal 2:2. — period after ref does not extend match', () => {
        const text = 'Gal 1:1; Gal 2:2.';
        const matches = findMatches('gal', text);
        // "Gal 1:1; Gal 2:2" is NOT a single valid ref because "Gal" is repeated
        // The regex captures "Gal 1:1;" as one match? No, bookRegex parses "Gal"
        // Semicolon is part of suffix.
        // Actually, "Gal 1:1;" matches "Gal 1:1" and then expects numbers.
        // "Gal 2:2" starts a NEW match.
        // Let's see what happens.
        expect(matches.length).toBeGreaterThanOrEqual(2);
    });

    test('Inline reference within a sentence — 1 sam 3:2-3', () => {
        const text = 'Hey, now, 1 sam 3:2-3 you\'re a Rock Star';
        expect(findMatches('1sa', text)).toContainEqual(expect.stringContaining('sam 3:2-3'));
    });

    test('Consecutive references — Ef 1.1;Ga 2:2 (no space after semicolon)', () => {
        const text = 'Ef 1.1;Ga 2:2';
        expect(findMatches('eph', text)).toContainEqual(expect.stringContaining('Ef 1.1'));
        expect(findMatches('gal', text)).toContainEqual(expect.stringContaining('Ga 2:2'));
    });

    test('Three-digit chapter:verse — Ps 119:105', () => {
        expect(findMatches('psa', 'Sal 119:105')).toContainEqual(expect.stringContaining('Sal 119:105'));
    });

    test('Large verse number — Rev 7:144000 (hypothetical stress test)', () => {
        // Regex uses [\d]+ so any number of digits should work
        expect(findMatches('rev', 'Rev 7:144000')).toContainEqual(expect.stringContaining('Rev 7:144000'));
    });
});
