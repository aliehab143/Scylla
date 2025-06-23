const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path to your User model
const UserWorkflow = require('../models/UserWorkflow');
const SECRET_KEY = process.env.JWT_SECRET;

/**
 * Generates a JWT token
 * @param {Object} data - The data to encode in the token
 * @param {string} expiresIn - Expiration time for the token (default: '24h')
 * @returns {string} - Signed JWT token
 */
function generateToken(data, expiresIn = '24h') {
  return jwt.sign(data, SECRET_KEY, { expiresIn });
}

// Register a new user
async function registerUser(userData, datasource_id) {
  try {
    const { name, email, phoneNumber, password } = userData;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        statusCode: 400,
        data: "User already registered",
      };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    // Generate a JWT token with user details
    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    console.log('user',user._id)
    // Create the user workflow
    const userWorkflow = await UserWorkflow.create({
      user_id: user._id,
    });

    return {
      statusCode: 201,
      data: token,
    };
  } catch (error) {
    console.error('Register Error:', error);
    return {
      statusCode: 500,
      data: "An error occurred while registering the user",
    };
  }
}

// Login user
async function loginUser(credentials) {
  try {
    const { email, password } = credentials;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        statusCode: 401,
        data: "invalid email or password",
      };
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        data: "invalid email or password",
      };
    }

    // Generate a JWT token with user details
    const token = generateToken({
      id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });

    return {
      statusCode: 200,
      data: token, // Return the token directly
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: "an error occurred while logging in",
    };
  }
}
const getAllDatasources = async (req, res) => {
  const user_id = req.user.id

  const data = await UserWorkflow.find({
    user_id
  })
    .populate('datasources')
    .populate('dashboards')
    .populate('datacorrelations');
  console.log(data);

  res.json({ data })

}

// Get user profile information
async function getUserProfile(userId) {
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return {
        statusCode: 404,
        data: "User not found",
      };
    }
    return {
      statusCode: 200,
      data: user,
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: "An error occurred while fetching user profile",
    };
  }
}

// Change user password
async function changePassword(userId, currentPassword, newPassword) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        data: "User not found",
      };
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        data: "Current password is incorrect",
      };
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return {
      statusCode: 200,
      data: "Password changed successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: "An error occurred while changing password",
    };
  }
}

// Update user profile
async function updateUserProfile(userId, updateData) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return {
        statusCode: 404,
        data: "User not found",
      };
    }

    // Update allowed fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.phoneNumber) user.phoneNumber = updateData.phoneNumber;

    await user.save();

    return {
      statusCode: 200,
      data: "Profile updated successfully",
    };
  } catch (error) {
    return {
      statusCode: 500,
      data: "An error occurred while updating profile",
    };
  }
}

module.exports = {
  registerUser,
  loginUser,
  getAllDatasources,
  getUserProfile,
  changePassword,
  updateUserProfile
};
