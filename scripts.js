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


// IMPORTANT
// Kronos uses IANA timezone names!
var place_tags = {
  "places": [{
      "location": "Boston",
      "emoji": "🦞",
      "tz_class": "boston",
      "timezone": "America/New_York"
    },
    {
      "location": "Lisbon",
      "emoji": "🚋",
      "tz_class": "lisbon",
      "timezone": "Europe/Lisbon"
    },
    {
      "location": "Bogotá",
      "emoji": "🇨🇴",
      "tz_class": "bogota",
      "timezone": "America/Bogota"
    },
    {
      "location": "Austin",
      "emoji": "🤠",
      "tz_class": "austin",
      "timezone": "America/Chicago"
    },
    {
      "location": "UTC",
      "emoji": "🌍",
      "tz_class": "utc",
      "timezone": "UTC"
    }
  ]
}

// Let's make ourselves a nice thing here to add emoji and names
function makeRow(name, emoji, tz_class) {
  // creates top-level <div class='fow'></div>
  var row = document.createElement('div')
  row.className = 'row time'

  // creates <div class='column _3'></div> (the timezone names)
  var column3 = document.createElement('div')
  column3.className = 'column _3 label'
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

d_input = function() {
  var input_text = document.getElementById('input_dt').value
  return spacetime(input_text)
}

getLocalTime = function() {
  return [spacetime().timezone().name, spacetime().timezone().display]
}

// This creates the requisite number of rows for the JSON object onload
// It was a pain, for some reason
makeTimeRows = function() {
  for (var k in place_tags.places) {
    row = makeRow(place_tags.places[k].location, place_tags.places[k].emoji, place_tags.places[k].tz_class)
    document.getElementById('tz_row_container').appendChild(row)
  }
}

// Makes time rows and sets local timezone on page load
window.addEventListener('load', function (e) {
  $('.local_tz').text('Your timezone: "' + getLocalTime()[0] + '"/' + getLocalTime()[1])
  makeTimeRows()
})

// Set the error message
// It's pretty boring
var error_msg = 'Please enter a valid date';

// On keypress, update the dates of all of the timezones
// This does all the cool time stuff!
(function () {
  // asking if the doc is ready
  $(document).ready(function () {
    // sets the input var, date, and time values to defaults
    var input_text = $('#input_dt'),
      d = null,
      tz_time = $('.tz_time'),
      tz_iso_time = $('.tz_iso_time')
    // look for a keypress!
    input_text.keyup(
      function (e) {
        // is the time longer than 0?
        if (input_text.val().length > 0) {
          // parse the datetime inputted
          d = d_input()
          if (d.format('') !== '') { // ouch
            // set the timezoned time for each timezone in our JSON array
            for(var k in place_tags.places) {
              var d_tz = d.goto(place_tags.places[k].timezone)
              $('.' + place_tags.places[k].tz_class).text(d_tz.format('day-short') + ' ' + d_tz.format('month-short') + ' ' + d_tz.format('date-ordinal') + ', ' + d_tz.format('year') + ', ' + d_tz.format('time'))
              $('.' + place_tags.places[k].tz_class + '_iso').text(d_tz.format('iso'))
            }
          } else {
            tz_time.text(error_msg) // error! We set that earlier, remember?
            tz_iso_time.text(error_msg)
          }
        } else {
          tz_time.text('')
          tz_iso_time.text('')
        }
      }
    )
  })
}())
