  //to do:
  // Add local time selector
  // fix thing with time not disappearing
  // add iso8601-formatted options

  // Defines the places
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
    var tz_row = document.createElement('div')
    tz_row.className = 'row'

    var col3 = document.createElement('div')
    col3.className = 'column _3'
    tz_row.appendChild(col3)

    var tz_label = document.createElement('div')
    col3.className = 'tz_label'
    col3.appendChild(tz_label)

    var geo_emoji = document.createElement('span')
    var emoji_val = document.createTextNode(emoji)
    geo_emoji.className = 'geo_emoji'
    geo_emoji.appendChild(emoji_val)
    tz_label.appendChild(geo_emoji)

    var geo_name = document.createElement('span')
    var name_val = document.createTextNode(name)
    geo_name.className = 'geo_name'
    geo_name.appendChild(name_val)
    tz_label.appendChild(geo_name)

    var col7 = document.createElement('div')
    col7.className = 'column _7'
    tz_row.appendChild(col7)

    var tz_time = document.createElement('span')
    tz_time.className = 'tz_time ' + tz_class
    col7.appendChild(tz_time)

    document.getElementsByClassName('top').appendChild(tz_row)
  }
  
  window.onloadstart = function() {
    for (var k in place_tags.places) {
      makeRow(place_tags[k].places.location, place_tags[k].places.emoji, place_tags[k].places.tz_class)
    }
  }

  // Set the error message
  var error_msg = 'Please enter a valid date';

  // On keypress, update the dates of all of the timezones
  (function () {
    $(document).ready(function () {
      var input_dt = $('#input_dt'), date = null, tz_time = $('.tz_time');
      input_dt.keyup(
        function (e) {
          if (input_dt.val().length > 0) {
            date = moment(input_dt.val());
            if (date !== null && date.format() != 'Invalid date') {
              for(var k in place_tags.places) {
                $(place_tags.places[k].tz_class).removeClass('error').addClass('accept').text(date.tz(place_tags.places[k].timezone).format('llll').toString());
              }
            } else {
              tz_time.removeClass('accept').addClass('error').text(error_msg);
            }
          } else {}
        }
      );
    });
  }());
