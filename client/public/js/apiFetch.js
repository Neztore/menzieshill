var Api = {}
var BaseUrl = "http://localhost:3000"

if (typeof module !== 'undefined') {
  module.exports = Api
}
Api._cache = {
};


// TODO: Add date support & caching.
Api.getEvents = async function  (startDate, endDate) {
  let url = "/events?";
  if (startDate||endDate) {
    if (startDate) {
      url += `min=${encodeURIComponent(startDate.toJSON())}&`
    }
    if (endDate) {
      url += `max=${encodeURIComponent(endDate.toJSON())}`
    }
  }

  // Basic URL based caching.
  if (this._cache[url]) {
    return this._cache[url]
  }


  const events = await this.get(url)

  if (events.error) {
    createErrorMessage(events.error.message)
    throw new Error(events.error.message)
  }

  this._cache[url] = events;
  return events
}

Api.getGroups = async function  () {
  let url = "/groups";

  if (this._cache[url]) {
    return this._cache[url]
  }


  const groups = await this.get(url)

  if (groups.error) {
    createErrorMessage(groups.error.message)
    throw new Error(groups.error.message)
  }

  this._cache[url] = groups;
  return groups
}


Api.getPosts = async function (page) {

  const url = page ? `/posts/list/${page}` : `/posts/list`
  if (this._cache[url]) {
    return this._cache[url]
  }

  const posts = await this.get(url)
  if (posts.success) {
    this._cache[url] = posts.posts;
    return posts.posts
  } else {
    createErrorMessage(posts.error.message)
  }
}

Api.get = function (url, options) {
  if (!options) options = {}
  options.method = "GET";
  return this._makeRequest(url, options)
};

Api.post = function (url, options) {
  try {
    if (!options) options = {}
    options.method = "POST";
    options.credentials = "include"

    // POST Body processing
    if (options.body && typeof options.body !== "string") {
      options.body = JSON.stringify(options.body)
      if (!options.headers) options.headers = {}
      options.headers["Content-Type"] = "application/json"
    }

    return this._makeRequest(url, options)
  } catch (e) {
    console.error(e)
    createErrorMessage(e.message)
  }
};

Api.patch = function (url, options) {
  try {
    if (!options) options = {}
    options.method = "PATCH";
    options.credentials = "include"

    // PATCH Body processing
    if (options.body && typeof options.body !== "string") {
      options.body = JSON.stringify(options.body)
      if (!options.headers) options.headers = {}
      options.headers["Content-Type"] = "application/json"
    }

    return this._makeRequest(url, options)
  } catch (e) {
    console.error(e)
    createErrorMessage(e.message)
  }
};

Api.delete = function (url, options) {
  try {
    if (!options) options = {}
    options.method = "DELETE";
    options.credentials = "include"

    return this._makeRequest(url, options)
  } catch (e) {
    console.error(e)
    createErrorMessage(e.message)
  }
};


Api._makeRequest = async function (url, options) {
  const startChar = url.substr(0, 1);
  options.credentials = "include"
  if (options.noCache) {
    if (!options.headers) options.headers = {};
    options.headers["cache-control"] = "no-cache"
    delete options.noCache;
  }


  url = (startChar === '/') ? `${BaseUrl}${url}` : `/${url}`;
  const req = await fetch(url, options);
  const json = await req.json();
  return json
}