// There are four parts to the configuration of you REST API:
// 	basePath: the base documentation path for Swagger (useful for proxying)
// 	port: the port for the server
// 	db: a list of database connection strings
// 	cache: cache settings for your services
// 	search: a configuration for the search services
// 	fetch: functions for fetching data
//
// Search return columns must include the following:
// type     the category of search (i.e. "address")
// label    the return value you want to sort by
//
// The search performs a union of all tables specified in the query,
// so to search for more than one table in a single query, the return
// columns for each table in that query *must* be the same.
//

var pg = require('pg');

module.exports = {
  basePath: '',
  port: 8123,
  db: {
    //postgis: 'postgres://user:password@server/database'
    postgis: 'postgres://dfjisbpdtvbgzn:Vv4lsx7qjojQiclWiVZQ9RmTK8@ec2-54-243-190-100.compute-1.amazonaws.com:5432/d3h778ss2tho8k'
  },
  cache: {
    expiresIn: 30 * 1000,
    privacy: 'private'
  },
  search: {
    voter: {
      table: 'voters',
      // columns: `voter_status_desc`,
      columns: `*`,
      where: `first_name ilike ? and last_name ilike ?`,
      format: function(query) { process.stdout.write('Query: ' + query + '\n');
      return query.trim(); }
    }
  },
  fetch: {
    postgis: function (conn, sql, reply) {
      pg.connect(conn, function(err, client, done) {
        if (err) {
          console.log(err);
          reply({'error': 'error fetching client from pool', 'error_details': err });
        } else {
          client.query(sql, function(err, result) {
            done();  // call done to release the connection back to the pool
            if (err) {
              reply({'error': 'error running query', 'error_details': err});
            } else {
              reply(result.rows);
            }
          });
        }
      });
    }
  }
};
