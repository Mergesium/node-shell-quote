var test = require('tape');
const { quote: uut_quote, quote_ascii: uut_quote_ascii } = require('../');

const UUTs = [ { name: "quote", uut: uut_quote},
	{ name: "quote_ascii", uut: uut_quote_ascii} ];
var UUT = UUTs[0];
var quote = UUT.uut;

// This song-and-dance iteration, together with t.teardown(next_uut) allows the same test
// suite to be called in turn on every UUT in the UUTs table
// The problem is that the description string cannot say which UUT is being tested
// If there is a way to pass an argument to the test battery, please let me know (PR)
// An elegant solution would look like:
// UUTs.forEach((uut, i) => test('quote['+uut.name+'] ops', shell_special_chars, uut));
// instead of relying on t.teardown to iterate
function next_uut() {
	if (UUT === UUTs[UUTs.length - 1]) {
		UUT = UUTs[0];
	} else {
		UUT = UUTs[UUTs.indexOf(UUT) + 1];
	}
	quote = UUT.uut;
}

function shell_special_chars(t) {
	t.teardown(next_uut);

	t.equal(quote(['a', 'b', 'c d']), "a b 'c d'");
	var quoted = quote(['a', 'b', "it's a \"neat thing\""]);
	t.equal(
		quoted,
		'a b \'it\'\\\'\'s a "neat thing"\''
	);
	t.isEqual(quoted.length, 28);
	t.equal(
		quote(['$', '`', '\'']),
		'\'$\' \'`\' \\\''
	);
	t.equal(quote([]), '');
	t.equal(quote(['']), "''");
	t.equal(quote([';']), "';'");
	t.equal(quote(['a;b']), "'a;b'");
	t.equal(quote([')']), "')'");
	t.equal(quote(['a)b']), "'a)b'");
	t.equal(quote(['(']), "'('");
	t.equal(quote(['a(b']), "'a(b'");
	t.equal(quote(['|']), "'|'");
	t.equal(quote(['a|b']), "'a|b'");
	t.equal(quote(['<']), "'<'");
	t.equal(quote(['a<b']), "'a<b'");
	t.equal(quote(['>']), "'>'");
	t.equal(quote(['a>b']), "'a>b'");
	t.equal(quote(["'"]), "\\'");
	t.equal(quote(["a'"]), "a\\'");
	t.equal(quote(["'b"]), "\\'b");
	t.equal(quote(["a'b"]), "a\\'b");
	t.equal(quote(["''"]), "\\'\\'");
	t.equal(quote(['a\nb']), "a\\nb");
	t.equal(quote([' #(){}*|][!']), "' #(){}*|][!'");
	t.equal(quote(["'#(){}*|][!"]), "\\''#(){}*|][!'");
	t.equal(quote(["'#(){}*|][!"]), '\\\'\'#(){}*|][!\'');
	t.equal(quote(['X#(){}*|][!']), "'X#(){}*|][!'");
	t.equal(quote(['a\n#\nb']), "'a'\\n'#'\\n'b'");
	t.equal(quote(['><;{}']), "'><;{}'");
	t.equal(quote(['a', 1, true, false]), 'a 1 true false');
	t.equal(quote(['a', 1, null, undefined]), 'a 1 null undefined');
	t.equal(quote(['a\\x']), "'a\\x'");

	// Tilde expansions
	t.equal(quote(['~']), "'~'");
	t.equal(quote(['VAR=~']), "'VAR=~'");
	t.equal(quote(['SUB:~']), "'SUB:~'");
	t.equal(quote(['~word']), "'~word'");
	t.equal(quote(['cat', '~/.bashrc']), "cat '~/.bashrc'");
	t.equal(quote(['cat', 'VAR=~/.bashrc']), "cat 'VAR=~/.bashrc'");
	t.equal(quote(['cat', 'VAR:~/.bashrc']), "cat 'VAR:~/.bashrc'");
	t.equal(quote(['cat', '~/s p a c e']), "cat '~/s p a c e'");
	t.equal(quote(['cat', 'SUB=~/s p a c e']), "cat 'SUB=~/s p a c e'");
	t.equal(quote(['cat', 'VAR:~/s p a c e']), "cat 'VAR:~/s p a c e'");
	t.equal(quote(['HEAD=~2']), "'HEAD=~2'");
	t.equal(quote(['HEAD:~2']), "'HEAD:~2'");

	// Tilde non-expansions
	t.equal(quote(['HEAD~2']), 'HEAD~2');

	// Bash brace expansions {a,b} or {a..b} must be quoted
	t.equal(quote(['a{1,2}']), "'a{1,2}'");
	t.equal(quote(['a{,2}']), "'a{,2}'");
	t.equal(quote(['a{,,2}']), "'a{,,2}'");
	t.equal(quote(['\'a{,,2}\'']), "\\''a{,,2}'\\'");
	t.equal(quote(['a{1..2}']), "'a{1..2}'");
	t.equal(quote(['a{X..Z}']), "'a{X..Z}'");
	t.equal(quote(['a{{1..2}}']), "'a{{1..2}}'");

	// ... but non brace expansions should not be
	t.equal(quote(['a{1...2}']), 'a{1...2}');
	t.equal(quote(['a{1...2}']), 'a{1...2}');
	t.equal(quote(['a{1..Z}']), 'a{1..Z}');
	t.equal(quote(['a{a1..b1}']), 'a{a1..b1}');
	t.equal(quote(['a{1a..4}']), 'a{1a..4}');
	t.equal(quote(['a{..6}']), 'a{..6}');
	t.equal(quote(['a{{1...2}}']), 'a{{1...2}}');
	t.equal(quote(['a{1.2}']), 'a{1.2}');
	t.equal(quote(['a{{1.2}}']), 'a{{1.2}}');
	t.equal(quote(['a{12}']), 'a{12}');
	quoted = quote(['\\ \\']);
	t.equal(quoted, "'\\ \\'");
	t.isEqual(quoted.length, 5); // 3-char string + 2 quotes
	t.equal(quote(["'$'"]), "\\''$'\\'");
	t.equal(quote(["'"]), "\\'");
	t.equal(quote(['gcc', '-DVAR=value']), 'gcc -DVAR=value');
	t.equal(quote(['gcc', '-DVAR=value with space']), "gcc '-DVAR=value with space'");
	t.equal(quote(["This isn't OK!"]), "'This isn'\\''t OK!'");

	// chars for windows paths don't break out
	t.equal(quote(['`:\\a\\b']), "'`:\\a\\b'");

	t.end();
};
UUTs.forEach((uut, i) => test('quote['+i+'] ops', shell_special_chars));

