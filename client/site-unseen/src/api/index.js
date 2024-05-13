const loc = window.location;
const BASEURL = `${loc.protocol}//${loc.hostname}${loc.hostname==='localhost' ? ':5001' : '' }`
export {BASEURL}