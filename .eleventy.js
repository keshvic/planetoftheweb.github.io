const { DateTime } = require('luxon')
const pluginRss = require('@11ty/eleventy-plugin-rss')
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginTOC = require('eleventy-plugin-nesting-toc')
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation')

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(pluginRss)

  eleventyConfig.addPlugin(syntaxHighlight)

  eleventyConfig.addWatchTarget('_process/scss')

  eleventyConfig.addFilter('simpleDate', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(
      'LLL dd, yyyy'
    )
  })

  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2'],
    wrapper: 'div',
    wrapperClass: '',
  })

  eleventyConfig.addPlugin(eleventyNavigationPlugin)

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (n < 0) {
      return array.slice(n)
    }
    return array.slice(0, n)
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj).toFormat('yyyy-LL-dd')
  })

  // only content in the `posts` directory
  eleventyConfig.addCollection('posts', function (collection) {
    return collection.getFilteredByGlob('./_site/posts/*.md').reverse()
  })

  // only content in the `courses` directory
  eleventyConfig.addCollection('courses', function (collection) {
    return collection.getFilteredByGlob('./_site/courses/*.md').reverse()
  })

  // only content in the `projects` directory
  eleventyConfig.addCollection('projects', function (collection) {
    return collection.getFilteredByGlob('./_site/projects/**/*.md')
  })

  // only content in the `rayveal` directory
  eleventyConfig.addCollection('rayveal', function (collection) {
    return collection.getFilteredByGlob('./_site/projects/rayveal/*.md')
  })

  // only content in the `seven` directory
  eleventyConfig.addCollection('seven', function (collection) {
    return collection.getFilteredByGlob('./_site/projects/seven/*.md')
  })

  eleventyConfig.addCollection('searchable', function (collection) {
    return collection
      .getFilteredByGlob([
        './_site/courses/*.md',
        './_site/posts/*.md',
        './_site/projects/**/*.md',
      ])
      .reverse()
  })

  eleventyConfig.addCollection(
    'tagList',
    require('./_site/_includes/getTagList')
  )

  eleventyConfig.addPassthroughCopy("./_site/js/script.js");
  /* Markdown Plugins */
  let markdownIt = require('markdown-it')
  let markdownItAnchor = require('markdown-it-anchor')
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  }
  let opts = {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: ' ',
  }

  eleventyConfig.setLibrary(
    'md',
    markdownIt(options).use(markdownItAnchor, opts)
  )

  return {
    templateFormats: ['md', 'njk', 'html', 'liquid', 'png', 'jpg', 'svg'],
    pathPrefix: '/',
    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    dir: {
      input: '_site',
      templates: '_includes',
      layouts: '_layouts',
      data: '_data',
      output: 'docs',
    },
  }
}
