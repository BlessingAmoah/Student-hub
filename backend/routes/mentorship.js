const express = require('express');
const router = express.Router();
const { User } = require('../models');
const verifyToken = require('../middleware/auth');

//get route for mentorship information
router.get('/mentorship', verifyToken, async (req, res) => {
  try {

    // fetch all users
    const users = await User.findAll({
      attributes: ['id', 'name', 'profilePicture', 'interest', 'mentorship', 'school'],
    });

    // format the fetch user information
    const formattedUser = users.map(user => ({
      id: user.id,
      name: user.name,
      profilePicture: user.profilePicture,
      interest: user.interest,
      mentorship: user.mentorship,
      school: user.school,
    }));

    // return the formatted data
    res.status(200).json({ users: formattedUser || users});
  } catch (error) {
    console.error('Mentors fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// request a mentor
router.post('/request-mentor', verifyToken, async (req, res) => {
  const { userId, note } = re.body

  try{
    const mentor = await User.findByPk(userId);
    if (!mentor || mentor.mentorship !== 'Mentor'){
      return res.status(404).json({ error: 'Mentor not found' });
    }

    // update user's status for mentor request
    await User.update({ status: 'requested', note }, { where: { id: req.userId } });

    res.status(201).json({ message: 'Mentor request sent successfully' });
  }catch (error) {
    console.error('Request mentor error:', error)
    res.status(500).json({ error: 'Internal server error'})
  }
});

// fetch mentorship request for a mentor
router.get('/mentor-requests', verifyToken, async (res) => {
  try {
    const mentorshipRequest = await User.findAll({
      where: {
        mentorship: 'Mentee',
        status: 'requested'
      },
      attributes: ['id', 'name', 'profilePicture', 'interest', 'mentorship', 'note', 'status'],
    })
    res.status(200).json(mentorshipRequest);
  } catch (error) {
    console.error('Fetch mentorship requests error:', error);
    res.status(500).json({ error: 'Internal server error'})
  }
});

//respond to a mentorship request
router.post('/respond-mentorship', verifyToken, async (req, res) => {
  const { userId, status } = req.body;

  try {
    const mentee = await User.findByPk(userId);

    if (!mentee) {
      return res.status(404).json({ error: 'Mentee not found'})
    }

    // Update mentee's status based on accepted or rejected
    if(mentee) {
      await User.update({ status: status }, { where: { id: userId}});
    }
    res.status(200).json({ message: 'Mentorship status updated successfully'});
  } catch (error) {
    console.error('Respond mentorship error:', error)
    res.status(500).json({ error: 'Internal server error'});
  }
})

module.exports = router;
