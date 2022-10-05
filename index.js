import fetch from 'node-fetch';
import blobFromSync from 'fetch-blob/from.js';
import sha1 from 'sha1';
import fs from 'fs';
export default class {
     constructor(url,password){
        Object.defineProperties(this,{
            "domain":{value:url.replace(/https?:\/\//g,""),writable:false},
            "url":{value:url,writable:false},
            "password":{value:password,writable:false},
        })
        this.log("初始化完毕,请调用'login'方法登录用户")
    }
    getLog(text){
        return (`[om-${this.domain}] ${text} (${new Date().toLocaleTimeString()})`)   
    }
    log(text){
        console.log(`[om-${this.domain}] ${text} (${new Date().toLocaleTimeString()})`)
    }
    async omAjax(type,body,path){
        if(type.length === 0  || path.length === 0) return this.log("'omAjax'缺少参数,请检查")
        if(type === "GET"){
            return (await fetch(`${this.url}${path}`,{
                method:type,
                  headers:{
                    "cookie":this.isLogin ? this.userCookie : "",
                    "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
                    //"content-type":"application/x-www-form-urlencoded;charset=UTF-8",
                    "x-requested-with":"XMLHttpRequest"
                }
            }))
        }
        return (await fetch(`${this.url}${path}`,{
                method:type,
                headers:{
                    "cookie":this.isLogin ? this.userCookie : "",
                    "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
                    "content-type":"application/x-www-form-urlencoded;charset=UTF-8",
                    "x-requested-with":"XMLHttpRequest"
                },
                body
               
            }));
    }
    get isLogin(){
        return this.userCookie ? true : false;
    }
     getFileSize(filepath){
        const fileStats = fs.statSync(filepath);
        return fileStats.size;
        
    }
    async download(){}
    async upload(filepath,filename,dirpath){
        // console.log(this.getFileSize(filepath))
        let filelastModified = new Date().getTime();
        const result = await this.omAjax("POST",encodeURI(`upbigfilename=${filename}&filesize=${this.getFileSize(filepath)}&filelastModified=${filelastModified}&filemd5=&_admin=${this.storageCookie}`),dirpath+"?action=upbigfile");
        const result_upload_url = (await result.json())['uploadUrl']
        const file = blobFromSync(filepath)
        let chunkSize = 10485759;
        // console.log(file.size);
        // console.log(this.getFileSize(filepath))
for (let start = 0; start < file.size; start += chunkSize+1) {

  const chunk = file.slice(start, start + chunkSize + 1)
  let result = await fetch(result_upload_url, {method: 'put', headers:{
                    "Content-Range":`bytes ${start}-${
                        start+chunkSize >= file.size ? file.size-1 :start+chunkSize
                        
                    }/${file.size}`,
                    "cookie":this.isLogin ? this.userCookie : "",
                    "accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.114 Safari/537.36",
                    "content-type":"application/x-www-form-urlencoded;charset=UTF-8",
                    "x-requested-with":"XMLHttpRequest"
                
      
  }, body: chunk});
    // process.stdout.clearLine();
    // process.stdout.cursorTo(0);
    process.stdout.write(await result.text() + "\r");
    process.stdout.write(this.getLog(`bytes ${start}-${
                        start+chunkSize >= file.size ? file.size-1 :start+chunkSize
                    }/${file.size} \r`));
};

    await this.omAjax("GET","",dirpath+`?action=del_upload_cache&filelastModified=${filelastModified}&filesize=${this.getFileSize(filepath)}&filename=${filename}`);
    this.log("\n上传文件完成")
    }
    async rmdir(){}
    async mkdir(dirname,dirpath){
        if(!this.isLogin) return this.log("请先登录 再调用'mkdir'方法");
        const result = await this.omAjax("POST",encodeURI(`create_sid=0&create_fileid=01DMAHSSN6Y2GOVW7725BZO354PWSELRRZ&create_type=folder&create_name=${(dirname)}&operate_action=${("新建")}&create_text=&_admin=${this.storageCookie}`),dirpath);
        let result_text = await result.text();
        
        try{
            JSON.parse(result_text);
            // await result.json();
            return this.log(`'${dirname}'文件夹创建成功`)
        }catch(err){
            console.warn(result_text);
            return this.log(`'${dirname}'文件夹创建失败 ${err.message}`)
        }
    }
    async login(){
        if(this.isLogin) return this.log("当前已是登录状态");
        let timestamp =`${new Date().getTime()}`.slice(0,-3);
        const result = await this.omAjax("POST", 
                (`password1=${
                    sha1(
                        timestamp
                        +
                        `${this.password}`
                        )
                    }&timestamp=${timestamp}`),`/?login=admin`)
        const newSetCookie = result.headers.get('set-cookie');
        if(newSetCookie === null) return this.log("登录失败,原因: 密码错误");
        this.log("登录成功")
        // this.log();
        // this.log("timezone=8; admin=84dd661ca30be073999d79311643b4fe(1665519687)");
        // this.log(`timezone=8;${newSetCookie.match(/.*\)/)[0]}`)
        // return;
        Object.defineProperties(this,{
        "storageCookie":{
            value:(await result.text()).match(/setItem\("admin".*"(.*)"\)/)[1],
            writable:false,
        },
        "userCookie":{
            
            value:`timezone=8; ${newSetCookie.match(/.*\)/)[0]}`,
            writable:false,
        }
        })
            

    }


}