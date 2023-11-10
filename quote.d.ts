//export type ControlOperator = "||" | "&&" | ";;" | "|&" | "<(" | ">>" | ">&" | "&" | ";" | "(" | ")" | "|" | "<" | ">";
//
//export type ParseEntry =
//    | string
//    | { op: ControlOperator }
//    | { op: "glob"; pattern: string }
//    | { comment: string };

import { ParseEntry }  from "./common-types";

/**
 * Return a quoted string for the array `args` suitable for using in shell commands.
 * Unicode characters are NOT escaped. Use `quote_ascii` for that.
 */
export function quote(args: ReadonlyArray<ParseEntry>): string;

/**
 * Return a quoted string for the array `args` suitable for using in shell commands.
 * Unicode characters are escaped using the \uXXXX shell escape.
 */
export function quote_ascii(args: ReadonlyArray<ParseEntry>): string;
