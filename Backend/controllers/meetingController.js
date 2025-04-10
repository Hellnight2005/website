// controllers/meetingController.js

const Meeting = require("../models/messageModel");

// Allowed values for type and user_role fields
const validTypes = ["upcoming", "line up"];
const validRoles = ["user", "Admin"];

/**
 * ✅ Helper function to validate meeting input data
 */
const validateMeetingData = ({
  user_name,
  title,
  selectDay,
  selectTime,
  slot,
  user_role,
  type,
}) => {
  // Basic required fields check
  if (
    !user_name ||
    !title ||
    !selectDay ||
    !selectTime ||
    !slot ||
    !user_role
  ) {
    return "All required fields (user_name, title, selectDay, selectTime, slot, user_role) must be filled.";
  }

  // Slot must be a positive number
  if (typeof slot !== "number" || slot <= 0) {
    return "Slot must be a positive number.";
  }

  // Validate meeting type if provided
  if (type && !validTypes.includes(type)) {
    return "Invalid meeting type. Allowed: upcoming, approved, cancelled, line up.";
  }

  // Validate role
  if (!validRoles.includes(user_role)) {
    return "Invalid user role. Allowed: user, moderator, Admin.";
  }

  return null; // ✅ All good
};

/**
 * ✅ Create a new meeting
 */
const createMeeting = async (req, res) => {
  try {
    const data = req.body;

    // Validate input
    const validationError = validateMeetingData(data);
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // Save to DB
    const meeting = await Meeting.create(data);

    res.status(201).json({
      success: true,
      message: "Meeting created successfully.",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create meeting.",
      error: error.message,
    });
  }
};

/**
 * ✅ Reschedule an existing meeting by ID
 */
const rescheduleMeeting = async (req, res) => {
  try {
    const { id } = req.params;
    const { selectDay, selectTime, slot, type } = req.body;

    if (!selectDay || !selectTime || !slot) {
      return res.status(400).json({
        success: false,
        message: "New date, time, and slot are required",
      });
    }

    // Check if meeting exists
    const existingMeeting = await Meeting.findById(id);
    if (!existingMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // If current type is "upcoming", switch to "line up"
    const updatedType =
      existingMeeting.type === "upcoming"
        ? "line up"
        : type || existingMeeting.type;

    // Update meeting
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      id,
      { selectDay, selectTime, slot, type: updatedType },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Meeting rescheduled successfully",
      data: updatedMeeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reschedule meeting",
      error: error.message,
    });
  }
};

/**
 * ✅ Approve a meeting by changing its type to "upcoming"
 */
const approveMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const meeting = await Meeting.findById(id);
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Change type to "upcoming"
    meeting.type = "upcoming";
    await meeting.save();

    res.status(200).json({
      success: true,
      message: "Meeting approved successfully",
      data: meeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to approve meeting",
      error: error.message,
    });
  }
};

/**
 * ✅ Delete a meeting by ID
 */
const deleteMeeting = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMeeting = await Meeting.findByIdAndDelete(id);

    if (!deletedMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
      data: deletedMeeting,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete meeting",
      error: error.message,
    });
  }
};

/**
 * ✅ Get meetings for a specific month and year based on "selectDay"
 * Expects year and month as query params (e.g., /api/meetings?year=2025&month=4)
 */
const getMeetingsByMonthUsingSelectDay = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: "Please provide both year and month (1-12)",
      });
    }

    // Fetch all and filter by date
    const allMeetings = await Meeting.find();

    const filteredMeetings = allMeetings.filter((meeting) => {
      const parsedDate = new Date(meeting.selectDay);
      return (
        parsedDate.getFullYear() === Number(year) &&
        parsedDate.getMonth() === Number(month) - 1 // JS months: Jan=0
      );
    });

    res.status(200).json({
      success: true,
      message: `Meetings for ${year}-${month}`,
      data: filteredMeetings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error filtering meetings by selectDay",
      error: error.message,
    });
  }
};

// Export all functions
module.exports = {
  createMeeting,
  rescheduleMeeting,
  approveMeeting,
  deleteMeeting,
  getMeetingsByMonthUsingSelectDay,
};
