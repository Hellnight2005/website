// routes/meetingRoutes.js

const express = require("express");
const router = express.Router();
const {
  createMeeting,
  rescheduleMeeting,
  approveMeeting,
  deleteMeeting,
  getMeetingsByMonthUsingSelectDay,
} = require("../controllers/meetingController");

/**
 * @route   POST /
 * @desc    Create a new meeting
 * @access  Public (can be secured later using middleware like auth)
 */
router.post("/", createMeeting);

/**
 * @route   POST /reschedule/:id
 * @desc    Reschedule an existing meeting by ID
 * @access  Admin/User
 */
router.post("/reschedule/:id", rescheduleMeeting);

/**
 * @route   PATCH /approve-meeting/:id
 * @desc    Approve a meeting by setting its type to 'upcoming'
 * @access  Admin/User with approval access
 */
router.patch("/approve-meeting/:id", approveMeeting);

/**
 * @route   DELETE /meetings/:id
 * @desc    Delete a meeting by ID
 * @access  Admin
 */
router.delete("/meetings/:id", deleteMeeting);

/**
 * @route   GET /meetings-by-selectday?year=2025&month=4
 * @desc    Fetch all meetings for a specific month and year (based on 'selectDay')
 * @access  Admin
 */
router.get("/meetings-by-selectday", getMeetingsByMonthUsingSelectDay);

module.exports = router;
