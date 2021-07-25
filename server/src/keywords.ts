export default [
  {
    "value": "sha256",
    "desc": "SHA256 hash of value X, yields `[32]byte`",
    "insertText": "sha256",
    "kind": 24
  },
  {
    "value": "keccak256",
    "desc": "Keccak256 hash of value X, yields `[32]byte`",
    "insertText": "keccak256",
    "kind": 24
  },
  {
    "value": "sha512_256",
    "desc": "SHA512_256 hash of value X, yields `[32]byte`",
    "insertText": "sha512_256",
    "kind": 24
  },
  {
    "value": "ed25519verify",
    "desc": "for (data A, signature B, pubkey C) verify the signature of (\"ProgData\" || program_hash || data) against the pubkey => {0 or 1}",
    "insertText": "ed25519verify",
    "kind": 24
  },
  {
    "value": "len",
    "desc": "Yields length of byte value X",
    "insertText": "len",
    "kind": 24
  },
  {
    "value": "itob",
    "desc": "converts `uint64` X to big endian bytes",
    "insertText": "itob",
    "kind": 24
  },
  {
    "value": "btoi",
    "desc": "converts bytes X as big endian to `uint64`",
    "insertText": "btoi",
    "kind": 24
  },
  {
    "value": "mulw",
    "desc": "A times B out to 128-bit long result as low (top) and high uint64 values on the stack",
    "insertText": "mulw",
    "kind": 24
  },
  {
    "value": "addw",
    "desc": "A plus B out to 128-bit long result as low (top) and high uint64 values on the stack",
    "insertText": "addw",
    "kind": 24
  },
  {
    "value": "divmodw",
    "desc": "Available to divide the two-element values produced by mulw and addw",
    "insertText": "divmodw",
    "kind": 24
  },
  {
    "value": "getbit",
    "desc": "pop a target A (integer or byte-array), and index B. Push the Bth bit of A",
    "insertText": "getbit",
    "kind": 24
  },
  {
    "value": "setbit",
    "desc": "pop a target A, index B, and bit C. Set the Bth bit of A to C, and push the result",
    "insertText": "setbit",
    "kind": 24
  },
  {
    "value": "getbyte",
    "desc": "pop a byte-array A and integer B. Extract the Bth byte of A and push it as an integer",
    "insertText": "getbyte",
    "kind": 24
  },
  {
    "value": "setbyte",
    "desc": "pop a byte-array A, integer B, and small integer C (between 0..255). Set the Bth byte of A to C, and push the result",
    "insertText": "setbyte",
    "kind": 24
  },
  {
    "value": "concat",
    "desc": "pop two byte-arrays A and B and join them, push the result",
    "insertText": "concat",
    "kind": 24
  },
  {
    "value": "substring",
    "desc": "pop a byte-array A. For immediate values in 0..255 S and E: extract a range of bytes from A starting at S up to but not including E, push the substring result. If E < S, or either is larger than the array length, the program fails",
    "insertText": "substring",
    "kind": 24
  },
  {
    "value": "substring3",
    "desc": "pop a byte-array A and two integers B and C. Extract a range of bytes from A starting at B up to but not including C, push the substring result. If C < B, or either is larger than the array length, the program fails",
    "insertText": "substring3",
    "kind": 24
  },
  {
    "value": "bitlen",
    "desc": "The highest set bit in X. If X is a byte-array, it is interpreted as a big-endian unsigned integer. bitlen of 0 is 0, bitlen of 8 is 4",
    "insertText": "bitlen",
    "kind": 24
  },
  {
    "value": "bzero",
    "desc": "push a byte-array of length X, containing all zero bytes",
    "insertText": "bzero",
    "kind": 24
  },
  {
    "value": "shl",
    "desc": "A times 2^B, modulo 2^64",
    "insertText": "shl",
    "kind": 24
  },
  {
    "value": "shr",
    "desc": "A divided by 2^B",
    "insertText": "shr",
    "kind": 24
  },
  {
    "value": "sqrt",
    "desc": "The largest integer B such that B^2 <= X",
    "insertText": "sqrt",
    "kind": 24
  },
  {
    "value": "exp",
    "desc": "A raised to the Bth power. Panic if A == B == 0 and on overflow",
    "insertText": "exp",
    "kind": 24
  },
  {
    "value": "expw",
    "desc": "A raised to the Bth power as a 128-bit long result as low (top) and high uint64 values on the stack. Panic if A == B == 0 or if the results exceeds 2^128-1",
    "insertText": "expw",
    "kind": 24
  },
  {
    "value": "int",
    "desc": "record the constant number to a `intcblock` at the beginning of code and insert an `intc` reference where the instruction appears to load that value",
    "insertText": "int ",
    "kind": 25
  },
  {
    "value": "byte",
    "desc": "record the constant number to a `bytecblock` at the beginning of code and insert an `bytec` reference where the instruction appears to load that value",
    "insertText": "byte ",
    "kind": 25
  },
  {
    "value": "addr",
    "desc": "parses an Algorand account address base32 and converts it to a regular bytes constant",
    "insertText": "addr ",
    "kind": 25
  },
  {
    "value": "base32",
    "desc": "parses a base32 constant string",
    "insertText": "base32 ",
    "kind": 25
  },
  {
    "value": "bs32",
    "desc": "parses a base32 constant string",
    "insertText": "bs32 ",
    "kind": 25
  },
  {
    "value": "base64",
    "desc": "parses a base64 constant string",
    "insertText": "base64 ",
    "kind": 25
  },
  {
    "value": "bs64",
    "desc": "parses a base64 constant string",
    "insertText": "bs64 ",
    "kind": 25
  },
  {
    "value": "intcblock",
    "desc": "load block of `uint64` constants",
    "insertText": "intcblock "
  },
  {
    "value": "intc",
    "desc": "push value from uint64 constants to stack by index into constants",
    "insertText": "intc "
  },
  {
    "value": "intc_0",
    "desc": "push constant 0 from intcblock to stack",
    "insertText": "intc_0"
  },
  {
    "value": "intc_1",
    "desc": "push constant 1 from intcblock to stack",
    "insertText": "intc_1"
  },
  {
    "value": "intc_2",
    "desc": "push constant 2 from intcblock to stack",
    "insertText": "intc_2"
  },
  {
    "value": "intc_3",
    "desc": "push constant 3 from intcblock to stack",
    "insertText": "intc_3"
  },
  {
    "value": "bytec",
    "desc": "push bytes constant to stack by index into constants",
    "insertText": "bytec "
  },
  {
    "value": "bytec_0",
    "desc": "push constant 0 from bytecblock to stack",
    "insertText": "bytec_0"
  },
  {
    "value": "bytec_1",
    "desc": "push constant 1 from bytecblock to stack",
    "insertText": "bytec_1"
  },
  {
    "value": "bytec_2",
    "desc": "push constant 2 from bytecblock to stack",
    "insertText": "bytec_2"
  },
  {
    "value": "bytec_3",
    "desc": "push constant 3 from bytecblock to stack",
    "insertText": "bytec_3"
  },
  {
    "value": "pushbytes",
    "desc": "push the following program bytes to the stack",
    "insertText": "pushbytes"
  },
  {
    "value": "arg",
    "desc": "push Args[N] value to stack by index",
    "insertText": "arg "
  },
  {
    "value": "arg_0",
    "desc": "push Args[0] to stack",
    "insertText": "arg_0"
  },
  {
    "value": "arg_1",
    "desc": "push Args[1] to stack",
    "insertText": "arg_1"
  },
  {
    "value": "arg_2",
    "desc": "push Args[2] to stack",
    "insertText": "arg_2"
  },
  {
    "value": "arg_3",
    "desc": "push Args[3] to stack",
    "insertText": "arg_3"
  },
  {
    "value": "txn",
    "desc": "push field from current transaction to stack",
    "insertText": "txn "
	},
	{
    "value": "txna",
    "desc": "push value of an array field from current transaction to stack",
    "insertText": "txna "
  },
  {
    "value": "gtxn",
    "desc": "push field to the stack from a transaction in the current transaction group",
    "insertText": "gtxn "
	},
	
	{
    "value": "gtxna",
    "desc": "push value of a field to the stack from a transaction in the current transaction group",
    "insertText": "gtxna "
  },
  {
    "value": "gtxnsa",
    "desc": "push Ith value of the array field F from the Xth transaction in the current group",
    "insertText": "gtxnsa "
  },
  {
    "value": "global",
    "desc": "push value from globals to stack",
    "insertText": "global "
  },
  {
    "value": "load",
    "desc": "copy a value from scratch space to the stack",
    "insertText": "load "
  },
  {
    "value": "store",
    "desc": "pop a value from the stack and store to scratch space",
    "insertText": "store "
  },
  {
    "value": "gload",
    "desc": "push Ith scratch space index of the Tth transaction in the current group",
    "insertText": "gload "
  },
  {
    "value": "gloads",
    "desc": "push Ith scratch space index of the Xth transaction in the current group",
    "insertText": "gloads "
  },
  {
    "value": "balance",
    "desc": "get balance for account A, in microalgos. The balance is observed after the effects of previous transactions in the group, and after the fee for the current transaction is deducted.",
    "insertText": "balance "
  },
  {
    "value": "app_opted_in",
    "desc": "check if account A opted in for the application B => {0 or 1}",
    "insertText": "app_opted_in "
  },
  {
    "value": "app_local_get",
    "desc": "read from account A from local state of the current application key B => value",
    "insertText": "app_local_get "
  },
  {
    "value": "app_local_get_ex",
    "desc": "read from account A from local state of the application B key C => [... stack, value, 0 or 1]",
    "insertText": "app_local_get_ex "
  },
  {
    "value": "app_global_get",
    "desc": "read key A from global state of a current application => value",
    "insertText": "app_global_get "
  },
  {
    "value": "app_global_get_ex",
    "desc": "read from application A global state key B => [... stack, value, 0 or 1]",
    "insertText": "app_global_get_ex "
  },
  {
    "value": "app_local_put",
    "desc": "write to account specified by A to local state of a current application key B with value C",
    "insertText": "app_local_put "
  },
  {
    "value": "app_global_put",
    "desc": "write key A and value B to global state of the current application",
    "insertText": "app_global_put "
  },
  {
    "value": "app_local_del",
    "desc": "delete from account A local state key B of the current application",
    "insertText": "app_local_del "
  },
  {
    "value": "app_global_del",
    "desc": "delete key A from a global state of the current application",
    "insertText": "app_global_del "
  },
  {
    "value": "asset_holding_get",
    "desc": "read from account A and asset B holding field X (imm arg) => {0 or 1 (top), value}",
    "insertText": "asset_holding_get "
  },
  {
    "value": "asset_params_get",
    "desc": "read from asset A params field X (imm arg) => {0 or 1 (top), value}",
    "insertText": "asset_params_get "
  },
  {
    "value": "err",
    "desc": "Error. Panic immediately. This is primarily a fencepost against accidental zero bytes getting compiled into programs.",
    "insertText": "err",
    "kind": 18
  },
  {
    "value": "bnz",
    "desc": "goes to specifid branch if the top stack value is not zero",
    "insertText": "bnz ",
    "kind": 18
  },
  {
    "value": "bz",
    "desc": "goes to specifid branch if the top stack value is zero",
    "insertText": "bz ",
    "kind": 18
  },
  {
    "value": "b",
    "desc": "goes to specifid branch immidiately",
    "insertText": "b ",
    "kind": 18
  },
  {
    "value": "return",
    "desc": "use last value on stack as success value and ends",
    "insertText": "return",
    "kind": 18
  },
  {
    "value": "pop",
    "desc": "discard value X from stack",
    "insertText": "pop"
  },
  {
    "value": "dup",
    "desc": "duplicate last value on stack",
    "insertText": "dup"
  },
  {
    "value": "dup2",
    "desc": "duplicate two last values on stack: A, B -> A, B, A, B",
    "insertText": "dup2"
  },
  {
    "value": "dig",
    "desc": "push the Nth value from the top of the stack. dig 0 is equivalent to dup",
    "insertText": "dig"
  },
  {
    "value": "swap",
    "desc": "swaps two last values on stack: A, B -> B, A",
    "insertText": "swap"
  },
  {
    "value": "select",
    "desc": "selects one of two values based on top-of-stack: A, B, C -> (if C != 0 then B else A)",
    "insertText": "select"
  },
  {
    "value": "assert",
    "desc": "immediately fail unless value X is a non-zero number",
    "insertText": "assert"
  },
  {
    "value": "callsub",
    "desc": "branch unconditionally to TARGET, saving the next instruction on the call stack",
    "insertText": "callsub"
  },
  {
    "value": "retsub",
    "desc": "pop the top instruction from the call stack and branch to it",
    "insertText": "retsub"
  },
  {
    "value": "gaid",
    "desc": "push the ID of the asset or application created in the Tth transaction of the current group",
    "insertText": "gaid"
  },
  {
    "value": "gaids",
    "desc": "push the ID of the asset or application created in the Xth transaction of the current group",
    "insertText": "gaids"
  },
]