db = db.getSiblingDB('fingerprint');

db.createUser({
    user: "fingerprint_user",
    pwd: "fingerprint_password",
    roles: [
      {
        role: "readWrite",
        db: "fingerprint"
      }
    ]
  });

