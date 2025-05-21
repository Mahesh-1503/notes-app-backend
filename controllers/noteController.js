const Note = require("../models/Note");

// Create a new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.create({
      title,
      content,
      tags: tags || [],
      userId: req.userId,
    });
    res.status(201).json(note);
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ message: "Error creating note", error: err.message });
  }
};

// Get all notes for the logged-in user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ message: "Error fetching notes", error: err.message });
  }
};

// Get a single note
exports.getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ message: "Error fetching note", error: err.message });
  }
};

// Update a note
exports.updateNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Validate input
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content, tags: tags || [] },
      { new: true } // Return the updated note
    );

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(note);
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ message: "Error updating note", error: err.message });
  }
};

// Delete a note
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "Error deleting note", error: err.message });
  }
};