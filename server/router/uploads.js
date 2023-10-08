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
      console.log(oldpath, newpath);
      fs.rename(oldpath, newpath, function (err) {
        //if an error occurs send message to client
        if (err) {
          console.log("Error parsing the files");
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
        }
        //send result to the client if all is good.
        res.send({
                result:'OK',
                data:{'filename':files.image[0].originalFilename,'size':files.image[0].size},
                numberOfImages:1,
                message:"upload successful"
              });      
      });
    });
  });
}