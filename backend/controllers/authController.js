const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const bcrypt = require('bcryptjs');
const sendVerificationEmail = require('../utils/sendVerificationEmail');
const send2FAOTPEmail = require('../utils/send2FAOTPEmail');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (email !== process.env.ADMIN_EMAIL) {
    return res.status(403).json({ message: 'Access restricted. Feature in limited testing.' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(403).json({ message: 'Access restricted. Feature in limited testing' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
    isVerified: false,
  });

  await newUser.save();

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  try {
    await sendVerificationEmail(email, token);
    res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send verification email' });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const { id: userId } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const user = await User.findById(userId);
    if (!user || user.isVerified) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?verified=false`);
    }

    await User.findByIdAndUpdate(userId, {
      isVerified: true,
      $unset: { expiresAt: '' },
    });

    res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/login?verified=false`);
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      return res.status(403).json({ message: 'Access restricted. Feature in limited testing.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: 'Access restricted. Feature in limited testing.' });
    }

    if (user.twoFactorEnabled) {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await Otp.findOneAndUpdate(
        { userId: user._id },
        { otp, createdAt: new Date() }, 
        { upsert: true, new: true }
      );

      await send2FAOTPEmail(user.email, otp);

      return res.status(206).json({
        message: 'OTP sent to your email for verification',
        twoFactorRequired: true,
        userId: user._id,
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('swt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful', twoFactorEnabled: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




const updateauthorname = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;
    

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ message: 'Name is required and must be a non-empty string.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: name.trim() },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Author name updated successfully' });
  } catch (error) {
    console.error('Error updating author name:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const changepassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new passwords are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const record = await Otp.findOne({ userId });

    if (!record) {
      return res.status(410).json({ message: 'OTP expired or not found' });
    }

    if (record.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    await Otp.deleteOne({ userId }); 

    const user = await User.findById(userId);
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('swt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: 'Login successful via OTP' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const twofactor = async (req, res) => {
  try {
    const { enable } = req.body; 
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { twoFactorEnabled: enable },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: `Two-factor authentication has been ${enable ? 'enabled' : 'disabled'}.`,
      twoFactorEnabled: user.twoFactorEnabled,
    });
  } catch (error) {
    console.error('Error updating 2FA:', error);
    res.status(500).json({ message: 'Server error while updating 2FA.' });
  }
};


const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('username twoFactorEnabled');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({ 
      authorName: user.username,
      twoFactorEnabled: user.twoFactorEnabled 
    });
  } catch (error) {
    console.error('Error fetching author name:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = { register, login, verifyEmail,updateauthorname, changepassword, twofactor, verifyOtp, getUserDetails };
