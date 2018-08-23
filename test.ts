import { iwe7TsCompiler } from './index';
import { join } from 'path';

iwe7TsCompiler(join(process.cwd(), 'projects/iwe8-core/tsconfig.lib.json')).subscribe(res=>{
    console.log(res);
});
