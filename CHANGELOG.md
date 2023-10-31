# acorn-node change log

All notable changes to this project will be documented in this file.
Starting at release 2.0.0, the project will be strictly Semantically Versioned.

## 2.0.0 2023-10-31
* This is a compatibility breaking change due to behaviour change of quote()
* `quote` fixes picked up from all forks in the network (if I missed any, submit issue)
  * backslashes no longer doubled (@drok/Radu Hociung)
  * Fix - bash Brace Expansion is correctly quoted (@drok, @iFixit/Daniel Beardsley)
  * Major change - glob ops correctly passed through (@emosbaugh/Ethan Mosbaugh)
  * Fix - quoting exclamation marks near single-quotes (@raxod502/Radon Rosborough)
  * Fix - correctly quote empty string (@cspotcode/Andrew Bradley)
  * Major change - Double quotes are no longer used as escape, only single quotes. The output should contain
    the minumum necessary quoting, and be eyeball-friendly, as well as shell-grammar compliant. (@drok)
  * Major change - control characters are escaped as \E, \t, or \x.., no longer passed through literally (@drok)
* New - `quote_ascii`: works like quote but also escapes Unicode characters as \uHHHH (@drok)

## 1.8.1 2023-10-29
- @Mergesium started a new fork focused on quality. Package will be scoped @mergesium/shell-quote.
  The 1.8.1 initial release by Mergesium is API and behaviour identical to shell-quote 1.8.1

## [v1.8.1](https://github.com/ljharb/shell-quote/compare/v1.8.0...v1.8.1) - 2023-04-07
- [Fix] `parse`: preserve whitespace in comments [`#6`](https://github.com/ljharb/shell-quote/issues/6)
- [Fix] properly support the `escape` option [`#5`](https://github.com/ljharb/shell-quote/issues/5)

## [v1.8.0](https://github.com/ljharb/shell-quote/compare/v1.7.4...v1.8.0) - 2023-01-30
- [New] extract `parse` and `quote` to their own deep imports [`553fdfc`](https://github.com/ljharb/shell-quote/commit/553fdfc32cc41b4c2f77e061b6957703958ca575)
- [New] Add support for here strings (`<<<`) [`9802fb3`](https://github.com/ljharb/shell-quote/commit/9802fb37c7946e18c672b81122520dc296bde271)
- [New] `parse`: Add syntax support for duplicating input file descriptors [`216b198`](https://github.com/ljharb/shell-quote/commit/216b19894f76b14d164c4c5a68f05a51b06336c4)

## [v1.7.4](https://github.com/ljharb/shell-quote/compare/1.7.3...v1.7.4) - 2022-10-12
* @ljharb took over maintenance of project and `shell-quote` NPM package. Minor housekeeping and cosmetic project tweaks.

## 1.7.3
* Fix a security issue where the regex for windows drive letters allowed some shell meta-characters
to escape the quoting rules. (CVE-2021-42740)

## 1.7.2
* Fix a regression introduced in 1.6.3. This reverts the Windows path quoting fix. ([144e1c2](https://github.com/ljharb/shell-quote/commit/144e1c20cd57549a414c827fb3032e60b7b8721c))

## 1.7.1
* Fix `$` being removed when not part of an environment variable name. ([@Adman](https://github.com/Admin) in [#32](https://github.com/ljharb/shell-quote/pull/32))

## 1.7.0
* Add support for parsing `>>` and `>&` redirection operators. ([@forivall](https://github.com/forivall) in [#16](https://github.com/ljharb/shell-quote/pull/16))
* Add support for parsing `<(` process substitution operator. ([@cuonglm](https://github.com/cuonglm) in [#15](https://github.com/ljharb/shell-quote/pull/15))

## 1.6.3
* Fix Windows path quoting problems. ([@dy](https://github.com/dy) in [#34](https://github.com/ljharb/shell-quote/pull/34))

## 1.6.2
* Remove dependencies in favour of native methods. ([@zertosh](https://github.com/zertosh) in [#21](https://github.com/ljharb/shell-quote/pull/21))
