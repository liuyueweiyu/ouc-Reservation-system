const fs = require('fs'),
      path = require('path'),
      sqlhelper = require('../Utils/SqlHelper');

function upimage(req,res) {
    const len = req.files.length,
          root = path.join(__dirname, '../public/images') + "/",
          filenames = [];
    let flag = false;
    async function up(i) {
        if(i == len){
            flag = true;
            if (flag) {
                try {
                    await sqlhelper.updateItem('infor',{picture:filenames.join(',')},req.body.id);
                    res.end(JSON.stringify({
                        code: 0,
                        msg: '上传成功!'
                    }));
                } catch (error) {
                    res.end(JSON.stringify({
                        code: 1,
                        msg: '上传失败!'
                    }));
                }
            } else {
                res.end(JSON.stringify({
                    code: 1,
                    msg: '上传失败!'
                }));
            }
            return;
        }
        const des_file = root + req.files[i].originalname;
        fs.readFile( req.files[i].path, function (err, data) {
            fs.writeFile(des_file, data, function (err) {
                if( err ){
                    res.end(JSON.stringify({
                        code: 1,
                        msg: '上传失败!'
                    }));
                }
                else{
                    filenames.push(req.files[i].originalname);
                    up(i + 1);
                }
            });
        });
    
    }
    up(0);

}

module.exports = {
    upimage
}