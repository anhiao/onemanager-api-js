import test from './index.js';
(async ()=>{
    const TEST = new test("https://drive.aneme.cc/OneDrive_CN","nio2358@");
    await TEST.login();
    await TEST.mkdir("letsgo1","/")
})();