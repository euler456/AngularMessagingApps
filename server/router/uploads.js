module.exports = function(db, app, formidable, client, fs, path) {
  app.post('/profileImage', async function (req, res) {
    await client.connect();
    var form = new formidable.IncomingForm();
    const uploadFolder = path.join(__dirname, "../image");
    form.uploadDir = uploadFolder;
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files)=> {
      // assuming a single file for this example.
      let oldpath = files.image[0].filepath;
      let newpath = path.join(form.uploadDir, files.image[0].originalFilename);
      fs.rename(oldpath, newpath, async function (err) {
        // if an error occurs send message to client
        const userId = Number(fields.userId);
        if (err) {
          console.log("Error parsing the files");
          return res.status(400).json({
            status: "Fail",
            message: "There was an error parsing the files",
            error: err,
          });
        }
        const user = await db.collection('users').findOne({ userid: userId });
        const username = user.username; // Get the username from the user object

        const newFilename = username + '.jpg'; // Change the file extension to JPG
        console.log(newFilename);
        fs.rename(newpath, path.join(form.uploadDir, newFilename), async function (err) {
          if (err) {
            console.log("Error renaming the file");
            return res.status(400).json({
              status: "Fail",
              message: "There was an error renaming the file",
              error: err,
            });
          }

          const result = await db.collection('users').updateOne(
            { userid: userId },
            { $set: { filename: newFilename } }
          );

          if (result.modifiedCount === 1) {
            const responseData = {
              userid: user.userid,
              username: user.username,
              roles: user.roles,
              filename: newFilename
            };
            res.send({
              valid: true,
              user: responseData,                
              data: {'filename': newFilename, 'size': files.image[0].size},
            });
          } else {
            res.send({ success: false });
          }
        });
      });
    });
  });  
}
