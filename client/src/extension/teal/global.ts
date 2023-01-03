export default [
	{
		"name": "MinTxnFee",
		"type": "uint64",
		"notes": "micro Algos"
	},
	{
		"name": "MinBalance",
		"type": "uint64",
		"notes": "micro Algos"
	},
	{
		"name": "MaxTxnLife",
		"type": "uint64",
		"notes": "rounds"
	},
	{
		"name": "ZeroAddress",
		"type": "[]byte",
		"notes": "32 byte address of all zero bytes"
	},
	{
		"name": "GroupSize",
		"type": "uint64",
		"notes": "Number of transactions in this atomic transaction group. At least 1"
	},
	{
		"name": "LogicSigVersion",
		"type": "uint64",
		"notes": "Maximum supported TEAL version. LogicSigVersion >= 2."
	},
	{
		"name": "Round",
		"type": "uint64",
		"notes": "Current round number. LogicSigVersion >= 2."
	},
	{
		"name": "LatestTimestamp",
		"type": "uint64",
		"notes": "Last confirmed block UNIX timestamp. Fails if negative. LogicSigVersion >= 2."
	},
	{
		"name": "CurrentApplicationID",
		"type": "uint64",
		"notes": "ID of current application executing. Fails if no such application is executing. LogicSigVersion >= 2."
	},
	{
		"name": "CreatorAddress",
		"type": "[]byte",
		"notes": "Address of the creator of the current application. Application mode only."
	},
	{
		"name": "CurrentApplicationAddress",
		"type": "[]byte",
		"notes": "Address that the current application controls. Application mode only."
	},
	{
		"name": "GroupID",
		"type": "[]byte",
		"notes": "ID of the transaction group. 32 zero bytes if the transaction is not part of a group."
	},
	{
		"name": "OpcodeBudget",
		"type": "uint64",
		"notes": "The remaining cost that can be spent by opcodes in this program."
	},
	{
		"name": "CallerApplicationID",
		"type": "uint64",
		"notes": "The application ID of the application that called this application. 0 if this application is at the top-level. Application mode only."
	},
	{
		"name": "CallerApplicationAddress",
		"type": "[]byte",
		"notes": "The application address of the application that called this application. ZeroAddress if this application is at the top-level. Application mode only."
	}
]