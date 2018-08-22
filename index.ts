import { Observable, Observer } from 'rxjs';
import { createProject, Project } from 'gulp-typescript';
import * as gulp from 'gulp';
import { relative, Path, dirname, resolve, normalize, parseJson, basename } from '@angular-devkit/core';
import * as sourcemaps from 'gulp-sourcemaps';
import { readFileSync, writeFileSync } from 'fs';

export function iwe7TsCompiler(tsconfig: string): Observable<string> {
    return Observable.create((obser: Observer<string>) => {
        tsconfig = normalize(tsconfig);
        const root = normalize(process.cwd());
        const relativePath = relative(root, tsconfig as Path);
        const tsconfigPath = dirname(relativePath);
        const project: Project = createProject(relativePath);
        // 获取ng-package.prod.json
        const ngPackage: any = parseJson(readFileSync(resolve(tsconfigPath, normalize('./ng-package.prod.json'))).toString('utf-8'));
        const outDir = resolve(tsconfigPath, ngPackage.dest);
        const _lib = resolve(tsconfigPath, ngPackage.lib.entryFile);
        const sourceRoot = dirname(_lib);
        // package.json
        const packagePath = resolve(tsconfigPath, normalize('./package.json'));
        const packageJson: any = parseJson(readFileSync(packagePath).toString('utf-8'));
        packageJson.main = basename(_lib).replace('.ts', '.js');
        // 版本号自动递增
        const version: string = packageJson.version;
        const versions: string[] = version.split('.');
        const newVersion = versions.map((res, index) => {
            if (index === versions.length - 1) {
                let id = parseInt(res);
                id = id + 1;
                return id + ''
            } else {
                return res;
            }
        }).join('.');
        packageJson.version = newVersion;
        writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        const srcs = [
            `${sourceRoot}/**/*.graphql`,
            `${sourceRoot}/*.graphql`,
            `${tsconfigPath}/package.json`,
            `${sourceRoot}/**/*.{html,css,txt,xml,json,js,jpeg,jpg,png,svg,gif}`
        ];
        const _staticTask = gulp.series(
            () => gulp.src(srcs).pipe(gulp.dest(outDir)),
            (done) => {
                obser.next('静态文件复制完成');
                done();
            }
        );
        const _tscTask = gulp.series(
            () => project.src()
                .pipe(sourcemaps.init())
                .pipe(project())
                .pipe(sourcemaps.write("."))
                .pipe(gulp.dest(outDir)),
            (done) => {
                obser.next('typescript编译完成');
                done();
            }
        );
        gulp.series(_staticTask, _tscTask)(done => {
            obser.complete();
        });
    })
}
