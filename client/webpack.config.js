const path = require('path');

module.exports = {
  entry: {
    index: './src/view/index.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'out', 'view'),
    filename: '[name].js'
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
			{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
			{
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
					'style-loader',
          'css-loader',
        ]
			}
    ]
  },
  performance: {
    hints: false
  }
}