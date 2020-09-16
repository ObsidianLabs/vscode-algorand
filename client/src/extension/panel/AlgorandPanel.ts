import * as vscode from 'vscode'

import InstanceChannel from '../ipc/InstanceChannel'

export default class AlgorandPanel {
	public static currentPanel: AlgorandPanel | undefined
	public static instanceChannel: InstanceChannel | undefined

	public static readonly viewType = 'algorandPanel'

	private _disposables: vscode.Disposable[] = []

	public static createOrShow(extensionUri: vscode.Uri, workspaceRoot: string) {
		const column = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined

		// If we already have a panel, show it.
		if (AlgorandPanel.currentPanel) {
			AlgorandPanel.currentPanel.panel.reveal(column)
			return
		}

		// Otherwise, create a new panel.
		const panel = vscode.window.createWebviewPanel(
			AlgorandPanel.viewType,
			'Algorand Panel',
			column || vscode.ViewColumn.One,
			{
				enableScripts: true,
				localResourceRoots: [
					vscode.Uri.joinPath(extensionUri, 'client', 'out', 'view'),
					vscode.Uri.joinPath(extensionUri, 'client', 'media'),
					vscode.Uri.joinPath(extensionUri, 'client', 'node_modules', 'purecss'),
				]
			}
		)

		AlgorandPanel.instanceChannel = new InstanceChannel(panel)
		AlgorandPanel.currentPanel = new AlgorandPanel(panel, extensionUri, workspaceRoot)
	}

	public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri, workspaceRoot: string) {
		AlgorandPanel.instanceChannel = new InstanceChannel(panel)
		AlgorandPanel.currentPanel = new AlgorandPanel(panel, extensionUri, workspaceRoot)
	}

	private constructor(private panel: vscode.WebviewPanel, private extensionUri: vscode.Uri, private workspaceRoot: string) {
		this._update()

		this.panel.onDidDispose(() => this.dispose(), null, this._disposables)

		this.panel.onDidChangeViewState(
			e => {
				if (this.panel.visible) {
					this._update()
				}
			},
			null,
			this._disposables
		)
	}

	public dispose() {
		AlgorandPanel.instanceChannel.dispose()
		AlgorandPanel.currentPanel = undefined

		this.panel.dispose()

		while (this._disposables.length) {
			const x = this._disposables.pop()
			if (x) {
				x.dispose()
			}
		}
	}

	private _update() {
		const webview = this.panel.webview
		this.panel.webview.html = this._getHtmlForWebview(webview)
	}

	private _getHtmlForWebview(webview: vscode.Webview) {
		const clientUri = vscode.Uri.joinPath(this.extensionUri, 'client')

		// const purecssBase = webview.asWebviewUri(vscode.Uri.joinPath(clientUri, 'node_modules', 'purecss', 'build', 'base-min.css'))
		// const purecssGrids = webview.asWebviewUri(vscode.Uri.joinPath(clientUri, 'node_modules', 'purecss', 'build', 'grids-min.css'))
		// const purecssButtons = webview.asWebviewUri(vscode.Uri.joinPath(clientUri, 'node_modules', 'purecss', 'build', 'buttons-min.css'))
		// const purecssTables = webview.asWebviewUri(vscode.Uri.joinPath(clientUri, 'node_modules', 'purecss', 'build', 'tables-min.css'))

		const reactAppUri = webview.asWebviewUri(vscode.Uri.joinPath(clientUri, 'out', 'view', 'index.js'))

		const html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Algorand Panel</title>

				<script>
					window.vscodeApi = acquireVsCodeApi();
					window.workspaceRoot = '${this.workspaceRoot}';
				</script>
			</head>
			<body>
				<div id="root" class="d-flex flex-column">
				</div>
				<script src="${reactAppUri}"></script>
			</body>
		</html>`

		return html
	}
}