function unprintable_tests(t) {
	t.teardown(next_uut);

	t.equal(quote(['\x00']), "''");
	t.equal(quote(['\x00']).length, 2); // two quotes
	t.equal(quote(['\x01']), "\\x01");
	t.equal(quote(['\x01']).length, 4); // an \, an x, and two hex digits
	t.equal(quote(['\x00\x01']), "\\x01");
	t.equal(quote(['\x00\x01']).length, 4); // an \, an x, and two hex digits
	t.equal(quote(['\x01\x02\x03\x04\x05\x06\x07\x08\x09']), "\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\b\\t");
	t.equal(quote(['\x01\x02\x03\x04\x05\x06\x07\x08\x09']).length, 32); // 7 * (4 chars per escaped byte) + 2 * 2
	t.equal(quote(['\x01\x02\x03\x04\x05\x06\x07\x08']), "\\x01\\x02\\x03\\x04\\x05\\x06\\x07\\b");
	t.equal(quote(['\x01\x02\x03\x04\x05\x06\x07\x08']).length, 30); // 7 * (4 chars per escaped byte) + 2
	t.equal(quote(['\x0a\x0b\x0c\x0d\x0e\x0f']), "\\n\\v\\f\\r\\x0e\\x0f");
	t.equal(quote(['\x0a\x0b\x0c\x0d\x0e\x0f']).length, 2 * 4 + 4 + 4);
	// no quotes because no input chars are word separators
	t.equal(quote(['\x11\x12\x13\x14\x15\x16\x17\x18\x19']), "\\x11\\x12\\x13\\x14\\x15\\x16\\x17\\x18\\x19");
	t.equal(quote(['\x11\x12\x13\x14\x15\x16\x17\x18\x19']).length, 36); // 8 * (4 chars per escaped byte)
	t.equal(quote(['\x1a\x1b\x1c\x1d\x1e\x1f']), "\\x1a\\E\\x1c\\x1d\\x1e\\x1f");
	t.equal(quote(['\x1a\x1b\x1c\x1d\x1e\x1f']).length, 4 + 2 + 4 + 4 + 4 + 4);

	t.end();
};
UUTs.forEach((uut) => test('quote unprintables', unprintable_tests));

