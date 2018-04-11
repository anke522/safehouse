var Cesium = require('cesium')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const ejs = require('ejs')
const port = process.env.PORT || 3000
const elasticsearch = require('elasticsearch')

app.set('view engine', 'ejs')

var es = new elasticsearch.Client({
  host: process.env.ES_URL || 'http://localhost:9200',
  httpAuth: process.env.ES_HTTP_AUTH || ''
});

es.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: 3000
}, function (error) {
  if (error) {
    console.trace('ElasticSearch cluster is down!');
    process.exit(1); 
  } else {
    console.log('ElasticSearch cluster is reachable.');
  }
});

// create application/json parser
var jsonParser = bodyParser.json()

app.use('/Build', express.static('node_modules/cesium/Build'))
app.use('/models', express.static('models'))

app.get('/', function (req, res) {
  res.render('index')
})

var state = {
     "doorCamera" : { "color" : "WHITE", "alpha" : 1.0 },
    "accessPoint" : { "color" : "WHITE", "alpha" : 1.0 },
       "doorLock" : { "color" : "WHITE", "alpha" : 1.0 },
 'motionDetector' : { "color" : "WHITE", "alpha" : 1.0 }
}

/* Need to eventually instrument these as well:
     'miniCamera' : { "color" : "WHITE", "alpha" : 1.0 },
          'lamp1' : { "color" : "WHITE", "alpha" : 1.0 },
     'blueRange1' : { "color" : "WHITE", "alpha" : 1.0 },
          'alexa' : { "color" : "WHITE", "alpha" : 1.0 }
*/

app.get('/state', function (req, res) {
  res.status(200).json({ success: true, state: state })
})

var updateStateInterval;

function updateState() {

  // If unknown client attaches to the accessPoint, turn it YELLOW, otherwise make it WHITE
  es.search({
    index: 'safehouse-ap-devices-*',
    type: 'webhook',
    body: {
      query: {
        range: { timestamp: { gte: 'now-5m', lt: 'now' } }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["accessPoint"]["color"] = ( hits > 0 ? "YELLOW" : "WHITE" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If unauthorized connection to the doorCamera occurs (webcam-pcap-*), turn it YELLOW, otherwise make it WHITE
  es.search({
    index: 'webcam-pcap-*',
    type: 'webhook',
    body: {
      query: {
        range: { timestamp: { gte: 'now-5m', lt: 'now' } }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["doorCamera"]["color"] = ( hits > 0 ? "YELLOW" : "WHITE" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If doorLock is manually unlocked (door-lock-*), turn it YELLOW, otherwise make it WHITE
  es.search({
    index: 'door-lock-*',
    type: 'webhook',
    body: {
      sort: { timestamp: { order: "desc" }},
      query: {
        bool: {
          must: { match: { user: "Manual Unlock" } },
	  filter: [ { range: { timestamp: { gte: 'now-5m', lt: 'now' } } } ]
        }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["doorLock"]["color"] = ( hits > 0 ? "YELLOW" : "WHITE" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If motionDetector has triggered (domoticz), turn it YELLOW, otherwise make it WHITE
  es.search({
    index: 'domoticz',
    type: 'notification',
    body: {
      query: {
        bool: {
          must: { match: { MESSAGE: "swx-u-range-sensor-motion-1 Switch >> ON" } },
	  filter: [ { range: { date: { gte: 'now-5m', lt: 'now' } } } ]
        }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    console.log(JSON.stringify(resp.hits.hits,null,2))
    state["motionDetector"]["color"] = ( hits > 0 ? "YELLOW" : "WHITE" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })


}
updateStateInterval = setInterval(updateState, 5000);

// Now that the client is rather simple, this API is no longer needed:
app.get('/recent/:index/:type/:fromtime/:totime', function (req, res) {
  if(req.params) {
    var index = req.params.index
    var type = req.params.type
    var fromtime = req.params.fromtime
    var totime = req.params.totime
    var query = {
      index: `${index}*`,
      type: type,
      body: {
        query: {
	  range: {
            timestamp: {
              gte: `${fromtime}`,
              lt: `${totime}`
            }
          }
        }
      }
    }
    data = es.search(query).then(function (resp) {
      var hits = (resp.hits && resp.hits.hits.length) || 0;
      console.log(`GET /recent/${index}/${type}/${fromtime}/${totime} - ${hits} hits`)
      res.status(200).json({ success: true, hits: hits, result: resp })
    }, function (err) {
      if(err) {
        console.trace(err.message);
      }
    })
  } else {
    console.log(`GET /es/${index}/${type} - Missing parameters`)
    res.status(404).json({ success: false, message: "Missing parameters" })
  }
})

app.post('/', jsonParser, (req, res) => {
  console.log('POST /')
  console.log(req.body)
  res.status(200).json({ success: true })
})

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
