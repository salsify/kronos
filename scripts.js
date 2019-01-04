// Kronos/Date Transformer 2000
// Made by Evan Moulson

// Defines the places you care about as an array of JSON objects
// It uses the following format:
// {
//   "data": [{
//     "location": "Austin", // the name you want to appear
//     "emoji": "🤠", // emojis, because this is a hip webapp
//     "tzClass": "austin", // the class you're going to use later
//     "timezone": "America/Chicago" // the "official" IANA timezone name
//   }]
// }

// IMPORTANT
// Kronos uses IANA timezone names!
const places = {
  "data": [{
      "location": "Boston",
      "emoji": "🦞",
      "tzClass": "boston",
      "timezone": "America/New_York"
    },
    {
      "location": "Lisbon",
      "emoji": "🚋",
      "tzClass": "lisbon",
      "timezone": "Europe/Lisbon"
    },
    {
      "location": "Medellín",
      "emoji": "🇨🇴",
      "tzClass": "medellin",
      "timezone": "America/Bogota"
    },
    {
      "location": "Austin",
      "emoji": "🤠",
      "tzClass": "austin",
      "timezone": "America/Chicago"
    },
    {
      "location": "UTC",
      "emoji": "🌍",
      "tzClass": "utc",
      "timezone": "UTC"
    }
  ]
}

// Let's make ourselves a nice thing here to add emoji and names
makeRow = function makeTimeOutputRow(name, emoji, tzClass) {
  // creates top-level <div class='fow'></div>
  let row = document.createElement('div')
  row.className = 'row time'

  // creates <div class='column _3'></div> (the timezone names)
  let column3 = document.createElement('div')
  column3.className = 'column _3 label'
  row.appendChild(column3)

  // creates <div class='column _7'></div> (the actual times)
  let column7 = document.createElement('div')
  column7.className = 'column _7'
  row.appendChild(column7)

  // creates <span class='tz_label'></span> (a wrapper for the names and emoji)
  let tzLabel = document.createElement('span')
  tzLabel.className = 'tz_label'
  column3.appendChild(tzLabel)

  // creates <span class='geo_emoji'></span> and adds emoji
  let geoEmoji = document.createElement('span')
  let emojiVal = document.createTextNode(emoji)
  geoEmoji.className = 'geo_emoji'
  geoEmoji.appendChild(emojiVal)
  tzLabel.appendChild(geoEmoji)

  // creates <span class='geo_name'></span> and adds place name
  let geoName = document.createElement('span')
  let nameVal = document.createTextNode(name)
  geoName.className = 'geo_name'
  geoName.appendChild(nameVal)
  tzLabel.appendChild(geoName)

  // creates <span class='tz_time'></span> (which contains the times)
  let tzTime = document.createElement('span')
  tzTime.className = 'tz_time ' + tzClass
  column7.appendChild(tzTime)

  // creates <span class='tz_iso_time'></span> (which contains the ISO-formatted times)
  let tzIsoTime = document.createElement('span')
  tzIsoTime.className = 'tz_iso_time ' + tzClass + '_iso'
  column7.appendChild(tzIsoTime)

  // return that row!
  return row
}

// This creates the requisite number of rows for the JSON object onload
// It was a pain, for some reason
function makeTimeRows(placesJson, rowContainer) {
  for (var k in placesJson['data']) {
    let currentPlace = placesJson.data[k]
    row = makeRow(
      currentPlace.location,
      currentPlace.emoji,
      currentPlace.tzClass
    )
    $(rowContainer).append(row)
  }
}

// returns info about user's local timezone, e.g. 
// default_offset: -6
// display: "MST"
// hasDst: true
// hemisphere: "North"
// name: "America/Denver"
const localTimezone = function getLocalTimezoneObject(attr, tz) {
  tz = tz || null // tz param is optional
  return spacetime(null, tz).timezone()[attr]
}

// Object template for the datetime to be returned
const returnDate = function returnDateObject(datetime, hasDate) {
  var dt = {
    datetime: datetime,
    hasDate: hasDate = hasDate || true
  }
  return dt
}

// parses datetimes from some input text
const parseDatetime = function parseDatetimeFromInput(inputText) {
  let time_regex = /^(?<fullDate>\d{4}[/-]\d{1,2}[/-]\d{1,2}\s|\d{1,2}[/-]\d{1,2}[/-]\d{4}\s)?(?<hour>[0-9]?[0-9])[: ]?(?<min>[0-5][0-9])?\s?[: ]?(?<sec>[0-5][0-9])?\s?(?<ampm>[aApP][mM]?)?\s?(?<tz>[a-zA-Z /_-]+)?$/i
  if (time_regex.test(inputText) === true) {
    let t = time_regex.exec(inputText).groups
    returnDate(
      spacetime({
          iso: (typeof t.fullDate === 'undefined') ? spacetime.now().format('iso-short') : spacetime(t.fullDate).format('iso-short'),
          hour: (typeof t.hour === 'undefined') ? 0 : t.hour,
          minute: (typeof t.min === 'undefined') ? 0 : t.min,
          second: (typeof t.sec === 'undefined') ? 0 : t.sec,
          ampm: (typeof t.ampm === 'undefined') ? 'am' : (t.ampm + 'm').slice(0, 2) //allows parsing '9a' or '9p'
        },
        // default to local
        (typeof t.tz === 'undefined') ? localTimezone('name') : t.tz, {
          // Don't show warnings about half-typed timezones
          quiet: true
        }
      ),
      (typeof t.fullDate === 'undefined') ? false : true
    )
  } else {
    returnDate(
      spacetime(inputText, localTimezone('name'), { quiet: true }),
      true
    )
  }
}

// Makes time rows and sets local timezone on page load
  $('.local_tz').text('Your timezone: "' + localTimezone('name') + '"/' + localTimezone('display'))
  makeTimeRows(places, '#tz_row_container')

// On keypress, update the dates of all of the timezones
// This does all the cool time stuff!
(function () {
  $(document).ready(function () {
    let err = 'Please enter a valid date';
    let inputText = $('#input_dt')
    let tzTime = $('.tz_time')
    let tzIsoTime = $('.tz_iso_time')
    let dtFormatFull = 'EEE d MMM y, h:mm:ss a'
    let dtFormatIso = 'iso'
    // look for an input change!
    inputText.on('input',  
      function() {
        if (inputText.val().length > 0) {
          // parse the datetime inputted
          let d = parseDatetime(inputText.val()).datetime
          if (parseDatetime(inputText.val()).hasDate === true) {
            dtFormatFull = 'h:mm:ss a'
            dtFormatIso = 'iso-short'
          }
          let 
          if (d.isValid() == true) { // is the datetime valid?
            // set the timezoned time for each timezone in our JSON array
            for(var k in places.data) {
              let d_tz = d.goto(places.data[k].timezone)
              // format as "Tue 25 Dec 2018, 1:13:23 AM"
              $('.' + places.data[k].tzClass).text(d_tz.unixFmt(dtFormatFull))
              // format as "2018-12-25T01:15:22.954-07:00"
              $('.' + places.data[k].tzClass + '_iso').text(d_tz.format(dtFormatIso))
            }
          } else {
            tzTime.text(err)
            tzIsoTime.text(err)
          }
        } else {
          tzTime.text('')
          tzIsoTime.text('')
        }
      }
    )
  })
}())
