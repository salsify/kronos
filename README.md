# [Kronos](https://salsify.github.io/kronos/)

Allows you to input datetimes in all kinds of different formats and get both human-readable and iso8601 datetimes in timezones that we care a lot about!
Uses the [spacetime](https://github.com/spencermountain/spacetime/) time library for (most) parsing and transformation.

## Input formats

*YYYY-MM-DDTHH:mm:ss-ZZZZ* is best, but who wants to write that every time?

- **You can use almost any format you can think of** (with a few exceptions: dates always need to specify the 4-digit year, for example)
- It will use your locale's default for ambiguous dates like `02/02/2002`
- Things like `now` or `today` will work, as well as times with or without timezones
- At the moment, dates like `Jan 30, 2019` cannot be parsed: use `2018-01-30` instead

 **[Tell me](mailto:emoulson@salsify.com) if something doesn't work, but should!**

## To-do

- [ ] Add support for non-default timezone selector
- [x] Better support for space-separated datetimes like `2018-12-25 9:45pm`
- [ ] Add a GPS tag to Pauline so we can automatically adjust the tz info
- [ ] Copy-on-click for times (maybe just ISO?)
- [x] Add local timezone info
- [ ] Travel to random timezones for... testing
- [x] [Add seconds?](https://github.com/spencermountain/spacetime/issues/69)
- [x] Allow time (instead of date or datetime) input
- [ ] Allow setting locale
- [ ] Replace regexp with datetime parser
- [ ] Add zone name/offset to each location name
- [ ] General cleanup/style improvements
- [ ] Make input into params on the URL so that datetimes can be copied as a URL?
