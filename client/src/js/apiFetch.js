const Api = {}
const baseUrl = "http://localhost:3000"
Api._cache = {};


// TODO: Add date support & caching.
Api.getEvents = async function  () {

    const events = await this.get("/events")

  if (events.error) {
    createErrorMessage(events.error.message)
    throw new Error(events.error.message)
  }
  this._cache.events = events;
  return events
}

Api.get = function (url, options) {
  if (!options) options = {}
  options.method = "GET"
  return this._makeRequest(url, options)
}


Api._makeRequest = async function (url, options) {
  const startChar = url.substr(0, 1)

  url = (startChar === '/') ? `${baseUrl}${url}` : `/${url}`
  const req = await fetch(url, options)
  console.log(req)
  const json = await req.json();
  console.log(json)
  return json
}