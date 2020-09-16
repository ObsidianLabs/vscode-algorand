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
	}
]