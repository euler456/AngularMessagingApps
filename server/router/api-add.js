module.exports = function (db, app) {
    app.post('/api/add', function(req, res) {
      if (!req.body) {
        return res.sendStatus(400);
      }
  
      const users = req.body;
      const collection = db.collection('users');
  
      // Check for duplicate ids
      collection.find({ 'id': users.id }).count((err, count) => {
        if (err) throw err;
  
        if (count == 0) {
          // If no duplicate, insert the product
          collection.insertOne(users, (err, dbres) => {
            if (err) throw err;
            let num = dbres.insertedCount;
            res.send({ 'num': num, 'err': null });
          });
        } else {
          // On Error send back error message
          res.send({ 'num': 0, 'err': 'duplicate item' });
        }
      });
    });
  };
  