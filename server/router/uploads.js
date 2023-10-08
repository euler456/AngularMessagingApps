module.exports = function( db ,app,formidable ,client,fs,path){
  app.post('/profileImage', async function (req, res) {
    await client.connect();
    var form = new formidable.IncomingForm();
    const uploadFolder = path.join(__dirname, "../image");
    form.uploadDir = uploadFolder;
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files)=> {
      //assuming a single file for this example.
      let oldpath = files.image[0].filepath;
      let newpath = path.join(form.uploadDir, files.image[0].originalFilename);
      fs.rename(oldpath, newpath,async function (err) {
        //if an error occurs send message to client
        const userId = Number(fields.userId);
        if (err) {
          console.log("Error parsing the files");
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
        }
        const result = await db.collection('users').updateOne(
          { userid: userId },
          { $set: { filename: files.image[0].originalFilename } }
        );
        if (result.modifiedCount === 1) {
          let user = await db.collection('users').findOne({ userid: userId })
          const responseData = {
            userid: user.userid,
            username: user.username,
            roles: user.roles,
            filename:user.filename
          };
          res.send({
            valid: true,
            user: responseData,                
            data:{'filename':files.image[0].originalFilename,'size':files.image[0].size},
          });
        } else {
          res.send({ success: false });
        }    
      });
    });
  });
}