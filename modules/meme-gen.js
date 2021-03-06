(function() {
  nodebooruServer = "http://img.uncod.in"
  macroServer = "http://macro.uncod.in"

  memeHelp = {
    dlawton: "Disgusted Lawton",
    bcthulhu: "Baby Cthulhu",
    sjohn: "Skeptical John",
    bcat: "Business Cat",
    pguy: "Programmer Guy",
    thumbguy: "Thumbs-Up Suited Guy",
    stonerstoney: "Stoner Stoney",
    o9000: "Over 9000 Vegeta",
    octocat: "Octocat", 
    ducreux: "Joseph Ducreux"
  }

  memes = {
    dlawton: "0440B0001F0347031E1102D14FE35D4C",
    bcthulhu: "0405B0000FEB2CD2138DC22251C0D7CA",
    sjohn: "04739000C348442434092157502157A8",
    bcat: "04E9400000602CD2EEF7C80651C0937A",
    pguy: "0493500308D108CFD8D58C7A51BF2E93",
    thumbguy: "040F8013656E5040581289475150DD5D",
    stonerstoney: "04EF40124A4F5040572846F1512D9CC6",
    o9000: "049D200338A944244D120DDD50535BC2",
    octocat: "04D5700060572CD2ABE0697E51C4AA99", 
    ducreux: "04B1700069B42CD2502988BE51C4C038"
  };

  module.exports = function(robot) {
    robot.respond(/meme help/, function(msg) {
      msg.send("Available memes ('gonk meme <name> <quotedTopCaption> <quotedBottomCaption>'):");

      for (var meme in memeHelp) {
        msg.send(meme + ": " + memeHelp[meme]);
      }
    });
    
    //Temporary meme add
    robot.respond(/meme add ([a-z0-9]+) ([A-Z0-9]{32})/, function(msg) {
      var alias = msg.match[1];
      var guid = msg.match[2];
      
      if (!(alias in memes)) {
        memes[alias] = guid
        memeHelp[alias] = alias + " (TEMPORARY)";
        msg.send(guid + " added as " + alias);
      } else {
        msg.send("I already know " + alias);
      }
    });

    return robot.respond(/meme( me)? (.*) "(.*)" "(.*)"/, function(msg) {
      meme = msg.match[2];
      topStr = msg.match[3];
      bottomStr = msg.match[4];

      var image = memes[meme];
      if (!image) {
        if (!/[A-Z0-9]{32}/.test(meme)) {
          return msg.send("Sorry, I don't know that meme.");
        } else {
          image = meme;
        }
      }

      return msg.http(macroServer + "/macro")
      .header('Content-Type', 'application/x-www-form-urlencoded')
      .query({
        image: image,
        top: topStr,
        bottom: bottomStr
      })
      .post()(function(err, res, body) {
        if (body) {
          return msg.send(nodebooruServer + "/img/" + body + ".jpeg");
        } else {
          return msg.send("Something went wrong. Is the macro server up?");
        }
      });
    });
  };

}).call(this);
