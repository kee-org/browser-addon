The models in this folder represent data that is frequently passed across JSON interfaces that we do not control (e.g. jsonrpc, WebExtensions/Chrome cross-process messaging, Vuex state library).

Therefore, they must contain no instance functionality or other prototype additions that are unable to be round-tripped via a typical JSON parser.

While we have relatively few examples of needing such functionality we can represent them all using static methods on the class to help keep the code organised, although additional organisational layers may be added in future if the scale requires it.
