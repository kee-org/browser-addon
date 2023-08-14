import {vi} from 'vitest';

global.jest = vi;
global.chrome = {runtime:{id: "test id"}};
globalThis.chrome = {runtime:{id: "test id"}};
