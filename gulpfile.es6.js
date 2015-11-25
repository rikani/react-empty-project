import path from 'path';
import gulp from 'gulp';
import del from 'del';
import gutil from 'gulp-util';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import merge from 'merge-stream';
import spritesmith from 'gulp.spritesmith';
import plumber from 'gulp-plumber';
import rsync from 'gulp-rsync';
import sftp from 'gulp-sftp';

const paths = {
  icons: 'www/f/src/sprites/icons/*.png'
};

gulp.task('webpack', (callback) => {
  // run webpack
  webpack({

    context: path.join(__dirname, '/www/f/src'),

    entry: {
      app: './app'
    },

    output: {
      path: path.join(__dirname, '/www/f/assets'),
      publicPath: 'www/f/assets/',
      filename: '[name].bundle.js',
      library: '[name]'
    },

    module: {

      loaders: [{
        test: /\.js$/,
        include: __dirname + '/www/f/src',
        loader: 'babel?presets[]=react,presets[]=es2015'
      }, {
        test:   /\.scss$/,
        loader: 'style!css!resolve-url!sass?sourceMap'
      }, {
        test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        include: __dirname + '/www/f/media',
        loader: 'file?name=[name].[hash:5].[ext]?'
      }]

    },

    plugins: [
      new webpack.optimize.UglifyJsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    ],

    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },

    resolve: {
      extensions: ['', '.js']
    }

  }, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err);
    }

    gutil.log('[webpack]', stats.toString({
      // output options
    }));

    callback();
  });
});

gulp.task('webpack-dev-server', (callback) => {
  // Start a webpack-dev-server
  const compiler = webpack({

    devtool: 'inline-source-map',

    context: path.join(__dirname, '/www/f/src'),

    entry: {
      app: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './app'
      ]
    },

    output: {
      path: path.join(__dirname, '/www/f/assets'),
      filename: '[name].bundle.js',
      publicPath: 'http://localhost:8080/www/f/assets/'
    },

    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('development'),
        }
      })
    ],

    module: {

      loaders: [{
        test: /\.js$/,
        include: __dirname + '/www/f/src',
        loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015']
      }, {
        test:   /\.scss$/,
        loader: 'style!css!resolve-url!sass?sourceMap'
      }, {
        test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
        include: __dirname + '/www/f/media',
        loader: 'file?name=[path][name][hash:5].[ext]?[hash]'
      }]

    },

    resolve: {
      extensions: ['', '.js'],
    }

  });

  new WebpackDevServer(compiler, {
    // webpack-dev-server options
    contentBase: __dirname + '/',
    // or: contentBase: "http://localhost/",

    //headers: {
    //  "Access-Control-Allow-Origin": "",
    //  "Access-Control-Allow-Credentials": "true"
    //},

    hot: true,
    // Enable special support for Hot Module Replacement
    // Page is no longer updated, but a "webpackHotUpdate" message is send to the content
    // Use "webpack/hot/dev-server" as additional module in your entry point
    // Note: this does _not_ add the `HotModuleReplacementPlugin` like the CLI option does.

    // webpack-dev-middleware options
    quiet: false,
    noInfo: false,
    //lazy: true,
    filename: '[name].bundle.js',
    /*watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },*/
    publicPath: '/www/f/assets/',
    stats: { colors: true },

    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: false

    // Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
    // Use "*" to proxy all paths to the specified server.
    // This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
    // and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
    /*proxy: {
      '*': 'http://beta.park.sokolniki.com'
    }*/
  }).listen(8080, 'localhost', (err) => {
    if (err) {
      throw new gutil.PluginError('webpack-dev-server', err);
    }
    // Server listening
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');

    // keep the server alive or continue?
    // callback();
  });
});

gulp.task('spritesmith', () => {
  const spriteData = gulp.src(paths.icons)
    .pipe(plumber())
    .pipe(spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      imgPath: 'www/f/media/sprite.png',
      algorithm: 'binary-tree'
    }));

  // Pipe image stream
  const imgStream = spriteData.img
    .pipe(gulp.dest('www/f/media/'));

  // Pipe CSS stream
  const cssStream = spriteData.css
    .pipe(gulp.dest('www/f/src/styles/'));

  // Return a merged stream to handle both `end` events
  return merge(imgStream, cssStream);
});

gulp.task('clean:assets', function () {
  return del([
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'www/f/assets/**/*'
  ]);
});


// Rerun the task when a file changes
gulp.task('watch', () => {
  gulp.watch(paths.icons, ['spritesmith']);
});

gulp.task('sprite', ['spritesmith']);

gulp.task('build', ['clean:assets', 'sprite', 'webpack']);
gulp.task('default', ['watch', 'sprite', 'webpack-dev-server']);
