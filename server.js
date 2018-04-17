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
     "doorCamera" : { "color" : "BLACK", "alpha" : 1.0, "alphaStart" : 1.0, "alphaEnd" : 0.5 },
    "accessPoint" : { "color" : "BLACK", "alpha" : 1.0, "alphaStart" : 1.0, "alphaEnd" : 0.5 },
       "doorLock" : { "color" : "BLACK", "alpha" : 1.0, "alphaStart" : 1.0, "alphaEnd" : 0.5 },
 'motionDetector' : { "color" : "BLACK", "alpha" : 1.0, "alphaStart" : 1.0, "alphaEnd" : 0.5 },
          'lamp1' : { "color" : "BLACK", "alpha" : 1.0, "alphaStart" : 1.0, "alphaEnd" : 0.5 },
      'safehouse' : { "color" : "WHITE", "alpha" : 0.5, "alphaStart" : 0.5, "alphaEnd" : 0.25 }
}

/* Need to eventually instrument these as well:
     'miniCamera' : { "color" : "BLACK", "alpha" : 1.0 },
     'blueRange1' : { "color" : "BLACK", "alpha" : 1.0 },
          'alexa' : { "color" : "BLACK", "alpha" : 1.0 }
*/

app.get('/state', function (req, res) {
  res.status(200).json({ success: true, state: state })
})

var updateStateInterval;

function updateState() {

  // If unknown client attaches to the accessPoint, turn it YELLOW, otherwise make it BLACK
  es.search({
    index: 'safehouse-ap-devices-*',
    type: 'webhook',
    body: {
      query: {
        range: { timestamp: { gte: 'now-15s', lt: 'now' } }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["accessPoint"]["color"] = ( hits > 0 ? "YELLOW" : "BLACK" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  var now_in_milliseconds = (new Date).getTime();

  // If person is detected by the doorCamera (persondetect), turn it WHITE, otherwise make it BLACK
  es.search({
    index: 'persondetect',
    type: '_doc',
    body: {
      query: {
        range: { timestamp: { gte: now_in_milliseconds - 15000, lt: now_in_milliseconds } }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["doorCamera"]["color"] = ( hits > 0 ? "WHITE" : "BLACK" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If unauthorized connection to the doorCamera occurs (webcam-pcap-*), turn it YELLOW, otherwise make it BLACK
  es.search({
    index: 'webcam-pcap-*',
    type: 'webhook',
    body: {
      query: {
        range: { timestamp: { gte: 'now-15s', lt: 'now' } }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["doorCamera"]["color"] = ( hits > 0 ? "YELLOW" : "BLACK" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If doorLock is manually unlocked (door-lock-*), turn it YELLOW, otherwise make it BLACK
  es.search({
    index: 'door-lock-*',
    type: 'webhook',
    body: {
      sort: { timestamp: { order: "desc" }},
      query: {
        bool: {
          must: { match: { user: "Manual Unlock" } },
	  filter: [ { range: { timestamp: { gte: 'now-15s', lt: 'now' } } } ]
        }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["doorLock"]["color"] = ( hits > 0 ? "YELLOW" : "BLACK" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If doorLock is NOT manually unlocked (door-lock-*), turn it WHITE, otherwise make it BLACK
  es.search({
    index: 'door-lock-*',
    type: 'webhook',
    body: {
      sort: { timestamp: { order: "desc" }},
      query: {
        bool: {
          must_not: { match: { user: "Manual Unlock" } },
	  filter: [ { range: { timestamp: { gte: 'now-15s', lt: 'now' } } } ]
        }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["doorLock"]["color"] = ( hits > 0 ? "WHITE" : "BLACK" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If motionDetector has triggered (domoticz), turn it YELLOW, otherwise make it BLACK
  es.search({
    index: 'domoticz',
    type: 'notification',
    body: {
      query: {
        bool: {
          must: { match: { MESSAGE: "swx-u-range-sensor-motion-1 Switch >> ON" } },
	  filter: [ { range: { date: { gte: 'now-15s', lt: 'now' } } } ]
        }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["motionDetector"]["color"] = ( hits > 0 ? "WHITE" : "BLACK" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If Alexa has triggered the lamp (alexa-trigger-*), turn it WHITE, otherwise make it BLACK
  es.search({
    index: 'alexa-trigger-*',
    type: 'webhook',
    body: {
      query: {
        bool: {
          must: { match: { target: "lamp" } },
	  filter: [ { range: { timestamp: { gte: 'now-15s', lt: 'now' } } } ]
        }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    state["lamp1"]["color"] = ( hits > 0 ? "WHITE" : "BLACK" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

  // If David's safehouse algorithm has triggered (sfalgo), turn the safehouse RED, otherwise make it WHITE
  es.search({
    index: 'sfalgo',
    type: '_doc',
    body: {
      query: {
        range: { DateTime: { gte: now_in_milliseconds - 15000, lt: now_in_milliseconds } }
      }
    }
  }).then(function (resp) {
    var hits = (resp.hits && resp.hits.hits.length) || 0;
    console.log(JSON.stringify(resp.hits.hits,null,2))
    state["safehouse"]["color"] = ( hits > 0 ? "RED" : "WHITE" )
  }, function (err) {
    if(err) {
      console.trace(err.message);
    }
  })

}
updateStateInterval = setInterval(updateState, 5000);

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
