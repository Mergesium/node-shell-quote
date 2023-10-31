# @mergesium/shell-quote <sup>[![Version Badge][npm-version-svg]][package-url]</sup>

[![github actions][actions-image]][actions-url]
[![coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

[![npm badge][npm-badge-png]][package-url]

Parse and quote shell commands.

# Example usage

## quote
The `quote` function is used to convert an array of N arbitrary strings into a correctly escaped / quoted string that a Posix shell would parse as the same N individual words. Unicode characters are preserved for readability, but not all terminal emulators are able to take Unicode text cut and pasted. To escape the Unicode to \uXXXX sequences, use the `quote_ascii` variant.

The output of `quote` is [POSIX shell compliant](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap02.html), and should also be compatible with flavours like bash, ksh, etc. However, Windows CMD is not supported because it interprets the single quote as a literal rather than a quoting character. Commands which are intended to run on windows will have the incorrect quoting, and likely need manual adjustment to make them correct.
### Example (open in [Codepen](https://codepen.io/drok-the-scripter/pen/WNPxjaE?editors=0011)):
``` js
var { quote } = require('@mergesium/shell-quote/quote');

var user_input = "|-|ello world! | am Bobby⇥les; I have * your files now.";
var cmd_pipe = [
    'echo', '-n', user_input,
        {op: '|'},
    'grep', "-qi", "hello",
        {op: '||'},
    'echo', "Rude New User"];

console.log(quote(cmd_pipe));
// No, Bobby, you don't have *
```

### Output:

```
echo -n '|-|ello world! | am Bobby⇥les; I have * your files now.' | grep -qi hello || echo 'Rude New User'
```
Ie. if pasted into a terminal window, the shell would `echo` the user input to the stdin of `grep` and output 'Rude New User' if the word 'hello' is not found:

All characters which have a special meaning to the shell (eg, <, >, `, $, #, etc) are quoted appropriately, so the output string can be cut-and-pasted into a terminal window.

The example above, demostrates how our old friend [Bobby Tables](https://xkcd.com/327/) provided some input which is quoted/sanitized as to thwart Bobby's intended exploit.
## quote_ascii
Same as quote, except it also escapes all Unicode characters to \uXXXX sequences.In the example, the `⇥` is the only Unicode character, and it is escaped too.

### Example:
``` js
const { quote_ascii } = require('@mergesium/shell-quote/quote');

var user_input = "|-|ello world! | am Bobby⇥les; I have * your files now.";
var cmd_pipe = [
    'echo', '-n', user_input,
        {op: '|'},
    'grep', "-qi", "hello",
        {op: '||'},
    'echo', "Rude New User"];

console.log(quote_ascii(cmd_pipe));
// No, Bobby, you don't have *
```

### Output:

```
echo -n '|-|ello world! | am Bobby'\\u21e5'les; I have * your files now.' | grep -qi hello || echo 'Rude New User'
```
## parse

``` js
var parse = require('@mergesium/shell-quote/parse');
var xs = parse('a "b c" \\$def \'it\\\'s great\'');
console.dir(xs);
```

output

```
[ 'a', 'b c', '\\$def', 'it\'s great' ]
```

## parse with an environment variable

``` js
var parse = require('@mergesium/shell-quote/parse');
var xs = parse('beep --boop="$PWD"', { PWD: '/home/robot' });
console.dir(xs);
```

output

```
[ 'beep', '--boop=/home/robot' ]
```

## parse with custom escape character

``` js
var parse = require('@mergesium/shell-quote/parse');
var xs = parse('beep ^--boop="$PWD"', { PWD: '/home/robot' }, { escape: '^' });
console.dir(xs);
```

output

```
[ 'beep --boop=/home/robot' ]
```

## parsing shell operators

``` js
var parse = require('@mergesium/shell-quote/parse');
var xs = parse('beep || boop > /byte');
console.dir(xs);
```

output:

```
[ 'beep', { op: '||' }, 'boop', { op: '>' }, '/byte' ]
```

## parsing shell comment

``` js
var parse = require('@mergesium/shell-quote/parse');
var xs = parse('beep > boop # > kaboom');
console.dir(xs);
```

output:

```
[ 'beep', { op: '>' }, 'boop', { comment: '> kaboom' } ]
```

# methods

``` js
var quote = require('@mergesium/shell-quote/quote');
var parse = require('@mergesium/shell-quote/parse');
```

## quote(args)

Return a quoted string for the array `args` suitable for using in shell
commands.

## parse(cmd, env={})

Return an array of arguments from the quoted string `cmd`.

Interpolate embedded bash-style `$VARNAME` and `${VARNAME}` variables with
the `env` object which like bash will replace undefined variables with `""`.

`env` is usually an object but it can also be a function to perform lookups.
When `env(key)` returns a string, its result will be output just like `env[key]`
would. When `env(key)` returns an object, it will be inserted into the result
array like the operator objects.

When a bash operator is encountered, the element in the array with be an object
with an `"op"` key set to the operator string. For example:

```
'beep || boop > /byte'
```

parses as:

```
[ 'beep', { op: '||' }, 'boop', { op: '>' }, '/byte' ]
```

# install

With [npm](http://npmjs.org) do:

```
npm install @mergesium/shell-quote
```

# license

MIT

[package-url]: https://npmjs.org/package/@Mergesium/shell-quote
[npm-version-svg]: https://versionbadg.es/Mergesium/@mergesium/shell-quote.svg
[deps-svg]: https://david-dm.org/Mergesium/node-shell-quote.svg
[deps-url]: https://david-dm.org/Mergesium/node-shell-quote
[dev-deps-svg]: https://david-dm.org/Mergesium/node-shell-quote/dev-status.svg
[dev-deps-url]: https://david-dm.org/Mergesium/node-shell-quote#info=devDependencies
[npm-badge-png]: https://nodei.co/npm/@mergesium/shell-quote.png?downloads=true&stars=true
[license-image]: https://img.shields.io/npm/l/@mergesium/shell-quote.svg
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/@mergesium/shell-quote.svg
[downloads-url]: https://npm-stat.com/charts.html?package=@mergesium/shell-quote
[codecov-image]: https://codecov.io/gh/Mergesium/node-shell-quote/branch/main/graphs/badge.svg
[codecov-url]: https://app.codecov.io/gh/Mergesium/node-shell-quote/
[actions-image]: https://img.shields.io/endpoint?url=https://github-actions-badge-u3jn4tfpocch.runkit.sh/Mergesium/node-shell-quote
[actions-url]: https://github.com/Mergesium/node-shell-quote/actions
