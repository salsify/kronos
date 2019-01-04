// Kronos/Date Transformer 2000
// Made by Evan Moulson!

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
      "location": "Medellín",
      "emoji": "🇨🇴",
      "tz_class": "medellin",
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

getLocalTime = function () {
  return [spacetime().timezone().name, spacetime().timezone().display]
}

// Object template for the datetime to be returned
function DateTime(datetime, hasDate) {
  this.datetime = datetime
  this.hasDate = hasDate
}

d_input = function(input_text) {
  let time_regex = /^(?<fullDate>\d{4}[/-]\d{1,2}[/-]\d{1,2}\s|\d{1,2}[/-]\d{1,2}[/-]\d{4}\s)?(?<hour>[0-9]?[0-9])[: ]?(?<min>[0-5][0-9])?\s?[: ]?(?<sec>[0-5][0-9])?\s?(?<ampm>[aApP][mM]?)?\s?(?<tz>[a-zA-Z /_-]+)?$/i
  if (time_regex.test(input_text) == true) {
    var t = time_regex.exec(input_text).groups
    let timezone = (typeof t.tz == 'undefined') ? spacetime().timezone().name : t.tz
     dt = new DateTime(spacetime({
        iso: (typeof t.fullDate == 'undefined') ? spacetime.now().format('iso-short') : spacetime(t.fullDate).format('iso-short'),
        hour: (typeof t.hour == 'undefined') ? 0 : t.hour,
        minute: (typeof t.min == 'undefined') ? 0 : t.min,
        second: (typeof t.sec == 'undefined') ? 0 : t.sec,
        ampm: (typeof t.ampm == 'undefined') ? 'am' : (t.ampm + 'm').slice(0,2) //allows parsing '9a' or '9p'
      }, 
      timezone,
      {
        // Don't show warnings about half-typed timezones
        quiet: true
      }
      ),
      (typeof t.fullDate === 'undefined') ? false : true)
  } else {
    dt = new DateTime(spacetime(input_text), true)
  }
  return dt
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
  $(document).ready(function () {
    // sets the input var, date, and time values to defaults
    let input_text = $('#input_dt')
    let d = null
    let tz_time = $('.tz_time')
    let tz_iso_time = $('.tz_iso_time')
    // look for a keypress!
    input_text.on('input',  
      function (e) {
        // is the time longer than 0?
        if (input_text.val().length > 0) {
          // parse the datetime inputted
          d = d_input(input_text.val())
          if (d.datetime.isValid() == true) { // is the datetime valid?
            // set the timezoned time for each timezone in our JSON array
            for(var k in place_tags.places) {
              var d_tz = d.datetime.goto(place_tags.places[k].timezone)
              // format as "Tue 25 Dec 2018, 1:13:23 AM"
              if (d.hasDate === false) {
                dtFormat = 'h:mm:ss a'
              } else {
               dtFormat = 'EEE d MMM y, h:mm:ss a'
              }
              $('.' + place_tags.places[k].tz_class).text(d_tz.unixFmt(dtFormat))
              // format as "2018-12-25T01:15:22.954-07:00"
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
