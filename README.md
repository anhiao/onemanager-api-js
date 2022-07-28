# om.js
Onemanager-PHP ‘s tool (JavaScript)


## How to use
`git clone https://github.com/AnHiAo/om.js`
## step-1
``` cmd
    npm install
```

## step-2
``` js
    import Omjs from './index.js';
    (async ()=>{
        const omjs = new Omjs("<your url>","<your login password>") ; /* https://drive.google.com  Aa123456*/
        await omjs.login():
        /*
        [om-drive.aneme.cc] 初始化完毕,请调用'login'方法登录用户 (7:49:36 PM)
        [om-drive.aneme.cc] 登录成功 (7:50:47 PM) 
        */
        
        await omjs.mkdir("test");
        ...
    })
    
    //
```
