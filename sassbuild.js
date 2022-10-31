/**
 * Utility script for compiling all sass files in this project.
 * 
 * Arguments passed to this script are forwarded to sass, so to run sass in
 * watch mode, add --watch or -w when executing this script.
 */
'use strict';

function getSassArgs() {

  // sass input output pair for many-to-many mode
  const inout = (input, output) => `${input}:${output}`;

  var result = [
    '-I', 'node_modules/plums/src',
    inout('src/sass/style.sass',              '_site/assets/css/style.css'),
    inout('src/sass/inlined/404.sass',        'src/_includes/sass-css/404.css'),
    inout('src/sass/inlined/changelog.sass',  'src/_includes/sass-css/changelog.css')
  ];
  if (process.env.SITE_ENV === 'production') {
    result.push(
      // don't generate source maps for production builds
      '--no-source-map',
      // compress the output css
      '--style', 'compressed'
    );
  }
  result = result.concat(process.argv.slice(2));
  return result;
}

const { spawnSync } = require('child_process');
spawnSync('sass', getSassArgs(), { stdio: 'inherit' });
