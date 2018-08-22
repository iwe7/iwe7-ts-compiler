"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
const gulp_typescript_1 = require("gulp-typescript");
const gulp = require("gulp");
const core_1 = require("@angular-devkit/core");
const sourcemaps = require("gulp-sourcemaps");
const fs_1 = require("fs");
function iwe7TsCompiler(tsconfig) {
    return rxjs_1.Observable.create((obser) => {
        tsconfig = core_1.normalize(tsconfig);
        const root = core_1.normalize(process.cwd());
        const relativePath = core_1.relative(root, tsconfig);
        const tsconfigPath = core_1.dirname(relativePath);
        const project = gulp_typescript_1.createProject(relativePath);
        // 获取ng-package.prod.json
        const ngPackage = core_1.parseJson(fs_1.readFileSync(core_1.resolve(tsconfigPath, core_1.normalize('./ng-package.prod.json'))).toString('utf-8'));
        const outDir = core_1.resolve(tsconfigPath, ngPackage.dest);
        const _lib = core_1.resolve(tsconfigPath, ngPackage.lib.entryFile);
        const sourceRoot = core_1.dirname(_lib);
        // package.json
        const packagePath = core_1.resolve(tsconfigPath, core_1.normalize('./package.json'));
        const packageJson = core_1.parseJson(fs_1.readFileSync(packagePath).toString('utf-8'));
        packageJson.main = core_1.basename(_lib).replace('.ts', '.js');
        // 版本号自动递增
        const version = packageJson.version;
        const versions = version.split('.');
        const newVersion = versions.map((res, index) => {
            if (index === versions.length - 1) {
                let id = parseInt(res);
                id = id + 1;
                return id + '';
            }
            else {
                return res;
            }
        }).join('.');
        packageJson.version = newVersion;
        fs_1.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        const srcs = [
            `${sourceRoot}/**/*.graphql`,
            `${sourceRoot}/*.graphql`,
            `${tsconfigPath}/package.json`,
            `${sourceRoot}/**/*.{html,css,txt,xml,json,js,jpeg,jpg,png,svg,gif}`
        ];
        const _staticTask = gulp.series(() => gulp.src(srcs).pipe(gulp.dest(outDir)), (done) => {
            obser.next('静态文件复制完成');
            done();
        });
        const _tscTask = gulp.series(() => project.src()
            .pipe(sourcemaps.init())
            .pipe(project())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest(outDir)), (done) => {
            obser.next('typescript编译完成');
            done();
        });
        gulp.series(_staticTask, _tscTask)(done => {
            obser.complete();
        });
    });
}
exports.iwe7TsCompiler = iwe7TsCompiler;
//# sourceMappingURL=index.js.map