### ts编译器，用于编译nodejs,nestjs模块

```ts
import {iwe7TsCompiler} from 'iwe7-ts-compiler';
import { join } from 'path';
iwe7TsCompiler(join(process.cwd(), 'projects/iwe8-core/tsconfig.lib.json')).subscribe(res => {
    // 进度报告
    console.log(res);
});
```
