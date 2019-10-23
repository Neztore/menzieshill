const Api = {}
const baseUrl = "localhost:3000"


Api.getEvents = async function  () {
  const events = await this.get("/events")
  if (events.error) {
    createErrorMessage(events.error.message)
    throw new Error(events.error.message)
  }
  return events
}

Api.get = async function (url, options) {
  if (!options) options = {}
  options.method = "GET"
  return this._makeRequest(url, options)
}


Api._makeRequest = async function (url, options) {
  const startChar = url.substr(0, 1)

  url = (startChar === '/') ? `${baseUrl}${url}` : `/${url}`
  const req = await fetch(url, options)
  return await req.json();
}