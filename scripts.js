// Kronos/Date Transformer 2000
// Made by Evan Moulson!
// This is version 0.1

//to do:
// Add local time selector
// fix thing with time not disappearing
// add iso8601-formatted options

// Defines the places you care about as an array of JSON objects
// It uses the following format:
//var place_tags = {
//    "places": [{
//          "location": "Austin", // the name you want to appear
//          "emoji": "🤠", // emojis, because this is a hip webapp
//          "tz_class": "austin", // the class you're going to use later
//          "timezone": "US/Central" // the "official" moment.js timezone name
//        }

var place_tags = {
  "places": [{
    "location": "Austin",
    "emoji": "🤠",
    "tz_class": "austin",
    "timezone": "US/Central"
  }, {
    "location": "Boston",
    "emoji": "🦞",
    "tz_class": "boston",
    "timezone": "US/Eastern"
  }, {
    "location": "Lisbon",
    "emoji": "🚋",
    "tz_class": "lisbon",
    "timezone": "Europe/Lisbon"
  }, {
    "location": "Bogotá",
    "emoji": "🇨🇴",
    "tz_class": "bogota",
    "timezone": "America/Bogota"
  }, {
    "location": "UTC",
    "emoji": "🌍",
    "tz_class": "utc",
    "timezone": "UTC"
  }]
}

// Let's make ourselves a nice thing here to add emoji and names
function makeRow(name, emoji, tz_class) {
  // creates top-level <div class='fow'></div>
  var row = document.createElement('div')
  row.className = 'row'

  // creates <div class='column _3'></div> (the timezone names)
  var column3 = document.createElement('div')
  column3.className = 'column _3'
  row.appendChild(column3)
  
  // creates <div class='column _7'></div> (the actual times)
  var column7 = document.createElement('div')
  column7.className = 'column _7'
  row.appendChild(column7)

  // creates <span class='tz_label'></span> (a wrapper for the names and emoji)
  var tz_label = document.createElement('span')
  tz_label.className = 'tz_label'
  column3.appendChild(tz_label)

  // creates <span class='geo_emoji'></span> and adds emoji
  var geo_emoji = document.createElement('span')
  var emoji_val = document.createTextNode(emoji)
  geo_emoji.className = 'geo_emoji'
  geo_emoji.appendChild(emoji_val)
  tz_label.appendChild(geo_emoji)

  // creates <span class='geo_name'></span> and adds place name
  var geo_name = document.createElement('span')
  var name_val = document.createTextNode(name)
  geo_name.className = 'geo_name'
  geo_name.appendChild(name_val)
  tz_label.appendChild(geo_name)

  // creates <span class='tz_time'></span> (which contains the times)
  var tz_time = document.createElement('span')
  tz_time.className = 'tz_time ' + tz_class
  column7.appendChild(tz_time)

  // creates <span class='tz_iso_time'></span> (which contains the ISO-formatted times)
  var tz_iso_time = document.createElement('span')
  tz_iso_time.className = 'tz_iso_time ' + tz_class + '_iso'
  column7.appendChild(tz_iso_time)

  // return that row!
  return row 
}

    // This creates the requisite number of rows for the JSON object onload
    // It was a pain, for some reason
  window.addEventListener('load', function (e) {
    for (var k in place_tags.places) {
      row = makeRow(place_tags.places[k].location, place_tags.places[k].emoji, place_tags.places[k].tz_class)
      document.getElementById('tz_row_container').appendChild(row)
    }
  })

// Set the error message
// It's pretty boring
var error_msg = 'Please enter a valid date';

// On keypress, update the dates of all of the timezones
// This does all the cool time stuff!
(function () {
  // some jquery asking if the doc is ready
  $(document).ready(function () {
    // sets the input var, date, and time values to defaults
    var input_dt = $('#input_dt'), date = null, tz_time = $('.tz_time');
    // look for a keypress!
    input_dt.keyup(
      function (e) {
        // is the time longer than 0?
        if (input_dt.val().length > 0) {
          // parse the date using moment.js
          date = moment(input_dt.val());
          if (date !== null && date.format() != 'Invalid date') { // ouch
            // set the timezoned time for each timezone in our JSON array
            for(var k in place_tags.places) {
              $('.' + place_tags.places[k].tz_class).text(date.tz(place_tags.places[k].timezone).format('llll').toString());
              $('.' + place_tags.places[k].tz_class + '_iso').text(date.tz(place_tags.places[k].timezone).format().toString());
            }
          } else {
            tz_time.text(error_msg); // error! We set that earlier, remember?
          }
        } else {}
      }
    );
  });
}());
