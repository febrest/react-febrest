"use strict";
import { contextForState } from "./context";
var version;
try {
  version = VERSION;
} catch (e) {}
export default {
  version,
  contextForState
};