test('quote Unicode', function (t) {
	/* Unicode escaped to ascii */
	t.equal(uut_quote_ascii(['άψογος']), '\\u03ac\\u03c8\\u03bf\\u03b3\\u03bf\\u03c2');
	t.equal(uut_quote_ascii(['άψογος']).length, 36);
	t.equal(uut_quote_ascii(["άψο'γος"]), "\\u03ac\\u03c8\\u03bf\\'\\u03b3\\u03bf\\u03c2");
	t.equal(uut_quote_ascii(["άψο γος"]), "''\\u03ac\\u03c8\\u03bf' '\\u03b3\\u03bf\\u03c2''");
	t.equal(uut_quote_ascii(["άψ&ο γος"]), "''\\u03ac\\u03c8'&'\\u03bf' '\\u03b3\\u03bf\\u03c2''");
	t.equal(uut_quote_ascii(["άψ&ο γος"]), "''\\u03ac\\u03c8'&'\\u03bf' '\\u03b3\\u03bf\\u03c2''");

	/* Unicode preserved */
	t.equal(uut_quote(['άψογος']), 'άψογος');
	t.equal(uut_quote(['άψογος']).length, 6);
	t.equal(uut_quote(["άψο'γος"]), "άψο\\'γος");
	t.equal(uut_quote(["άψο γος"]), "'άψο γος'");
	t.equal(uut_quote(["άψ&ο γος"]), "'άψ&ο γος'");
	t.equal(uut_quote(["άψ&ο γος"]), "'άψ&ο γος'");

	t.end();
});

test('quote sandbox escape attempts', function (t) {
	var user_input = "|-|ello world! | am Bobby⇥les; I have * your files now.";
	var cmd_pipe = ['echo', '-n', user_input, {op: '|'}, 'grep', "-qi", "hello", {op: '||'}, 'echo', "Rude New User"];

	t.equal(uut_quote(cmd_pipe),
		"echo -n '|-|ello world! | am Bobby⇥les; I have * your files now.' | grep -qi hello || echo 'Rude New User'");
	t.equal(uut_quote_ascii(cmd_pipe),
			"echo -n '|-|ello world! | am Bobby'\\u21e5'les; I have * your files now.' | grep -qi hello || echo 'Rude New User'");

	t.end();
});

function op_tests(t) {
	t.teardown(next_uut);

	t.equal(quote(['a', { op: '|' }, 'b']), 'a | b');
	t.equal(
		quote(['a', { op: '&&' }, 'b', { op: ';' }, 'c']),
		'a && b ; c'
	);
    t.equal(
        quote([{ op: 'glob', pattern: '*'} ]),
        '*'
    )
    t.equal(
        quote([ 'a', { op: 'glob', pattern: 'b/*.c' } ]),
        'a b/*.c'
    )
	t.end();
};
UUTs.forEach((uut, i) => test('quote['+i+'] ops', op_tests));

function windows_path_tests(t) {
	var path = 'C:\\projects\\node-shell-quote\\index.js';
	t.teardown(next_uut);

	t.equal(quote([path, 'b', 'c d']), "'C:\\projects\\node-shell-quote\\index.js' b 'c d'");

	t.end();
};
// The windows cmd shell interprets the single quote as a literal, not an escape
// It's not clear how quoting that is both POSIX and Windows compatible would work.
// It would have to not use single quotes.
UUTs.forEach((uut, i) => test('quote['+i+'] windows paths', { skip: 'Windows cmd not supported; this would be a breaking change, disabled until 3.x' }, windows_path_tests));
