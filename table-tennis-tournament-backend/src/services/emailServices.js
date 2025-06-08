const nodemailer = require('nodemailer');

// Create transporter using your Gmail credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // hardikyadav3444@gmail.com
        pass: process.env.EMAIL_PASS  // your app password
    }
});

// Send OTP email to captain and admin
const sendOTPEmail = async (captainEmail, captainName, otp) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL; // Use your own email from .env

        // Email to Captain
        const captainEmailOptions = {
            from: process.env.EMAIL_USER,
            to: captainEmail,
            subject: '🏓 Table Tennis Tournament - Email Verification OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">🏓 Table Tennis Tournament</h1>
                        <p style="color: #e8f0fe; margin: 10px 0 0 0; font-size: 16px;">Team Captain Verification</p>
                    </div>
                    
                    <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333; margin-bottom: 20px;">Hello ${captainName}!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6;">
                            Thank you for registering your team for the Table Tennis Tournament. 
                            Please use the following OTP to verify your email address:
                        </p>
                        
                        <div style="background: #f8f9fa; border: 2px dashed #667eea; padding: 20px; margin: 30px 0; text-align: center; border-radius: 8px;">
                            <p style="margin: 0; color: #333; font-size: 14px; margin-bottom: 10px;">Your Verification OTP:</p>
                            <h1 style="color: #667eea; font-size: 36px; font-weight: bold; margin: 0; letter-spacing: 8px;">${otp}</h1>
                        </div>
                        
                        <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
                            <p style="margin: 0; color: #856404; font-size: 14px;">
                                <strong>⚠️ Important:</strong> This OTP is valid for 10 minutes only. 
                                Do not share this OTP with anyone.
                            </p>
                        </div>
                        
                        <p style="color: #666; font-size: 14px; margin-top: 30px;">
                            If you didn't request this verification, please ignore this email.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                        
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            Table Tennis Tournament Registration System<br>
                            IIT Jammu Sports Committee
                        </p>
                    </div>
                </div>
            `
        };

        // Email to Admin (for verification tracking)
        const adminEmailOptions = {
            from: process.env.EMAIL_USER,
            to: adminEmail,
            subject: '🏓 New Captain Registration - OTP Sent',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333;">New Team Captain Registration</h2>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745;">
                        <h3 style="margin-top: 0; color: #28a745;">Captain Details:</h3>
                        <p><strong>Name:</strong> ${captainName}</p>
                        <p><strong>Email:</strong> ${captainEmail}</p>
                        <p><strong>OTP Sent:</strong> ${otp}</p>
                        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 20px;">
                        This is an automated notification for team registration tracking.
                    </p>
                </div>
            `
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(captainEmailOptions),
            transporter.sendMail(adminEmailOptions)
        ]);

        console.log(`OTP email sent successfully to ${captainEmail} and admin notification sent`);
        return { success: true, message: 'OTP sent successfully' };

    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send OTP email: ' + error.message);
    }
};

// Send team registration confirmation email
const sendRegistrationConfirmation = async (captainEmail, captainName, teamData) => {
    try {
        const emailOptions = {
            from: process.env.EMAIL_USER,
            to: captainEmail,
            subject: '🎉 Team Registration Successful - Table Tennis Tournament',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: white; margin: 0;">🎉 Registration Successful!</h1>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        <h2 style="color: #333;">Congratulations ${captainName}!</h2>
                        <p style="color: #666;">Your team <strong>"${teamData.teamName}"</strong> has been successfully registered for the Table Tennis Tournament.</p>
                        
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Next Steps:</h3>
                            <ul style="color: #666;">
                                <li>Check your email for tournament schedule updates</li>
                                <li>Prepare your team for the upcoming matches</li>
                                <li>Join the tournament WhatsApp group (link will be shared soon)</li>
                            </ul>
                        </div>
                        
                        <p style="color: #666;">Good luck with the tournament! 🏓</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(emailOptions);
        console.log(`Registration confirmation sent to ${captainEmail}`);

    } catch (error) {
        console.error('Confirmation email error:', error);
        // Don't throw error here as registration is already complete
    }
};

module.exports = {
    sendOTPEmail,
    sendRegistrationConfirmation
};
