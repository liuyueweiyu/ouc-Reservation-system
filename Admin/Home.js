const path = require('path');

function view(req,res) {
    res.sendFile(path.resolve('public/admin/index.html'));
}


module.exports = {
    view
}