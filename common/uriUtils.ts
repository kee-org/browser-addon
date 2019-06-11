// //TODO: Unusued. Why, etc?

// import { KeeLog } from "./Logger";

// /*
//  * getURIExcludingQS
//  *
//  * Get a string that includes all but a URI's query string
//  */
// export let getURIExcludingQS = function (uriString) {
//     let realm = "";
//     try {
//         const uri = this._ioService.newURI(uriString, null, null);

//         if (uri.scheme == "file")
//             realm = uri.scheme + "://";
//         else {
//             realm = uri.scheme + "://" + uri.host;

//             // If the URI explicitly specified a port, only include it when
//             // it's not the default. (We never want "http://foo.com:80")
//             const port = uri.port;
//             if (port != -1) {
//                 const handler = this._ioService.getProtocolHandler(uri.scheme);
//                 if (port != handler.defaultPort)
//                     realm += ":" + port;
//             }
//         }

//         const QSbreak = uri.path.indexOf("?");
//         realm += uri.path.substring(1, QSbreak > 1 ? QSbreak : uri.path.length);
//     } catch (e) {
//         KeeLog.warn("Couldn't parse origin");
//         realm = null;
//     }
//     return realm;
// };

// /*
//  * getURIHostAndPort
//  *
//  * Get a string that includes only a URI's host and port.
//  * EXCEPTION: For file protocol this returns the file path
//  */
// export let getURIHostAndPort = function (uriString) {
//     let uri;
//     let realm = "";
//     try {
//         // if no protocol scheme included, we can still try to return the host and port
//         if (uriString.indexOf("://") < 0)
//             uri = this._ioService.newURI("http://" + uriString, null, null);
//         else
//             uri = this._ioService.newURI(uriString, null, null);

//         if (uri.scheme == "file")
//             realm = uri.path;
//         else {
//             realm = uri.host;

//             // If the URI explicitly specified a port, only include it when
//             // it's not the default. (We never want "http://foo.com:80")
//             const port = uri.port;
//             if (port != -1) {
//                 const handler = this._ioService.getProtocolHandler(uri.scheme);
//                 if (port != handler.defaultPort)
//                     realm += ":" + port;
//             }
//         }
//     } catch (e) {
//         KeeLog.warn("Couldn't parse origin");
//         realm = null;
//     }
//     return realm;
// };

// /*
//  * getURISchemeHostAndPort
//  *
//  * Get a string that includes only a URI's scheme, host and port
//  * EXCEPTION: For file protocol this returns the file scheme and path
//  */
// export let getURISchemeHostAndPort = function (uriString) {
//     let realm = "";
//     try {
//         const uri = this._ioService.newURI(uriString, null, null);

//         if (uri.scheme == "file")
//             realm = uri.scheme + "://" + uri.path;
//         else {
//             realm = uri.scheme + "://" + uri.host;

//             // If the URI explicitly specified a port, only include it when
//             // it's not the default. (We never want "http://foo.com:80")
//             const port = uri.port;
//             if (port != -1) {
//                 const handler = this._ioService.getProtocolHandler(uri.scheme);
//                 if (port != handler.defaultPort)
//                     realm += ":" + port;
//             }
//         }

//     } catch (e) {
//         KeeLog.warn("Couldn't parse origin");
//         realm = null;
//     }
//     return realm;
// };
