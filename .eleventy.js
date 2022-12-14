
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const eleventyAsciidoc = require('eleventy-plugin-asciidoc');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const pluginSeo = require('eleventy-plugin-seo');
const markdownIt = require("markdown-it");
const htmlmin = require('html-minifier');

// filter and shortcode functions
const filters = require('./src/js/filters');
const nunjucks = require('./src/js/nunjucks');

module.exports = function(ec) {

  ec.addPlugin(EleventyRenderPlugin);
  ec.addPlugin(eleventyNavigationPlugin);
  ec.addPlugin(eleventyAsciidoc, {
    attributes: {
      relfileprefix: '../',
      relfilesuffix: '/'
    }
  });
  ec.addPlugin(pluginSeo, require('./src/_data/seo.json'));

  {
    // GFM style with html enabled, indented code blocks disabled
    // Remove this when using eleventy 2.0
    var md = markdownIt('default', {
      html: true
    });
    md.disable('code');
    ec.setLibrary('md', md);
  }

  ec.setBrowserSyncConfig({
    files: [
      './_site/assets/css/style.css'
    ]
  });

  ec.addPassthroughCopy('src/assets');
  ec.addPassthroughCopy('src/manual');
  ec.addNunjucksGlobal("getAssetInfo", nunjucks.getAssetInfo);

  ec.addFilter('releasedOn', filters.releasedOn);
  ec.addFilter('releaseUrl', filters.releaseUrl);
  ec.addFilter('breadcrumb', filters.breadcrumb);
  ec.addFilter('navOfPermalink', filters.navOfPermalink);

  if (process.env.SITE_ENV === 'production') {
    console.log('=== PRODUCTION BUILD ===');
    // minimize output html for production builds
    ec.addTransform('htmlmin', function(content) {
      if (this.outputPath && this.outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        });
        return minified;
      }
      return content;
    });
  }

  return {
    dir: {
      input: 'src',
      output: '_site',
    }
  };

};