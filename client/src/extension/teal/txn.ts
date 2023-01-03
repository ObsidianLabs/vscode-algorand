export default [
	{
		"name": "Sender",
		"type": "[]byte",
		"notes": "32 byte address"
	},
	{
		"name": "Fee",
		"type": "uint64",
		"notes": "micro-Algos"
	},
	{
		"name": "FirstValid",
		"type": "uint64",
		"notes": "round number"
	},
	{
		"name": "FirstValidTime",
		"type": "uint64",
		"notes": "Causes program to fail; reserved for future use"
	},
	{
		"name": "LastValid",
		"type": "uint64",
		"notes": "round number"
	},
	{
		"name": "Note",
		"type": "[]byte",
		"notes": ""
	},
	{
		"name": "Lease",
		"type": "[]byte",
		"notes": ""
	},
	{
		"name": "Receiver",
		"type": "	[]byte",
		"notes": "32 byte address"
	},
	{
		"name": "Amount",
		"type": "uint64",
		"notes": "micro-Algos"
	},
	{
		"name": "CloseRemainderTo",
		"type": "[]byte",
		"notes": "32 byte address"
	},
	{
		"name": "VotePK",
		"type": "[]byte",
		"notes": "32 byte address"
	},
	{
		"name": "VoteFirst",
		"type": "uint64",
		"notes": ""
	},
	{
		"name": "VoteLast",
		"type": "uint64",
		"notes": ""
	},
	{
		"name": "VoteKeyDilution",
		"type": "uint64",
		"notes": ""
	},
	{
		"name": "Type",
		"type": "[]byte",
		"notes": ""
	},
	{
		"name": "TypeEnum",
		"type": "uint64",
		"notes": "Transaction type enum constant\n\n0: Unknown type. Invalid transaction\n\n1: Payment\n\n2: KeyRegistration\n\n3: AssetConfig\n\n4: AssetTransfer\n\n5: AssetFreeze\n\n6: ApplicationCall"
	},
	{
		"name": "XferAsset",
		"type": "uint64",
		"notes": "Asset ID"
	},
	{
		"name": "AssetAmount",
		"type": "uint64",
		"notes": "value in Asset's units"
	},
	{
		"name": "AssetSender",
		"type": "[]byte",
		"notes": "32 byte address. Causes clawback of all value of asset from AssetSender if Sender is the Clawback address of the asset."
	},
	{
		"name": "AssetReceiver",
		"type": "[]byte",
		"notes": "32 byte address"
	},
	{
		"name": "AssetCloseTo",
		"type": "[]byte",
		"notes": "32 byte address"
	},
	{
		"name": "GroupIndex",
		"type": "uint64",
		"notes": "Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1"
	},
	{
		"name": "TxID",
		"type": "[]byte",
		"notes": "The computed ID for this transaction. 32 bytes."
	},
	{
		"name": "ApplicationID",
		"type": "uint64",
		"notes": "ApplicationID from ApplicationCall transaction. LogicSigVersion >= 2."
	},
	{
		"name": "OnCompletion",
		"type": "uint64",
		"notes": "ApplicationCall transaction on completion action. LogicSigVersion >= 2."
	},
	{
		"name": "ApplicationArgs",
		"type": "[]byte",
		"notes": "Arguments passed to the application in the ApplicationCall transaction. LogicSigVersion >= 2."
	},
	{
		"name": "NumAppArgs",
		"type": "uint64",
		"notes": "Number of ApplicationArgs. LogicSigVersion >= 2."
	},
	{
		"name": "Accounts",
		"type": "[]byte",
		"notes": "Accounts listed in the ApplicationCall transaction. LogicSigVersion >= 2."
	},
	{
		"name": "NumAccounts",
		"type": "uint64",
		"notes": "Number of Accounts. LogicSigVersion >= 2."
	},
	{
		"name": "ApprovalProgram",
		"type": "[]byte",
		"notes": "Approval program. LogicSigVersion >= 2."
	},
	{
		"name": "ClearStateProgram",
		"type": "[]byte",
		"notes": "Clear state program. LogicSigVersion >= 2."
	},
	{
		"name": "RekeyTo",
		"type": "[]byte",
		"notes": "32 byte Sender's new AuthAddr. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAsset",
		"type": "uint64",
		"notes": "Asset ID in asset config transaction. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetTotal",
		"type": "uint64",
		"notes": "Total number of units of this asset created. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetDecimals",
		"type": "uint64",
		"notes": "Number of digits to display after the decimal place when displaying the asset. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetDefaultFrozen",
		"type": "uint64",
		"notes": "Whether the asset's slots are frozen by default or not, 0 or 1. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetUnitName",
		"type": "[]byte",
		"notes": "Unit name of the asset. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetName",
		"type": "[]byte",
		"notes": "The asset name. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetURL",
		"type": "[]byte",
		"notes": "URL. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetMetadataHash",
		"type": "[]byte",
		"notes": "32 byte commitment to some unspecified asset metadata. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetManager",
		"type": "[]byte",
		"notes": "32 byte address. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetReserve",
		"type": "[]byte",
		"notes": "32 byte address. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetFreeze",
		"type": "[]byte",
		"notes": "32 byte address. LogicSigVersion >= 2."
	},
	{
		"name": "ConfigAssetClawback",
		"type": "[]byte",
		"notes": "32 byte address. LogicSigVersion >= 2."
	},
	{
		"name": "FreezeAsset",
		"type": "uint64",
		"notes": "Asset ID being frozen or un-frozen. LogicSigVersion >= 2."
	},
	{
		"name": "FreezeAssetAccount",
		"type": "[]byte",
		"notes": "32 byte address of the account whose asset slot is being frozen or un-frozen. LogicSigVersion >= 2."
	},
	{
		"name": "FreezeAssetFrozen",
		"type": "uint64",
		"notes": "The new frozen value, 0 or 1. LogicSigVersion >= 2."
	},
	{
		"name": "NumAssets",
		"type": "uint64",
		"notes": "Number of Assets"
	},
	{
		"name": "NumApplications",
		"type": "uint64",
		"notes": "Number of Applications"
	},
	{
		"name": "GlobalNumUint",
		"type": "uint64",
		"notes": "Number of global state integers in ApplicationCall",
	},
	{
		"name": "GlobalNumByteSlice",
		"type": "uint64",
		"notes": "Number of global state byteslices in ApplicationCall",
	},
	{
		"name": "LocalNumUint",
		"type": "uint64",
		"notes": "Number of local state integers in ApplicationCall",
	},
	{
		"name": "LocalNumByteSlice",
		"type": "uint64",
		"notes": "Number of local state byteslices in ApplicationCall"
	},
	{
		"name": "ExtraProgramPages",
		"type": "uint64",
		"notes": "Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program."
	},
	{
		"name": "Nonparticipation",
		"type": "uint64",
		"notes": "Marks an account nonparticipating for rewards"
	},
	{
		"name": "NumLogs",
		"type": "uint64",
		"notes": "umber of Logs (only with itxn in v5). Application mode only"
	},
	{
		"name": "CreatedAssetID",
		"type": "uint64",
		"notes": "Asset ID allocated by the creation of an ASA (only with itxn in v5). Application mode only"
	},
	{
		"name": "CreatedApplicationID",
		"type": "uint64",
		"notes": "ApplicationID allocated by the creation of an application (only with itxn in v5). Application mode only"
	},
	{
		"name": "LastLog",
		"type": "[]byte",
		"notes": "The last message emitted. Empty bytes if none were emitted. Application mode only"
	},
	{
		"name": "StateProofPK",
		"type": "[]byte",
		"notes": "64 byte state proof public key"
	},
	{
		"name": "NumApprovalProgramPages",
		"type": "uint64",
		"notes": "Number of Approval Program pages"
	},
	{
		"name": "NumClearStateProgramPages",
		"type": "uint64",
		"notes": "Number of ClearState Program pages"
	}
]