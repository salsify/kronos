# kronos
[**Date Transformer 2000**](https://salsify.github.io/kronos/)

Allows you to input datetimes in all kinds of different formats and get both human-readable and iso8601 datetimes in timezones that we care a lot about! 
Uses the [spacetime](https://github.com/spencermountain/spacetime/) time library for (most) parsing and transformation.

## Input formats
*YYYY-MM-DDTHH:mm:ss-ZZZZ* is best, but who wants to write that every time?
- **You can use almost any format you can think of** (with a few exceptions)
- It will use your locale's default for ambiguous dates like `02/02/2002`
- Things like `now` or `today` will work, as well as times with or without timezones

 **Tell me if something doesn't work, but should!**

## To-do:
- better support for datetimes like `2018-12-25 9:45pm`
- copy-on-click for times
- add local timezone support
- travel to random timezones for... testing
- Add seconds? https://github.com/spencermountain/spacetime/issues/70
- Allow time (instead of date or datetime) input
- Allow setting locale
- General cleanup
