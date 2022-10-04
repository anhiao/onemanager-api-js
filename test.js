import test from './index.js';
(async ()=>{
    const TEST = new test("https://drive.aneme.cc/OneDrive_CN","nio2358@");
    await TEST.login();
    await TEST.upload("./IMG_0353.MOV","letsdoit.mov","/")
    // console.log(await TEST.getFileSize("./IMG_0353.MOV"));
    // await TEST.mkdir("letsgo1","/")
})();