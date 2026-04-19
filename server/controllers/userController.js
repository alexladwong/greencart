import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const resolveFrontendOrigin = (req) => {
    const configuredOrigin = process.env.FRONTEND_URL || process.env.CLIENT_URL;
    if (configuredOrigin) {
        return configuredOrigin.split(',')[0].trim().replace(/\/$/, '');
    }

    const requestOrigin = req.get('origin');
    if (requestOrigin) {
        return requestOrigin.replace(/\/$/, '');
    }

    const forwardedProto = req.headers['x-forwarded-proto'];
    const forwardedHost = req.headers['x-forwarded-host'];
    if (forwardedProto && forwardedHost) {
        return `${forwardedProto}://${forwardedHost}`.replace(/\/$/, '');
    }

    const host = req.get('host');
    if (host) {
        const protocol = req.protocol || 'https';
        return `${protocol}://${host}`.replace(/\/$/, '');
    }

    return 'http://localhost:5173';
}

// Register User : /api/user/register
export const register = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({email: normalizedEmail})

        if(existingUser)
            return res.json({success: false, message: 'User already exists'})

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({name, email: normalizedEmail, password: hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        return res.json({success: true, token, user: {email: user.email, name: user.name, _id: user._id}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Login User : /api/user/login

export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;

        if(!email || !password)
            return res.json({success: false, message: 'Email and password are required'});
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({email: normalizedEmail});

        if(!user){
            return res.json({success: false, message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch)
            return res.json({success: false, message: 'Invalid email or password'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({success: true, token, user: {email: user.email, name: user.name, _id: user._id}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Check Auth : /api/user/is-auth
export const isAuth = async (req, res)=>{
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout User : /api/user/logout

export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Forgot Password : /api/user/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: 'Email is required' });
        }

        console.log('Looking for user with email:', email.trim().toLowerCase());

        const user = await User.findOne({ email: email.trim().toLowerCase() });

        if (!user) {
            console.log('User not found for email:', email);
            return res.json({ success: false, message: 'User not found' });
        }

        console.log('User found:', user.email);

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        // Send email
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const resetUrl = `${resolveFrontendOrigin(req)}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
            to: user.email,
            subject: 'Password Reset Request - GreenCart',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Password Reset</title>
                    <style>
                        body {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 20px;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 10px;
                            overflow: hidden;
                            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                            padding: 30px;
                            text-align: center;
                        }
                        .header h1 {
                            color: #ffffff;
                            margin: 0;
                            font-size: 28px;
                            font-weight: 600;
                        }
                        .logo {
                            font-size: 32px;
                            font-weight: bold;
                            color: #ffffff;
                            margin-bottom: 10px;
                        }
                        .content {
                            padding: 40px 30px;
                        }
                        .content h2 {
                            color: #333333;
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .content p {
                            color: #666666;
                            line-height: 1.6;
                            margin-bottom: 20px;
                        }
                        .button {
                            display: inline-block;
                            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                            color: #ffffff;
                            padding: 15px 40px;
                            text-decoration: none;
                            border-radius: 25px;
                            font-weight: 600;
                            font-size: 16px;
                            transition: all 0.3s ease;
                        }
                        .button:hover {
                            transform: translateY(-2px);
                            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
                        }
                        .footer {
                            background-color: #f8f8f8;
                            padding: 20px 30px;
                            text-align: center;
                            border-top: 1px solid #e0e0e0;
                        }
                        .footer p {
                            color: #999999;
                            font-size: 12px;
                            margin: 5px 0;
                        }
                        .warning {
                            background-color: #fff3cd;
                            border-left: 4px solid #ffc107;
                            padding: 15px;
                            margin: 20px 0;
                            border-radius: 4px;
                        }
                        .warning p {
                            color: #856404;
                            margin: 0;
                            font-size: 14px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="logo">🛒 GreenCart</div>
                            <h1>Password Reset</h1>
                        </div>
                        <div class="content">
                            <h2>Hello ${user.name || 'there'},</h2>
                            <p>We received a request to reset your password for your GreenCart account. If you made this request, please click the button below to set a new password:</p>
                            
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            
                            <p>This password reset link will expire in 30 minutes for your security.</p>
                            
                            <div class="warning">
                                <p><strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure, and no changes have been made.</p>
                            </div>
                            
                            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
                        </div>
                        <div class="footer">
                            <p>© 2026 GreenCart. All rights reserved.</p>
                            <p>This is an automated email. Please do not reply directly.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'Password reset email sent' });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Reset Password : /api/user/reset-password
export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.json({ success: false, message: 'Token and password are required' });
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Generate token and log user in
        const authToken = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({ success: true, message: 'Password reset successful', token: authToken, user: {email: user.email, name: user.name, _id: user._id} });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Update User Profile : /api/user/update
export const updateUser = async (req, res) => {
    try {
        const { userId, name, email, phone, profileImage, currentPassword, newPassword } = req.body;

        console.log('Update user request:', { userId, name, email, phone, hasProfileImage: !!profileImage });

        if (!userId) {
            return res.json({ success: false, message: 'User ID is required' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        console.log('User found:', user._id);

        // Update name
        if (name) {
            user.name = name;
        }

        // Update email
        if (email && email !== user.email) {
            const normalizedEmail = email.trim().toLowerCase();
            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.json({ success: false, message: 'Email already in use' });
            }
            user.email = normalizedEmail;
        }

        // Update phone
        if (phone !== undefined) {
            user.phone = phone;
        }

        // Update profile image
        if (profileImage !== undefined) {
            user.profileImage = profileImage;
        }

        // Update password if provided
        if (newPassword) {
            if (!currentPassword) {
                return res.json({ success: false, message: 'Current password is required to change password' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.json({ success: false, message: 'Current password is incorrect' });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        // Fetch updated user without password
        const updatedUser = await User.findById(user._id).select('-password');

        return res.json({ 
            success: true, 
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
