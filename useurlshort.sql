use urlshort
db.users.updateMany({}, {$set:{"last_check_email": null}})
db.users.updateMany({}, {$unset:{"last_check_email": null}})

db.users.find( {} ).forEach( function (x) {
  x.last_check_email = new Date(); // convert field to string
  db.users_backup.insertOne(x);
});

db.users.copyTo("users_backup");


db.users.find().forEach((doc) => {
    print(doc);
    db.users_backup.insertOne(doc);
  })
  && print("Copy completed!");


db.getCollection("users").drop();
