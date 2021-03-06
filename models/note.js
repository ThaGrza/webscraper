var mongoose = require("mongoose");

// Saves a reference to the Schema constructor
var Schema = mongoose.Schema;


var NoteSchema = new Schema({
  title: String,
  body: String
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;