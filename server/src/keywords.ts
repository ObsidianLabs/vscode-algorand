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
    "value": "bnz",
    "desc": "push constant 3 from intcblock to stack",
    "insertText": "bnz ",
    "kind": 18
  },
  {
    "value": "err",
    "desc": "Error. Panic immediately. This is primarily a fencepost against accidental zero bytes getting compiled into programs.",
    "insertText": "err",
    "kind": 18
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
  }
]