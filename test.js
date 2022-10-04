import test from './index.js';
(async ()=>{
    const TEST = new test("https://drive.aneme.cc/OneDrive_CN","nio2358@");
    await TEST.login();
    await TEST.upload("./[Comicat&KissSub][SPY x FAMILY][10][1080P][GB][MP4].mp4","rssiddght2.mov","/")
    // console.log(await TEST.getFileSize("./IMG_0353.MOV"));
    // await TEST.mkdir("letsgo1","/")
})();