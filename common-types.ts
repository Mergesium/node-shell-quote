export type ControlOperator = "||" | "&&" | ";;" | "|&" | "<(" | ">>" | ">&" | "&" | ";" | "(" | ")" | "|" | "<" | ">";

export type ParseEntry =
    | string
    | { op: ControlOperator }
    | { op: "glob"; pattern: string }
    | { comment: string };
