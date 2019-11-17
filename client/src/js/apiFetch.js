const Api = {}
const baseUrl = "http://localhost:3000"

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


Api._makeRequest = async function (url, options) {
  const startChar = url.substr(0, 1);

  url = (startChar === '/') ? `${baseUrl}${url}` : `/${url}`;
  const req = await fetch(url, options);
  console.log(req)
  const json = await req.json();
  console.log(json)
  return json
}