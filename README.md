
``` cmd
    npm install onemanager-api-js
```
<br/><br/>
example

``` js
    import Omjs from 'onemanager-api-js';
    (async ()=>{
        const omjs = new Omjs("<your url><?your path>","<your login password>") ; /* https://drive.google.com  Aa123456*/
        await omjs.login():
        /* 
        [om-drive.aneme.cc] 初始化完毕,请调用'login'方法登录用户 (7:49:36 PM)
        [om-drive.aneme.cc] 登录成功 (7:50:47 PM) 
        */
        
        await omjs.mkdir(<dirname>);
        await omjs.upload(<filepath>,<filename>,<dirpath>);
        ...
    })
    
    //
```
