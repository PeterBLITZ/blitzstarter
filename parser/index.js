const url = require('url');
const htmlparser = require('htmlparser2');
const fileType = require('file-type');
const request = require('request');
const validator = require('validator');

const defaultProtocol = 'http:';

const rxMeta = /description|og:/im;
const cType = /jpeg|png|gif/im;

function parseMeta(attr, isHead) {
  let name = attr.name || attr.property || Object.keys(attr)[0];
  name = name.toLowerCase();
  if (rxMeta.test(name) && isHead) {
    return [name, attr.content || attr[name] || attr.value || ''];
  }
}

function fixUrlOneSlash(urlToFix) {
  return urlToFix.match(/^\/\b/) ? `/${urlToFix}` : urlToFix;
}

function fixUrlDoubleSlash(urlToFix) {
  return urlToFix.match(/^https?:\/\//)
    ? urlToFix
    : urlToFix.match(/^\//) ? urlToFix.match(/^\/\//) ? urlToFix : `/${urlToFix}` : `//${urlToFix}`;
}

function preValidator(input = '') {
  return fixUrlOneSlash(validator.trim(`${input}`));
}

function clear2SpAndN(str) {
  return str.replace(/\s{2,}|\n/gmi, ' ');
}

function parseStandart(resObj, opts, cb) {
  let isHead = false;
  let current;
  const parser = new htmlparser.Parser(
    {
      onopentag(name, attrs) {
        current = name;
        if (name === 'head') {
          isHead = true;
        } else if (name === 'meta') {
          let meta = parseMeta(attrs, isHead);
          if (meta) {
            resObj.raw[meta[0]] = meta[1];
          }
        } else if (name === 'img' && !isHead && !isClosed) {
          let src = attrs.src;
          const testData = /^data/img;
          if (src && !testData.test(src)) {
            if (!resObj.raw.images) {
              resObj.raw.images = new Set();
            }
            resObj.raw.images.add(url.resolve(opts.uri, src));
          }
        } else if (name === 'link' && isHead && attrs.rel && attrs.rel === 'canonical') {
          resObj.raw.canonical = attrs.href || '';
        }
      },
      ontext(text) {
        if (isHead && current === 'title') {
          resObj.raw.title += text;
        }
      },
      onclosetag(name) {
        if (name === 'head') {
          isHead = false;
          resObj.title = resObj.raw['og:title'] || resObj.raw.title || '';
          resObj.description = resObj.raw['og:description'] || resObj.raw.description || '';
          resObj.images = resObj.raw['og:image:secure_url'] || resObj.raw['og:image'] || '';
          resObj.url = resObj.raw.canonical || resObj.raw['og:url'] || resObj.input || '';
        }
      },
    },
    { decodeEntities: true }
  );

  let isClosed = false;
  let isFileChecked = false;
  let req = request
    .get(opts, (error, response, body) => {
      if (error) {
        console.log('request.get', error);
        return cb(null, resObj);
      }
      return cb(null, resObj);
    })
    .on('data', chunk => {
      if (!isFileChecked) {
        let file = fileType(chunk);

        if (file) {
          resObj.file = file;
          isClosed = true;
          req.end();
          req.destroy();
          req.abort();
          return;
        }

        isFileChecked = true;
      }
      parser.write(chunk);
    })
    .on('end', () => {
      resObj.title = clear2SpAndN(resObj.title);
      resObj.description = clear2SpAndN(resObj.description);
    })
    .on('close', () => !isClosed && cb(new Error('Read stream was closed')))
    .on('error', err => {
      resObj.error = err;
      return cb(null, resObj);
    })
    .on('response', res => {
      resObj.contentType = res.headers['content-type'];
      if (res.statusCode !== 200) {
        isClosed = true;
        req.end();
        req.destroy();
        req.abort();
        resObj = res.statusCode;
      }
      if (cType.test(res.headers['content-type'])) {
        isClosed = true;
        req.end();
        req.destroy();
        req.abort();
        resObj.images = resObj.input;
        resObj.file = true;
      }
    });
}

function extractRaw(input, cb) {
  const preValidInput = preValidator(input);
  console.log(input, preValidInput);
  let resObj = {
    input: preValidInput,
    title: '',
    description: '',
    images: '',
    url: '',
    raw: {
      title: '',
    },
  };

  let opts = {
    timeout: 10500,
    headers: {
      'User-Agent': 'request',
    },
    jar: true,
  };

  if (!validator.isURL(resObj.input, { allow_protocol_relative_urls: true })) {
    console.log('not valid URL');
    resObj.title = resObj.input;
    return cb(null, resObj);
  }

  let urlObject = url.parse(fixUrlDoubleSlash(resObj.input), false, true);

  if (!urlObject.protocol) urlObject.protocol = defaultProtocol;

  opts.uri = encodeURI(url.format(urlObject));

  resObj.opts = opts;

  parseStandart(resObj, opts, (err, res) => {
    if (err) {
      console.log(err);
      return cb(err);
    }
    return cb(null, res);
  });
}

function extract(input, cb) {
  extractRaw(input, (err, resObj) => {
    if (err) console.log(err);

    resObj.title = clear2SpAndN(resObj.title);
    resObj.description = clear2SpAndN(resObj.description);

    if (resObj.images) {
      resObj.images = url.resolve(resObj.opts.uri, resObj.images);
    } else {
      resObj.images = '';
    }

    return cb(null, resObj);
  });
}

module.exports = extract;
