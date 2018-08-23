"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const path_1 = require("path");
index_1.iwe7TsCompiler(path_1.join(process.cwd(), 'projects/iwe8-core/tsconfig.lib.json')).subscribe(res => {
    console.log(res);
});
//# sourceMappingURL=test.js.map