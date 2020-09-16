import * as path from 'path'
import * as vscode from 'vscode'

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient'

import { BuildAscTaskProvider } from './BuildAscTaskProvider'
import { AlgorandNodeTaskProvider } from './AlgorandNodeTaskProvider'
import AlgorandPanel from './panel/AlgorandPanel'

import keywords from './teal/keywords'
import txn from './teal/txn'
import global from './teal/global'

let client: LanguageClient
let buildAscTaskProvider: vscode.Disposable | undefined
let algorandNodeTaskProvider: vscode.Disposable | undefined

export function activate(context: vscode.ExtensionContext) {
	activeTasks()

	const algorandPanelCommand = activateAlgorandPanel(context)

	const tealCompletion = vscode.languages.registerCompletionItemProvider(
		'teal',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character)

				const tokens = linePrefix.split(' ')
				if (linePrefix === 'txn ') {
					return (txn as any).map(item => {
						const completionItem = new vscode.CompletionItem(item.name, vscode.CompletionItemKind.Method)
						completionItem.detail = item.notes.replace(/\n\n/g, '\n')
						return completionItem
					})
				} else if (tokens.length === 3 && tokens[0] === 'gtxn' && Number(tokens[1]).toString() === tokens[1]) {
					return (txn as any).map(item => {
						const completionItem = new vscode.CompletionItem(item.name, vscode.CompletionItemKind.Method)
						completionItem.detail = item.notes
						return completionItem
					})
				} else if (linePrefix === 'global ') {
					return (global as any).map(item => {
						const completionItem = new vscode.CompletionItem(item.name, vscode.CompletionItemKind.Method)
						completionItem.detail = item.notes
						return completionItem
					})
				}

				return undefined
			}
		},
		' '
	)

	const tealHover = vscode.languages.registerHoverProvider('teal', {
		provideHover(document: vscode.TextDocument, position: vscode.Position, token) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			const keywordMatch = keywords.find(item => item.value === word)
			if (keywordMatch) {
				return new vscode.Hover(keywordMatch.desc)
			}
			let match = txn.find(item => item.name === word)
			if (match) {
				return new vscode.Hover(match.notes)
			}
			match = global.find(item => item.name === word)
			if (match) {
				return new vscode.Hover(match.notes)
			}
		}
	})

	context.subscriptions.push(algorandPanelCommand, tealCompletion)

	const myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100)
	myStatusBarItem.command = 'algorand.panel.show'
	myStatusBarItem.text = `$(server-process) Algorand Panel`
	myStatusBarItem.show()

	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	)
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] }

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	}

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'teal' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
		}
	}

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	)

	// Start the client. This will also launch the server
	client.start()
}

function activeTasks(): void {
	const workspaceRoot = vscode.workspace.rootPath
	if (!workspaceRoot) {
		return
	}
		
	buildAscTaskProvider = vscode.tasks.registerTaskProvider(BuildAscTaskProvider.type, new BuildAscTaskProvider(workspaceRoot))
	// algorandNodeTaskProvider = vscode.tasks.registerTaskProvider(AlgorandNodeTaskProvider.type, new AlgorandNodeTaskProvider(workspaceRoot))
}

function activateAlgorandPanel(context: vscode.ExtensionContext) {
	const workspaceRoot = vscode.workspace.rootPath
	if (!workspaceRoot) {
		return
	}

	const algorandPanelCommand = vscode.commands.registerCommand('algorand.panel.show', () => {
		AlgorandPanel.createOrShow(context.extensionUri, workspaceRoot)
	})

	if (vscode.window.registerWebviewPanelSerializer) {
		vscode.window.registerWebviewPanelSerializer(AlgorandPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`)
				AlgorandPanel.revive(webviewPanel, context.extensionUri, workspaceRoot)
			}
		})
	}

	return algorandPanelCommand
}

export function deactivate(): Thenable<void> | undefined {
	if (buildAscTaskProvider) {
		buildAscTaskProvider.dispose()
	}
	// if (algorandNodeTaskProvider) {
	// 	algorandNodeTaskProvider.dispose()
	// }
	if (!client) {
		return undefined
	}
	return client.stop()
}
