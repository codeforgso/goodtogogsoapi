var Joi = require('joi'),
  squel = require('squel').useFlavour('postgres'),
  config = require('../config');


function formatSQL(request) {
  var sqlParts = [];
  var search = decodeURIComponent(request.query.tables);
  process.stdout.write(search + '\n');

  search.split(',').forEach(function(item) {
    var partial = squel.select()
          .from(config.search[item].table)
          .field(config.search[item].columns)
          .where(config.search[item].where, config.search[item].format(request.params.first_name), config.search[item].format(request.params.last_name))
          process.stdout.write('config.search[item].where: ' + config.search[item].where + '\n');

    sqlParts.push('(' + partial.toString() + ')');
  });3

  var returnSQL = sqlParts.join(' union ');
  process.stdout.write('returnSQL: ' + returnSQL);
  return returnSQL;
}


module.exports = [{
  method: 'GET',
  path: '/GoodToGoGSOapi/{first_name}/{last_name}',
  config: {
    description: 'list columns',
    notes: 'Returns a list of fields in the specified table.',
    tags: ['api'],
    validate: {
      params: {
        first_name: Joi.string()
          .required()
          .description('string to search for'),
        last_name: Joi.string()
          .required()
          .description('string to search for')
      },
      query: {
        tables: Joi.string().default('voter')
          .description('Comma delimited list of tables to search through. Each table must be defined in config. The default is <em>voter</em>'),
        // limit: Joi.number().integer().default(10)
        //   .description('Limit of return result in each category. Default is <em>10</em>')
      }
    },
    jsonp: 'callback',
    cache: config.cache,
    handler: function(request, reply) {
      config.fetch.postgis(config.db.postgis, formatSQL(request), reply);
    }
  }
}];
