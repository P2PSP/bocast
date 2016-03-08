'use strict';

var sqlite3 = require('sqlite3');

function open(name, callback) {
  var db = new sqlite3.Database(name, function(err) {
    if (err) {
      console.log('Error trying to open the database:', err);
      return;
    }

    console.log('The database has been open successfully.');

    callback({
      createTable: createTable,
      insert: insert,
      select: select,
      close: close
    });
  });

  // TODO: Validate input strings
  function createTable(name, columns, callback) {
    db.run('CREATE TABLE ' + name + ' ' + columns, function(err) {
      if (err) {
        console.log('Error trying to create the table:', err);
        return;
      }

      console.log('The "' + name + '" table has been created successfully.');

      if (callback) {
        callback();
      }
    });
  }

  // TODO: Validate input strings
  function insert(tableName, values, callback) {
    if (!Array.isArray(values)) {
      values = [values];
    }

    var stmt = db.prepare('INSERT INTO ' + tableName + ' VALUES (?)');

    var error = false;
    function cb(err) {
      if (err) {
        console.log('Error inserting rows:', err);
        error = true;
      }
    }

    for (var i = 0; i < values.length; i++) {
      stmt.run(values[i], cb);
    }

    console.log('Inserted into "' + tableName + '" table successfully.');

    stmt.finalize();

    if (callback) {
      callback();
    }
  }

  // TODO: Validate input strings
  function select(tableName, columns, callback) {
    db.all('SELECT ' + columns + ' FROM ' + tableName, function(err, rows) {
      if (err) {
        console.log('Error trying to select from the table:', err);
        return;
      }

      console.log('Rows selected successfully:', rows);

      if (callback) {
        callback();
      }
    });
  }

  function close(callback) {
    db.close(function(err) {
      if (err) {
        console.log('Error closing the database:', err);
        return;
      }

      console.log('the database has been closed successfully.');

      if (callback) {
        callback();
      }
    });
  }
}

module.exports = {
  open: open
};
