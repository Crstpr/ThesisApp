const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Konfigurasi SMTP Gmail dengan environment variables
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true untuk 465, false untuk port lain
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD 
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  // Kirim OTP verification email
  async sendOTPEmail(to, otp, userName = 'User') {
    try {
      const mailOptions = {
        from: {
          name: 'Lapangan Kita',
          address: process.env.EMAIL_USER || 'hypenieyt@gmail.com'
        },
        to: to,
        subject: '🔐 Kode Verifikasi Email - Lapangan Kita',
        html: this.generateOTPEmailTemplate(otp, userName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email OTP berhasil dikirim ke:', to);
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email OTP berhasil dikirim'
      };
    } catch (error) {
      console.error('❌ Error mengirim email OTP:', error);
      return {
        success: false,
        error: error.message,
        message: 'Gagal mengirim email OTP'
      };
    }
  }

  // Template HTML untuk email OTP
  generateOTPEmailTemplate(otp, userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verifikasi Email - Lapangan Kita</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 10px;
            }
            .title {
                font-size: 24px;
                color: #333;
                margin-bottom: 20px;
            }
            .otp-container {
                background-color: #f8f9fa;
                border: 2px dashed #4CAF50;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
            }
            .otp-code {
                font-size: 36px;
                font-weight: bold;
                color: #4CAF50;
                letter-spacing: 8px;
                margin: 10px 0;
            }
            .message {
                font-size: 16px;
                margin: 20px 0;
                line-height: 1.6;
            }
            .warning {
                background-color: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #856404;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
            .button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">⚽ Lapangan Kita</div>
                <h1 class="title">Verifikasi Email Anda</h1>
            </div>
            
            <div class="message">
                <p>Halo <strong>${userName}</strong>,</p>
                <p>Terima kasih telah mendaftar di <strong>Lapangan Kita</strong>! Untuk menyelesaikan proses registrasi, silakan verifikasi email Anda dengan memasukkan kode OTP berikut:</p>
            </div>

            <div class="otp-container">
                <p style="margin: 0; font-size: 18px; color: #666;">Kode Verifikasi Anda:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; font-size: 14px; color: #666;">Masukkan kode ini di aplikasi</p>
            </div>

            <div class="warning">
                <strong>⚠️ Penting:</strong>
                <ul style="margin: 10px 0;">
                    <li>Kode ini hanya berlaku selama <strong>15 menit</strong></li>
                    <li>Jangan bagikan kode ini kepada siapa pun</li>
                    <li>Jika Anda tidak merasa mendaftar, abaikan email ini</li>
                </ul>
            </div>

            <div class="message">
                <p>Setelah verifikasi berhasil, Anda dapat menikmati semua fitur di platform kami untuk booking lapangan olahraga!</p>
            </div>

            <div class="footer">
                <p>Email ini dikirim otomatis oleh sistem Lapangan Kita</p>
                <p>Jika Anda mengalami kesulitan, hubungi tim support kami</p>
                <p style="margin-top: 15px;">
                    <strong>Lapangan Kita</strong><br>
                    Platform Booking Lapangan Olahraga Terpercaya
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  // Kirim email welcome setelah verifikasi berhasil
  async sendWelcomeEmail(to, userName) {
    try {
      const mailOptions = {
        from: {
          name: 'Lapangan Kita',
          address: process.env.EMAIL_USER || 'hypenieyt@gmail.com'
        },
        to: to,
        subject: '🎉 Selamat Datang di Lapangan Kita!',
        html: this.generateWelcomeEmailTemplate(userName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email welcome berhasil dikirim ke:', to);
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email welcome berhasil dikirim'
      };
    } catch (error) {
      console.error('❌ Error mengirim email welcome:', error);
      return {
        success: false,
        error: error.message,
        message: 'Gagal mengirim email welcome'
      };
    }
  }

  // Template HTML untuk welcome email
  generateWelcomeEmailTemplate(userName) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Selamat Datang - Lapangan Kita</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 10px;
            }
            .success-icon {
                font-size: 48px;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">⚽ Lapangan Kita</div>
                <div class="success-icon">✅</div>
                <h1>Selamat Datang, ${userName}!</h1>
            </div>
            
            <p>Email Anda telah berhasil diverifikasi! Sekarang Anda dapat menikmati semua fitur di Lapangan Kita:</p>
            
            <ul>
                <li>🏟️ Booking lapangan olahraga</li>
                <li>⭐ Melihat rating dan review</li>
                <li>📅 Manajemen jadwal booking</li>
                <li>💰 Promo dan diskon khusus</li>
            </ul>
            
            <p>Terima kasih telah bergabung dengan kami!</p>
        </div>
    </body>
    </html>
    `;
  }

  // Test koneksi email
  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Koneksi email berhasil');
      return { success: true, message: 'Koneksi email berhasil' };
    } catch (error) {
      console.error('❌ Error koneksi email:', error);
      return { success: false, error: error.message };
    }
  }

  // Kirim email forgot password dengan password baru
  async sendForgotPasswordEmail(to, newPassword, userName = 'User') {
    try {
      const mailOptions = {
        from: {
          name: 'Lapangan Kita',
          address: process.env.EMAIL_USER || 'hypenieyt@gmail.com'
        },
        to: to,
        subject: '🔑 Reset Password - Lapangan Kita',
        html: this.generateForgotPasswordEmailTemplate(newPassword, userName)
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email reset password berhasil dikirim ke:', to);
      return {
        success: true,
        messageId: result.messageId,
        message: 'Email reset password berhasil dikirim'
      };
    } catch (error) {
      console.error('❌ Error mengirim email reset password:', error);
      return {
        success: false,
        error: error.message,
        message: 'Gagal mengirim email reset password'
      };
    }
  }

  // Template HTML untuk email forgot password
  generateForgotPasswordEmailTemplate(userName, newPassword) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password - Lapangan Kita</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #4CAF50;
                margin-bottom: 10px;
            }
            .title {
                font-size: 24px;
                color: #333;
                margin-bottom: 20px;
            }
            .password-container {
                background-color: #f8f9fa;
                border: 2px solid #4CAF50;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                margin: 30px 0;
            }
            .new-password {
                font-size: 24px;
                font-weight: bold;
                color: #2c3e50;
                letter-spacing: 2px;
                margin: 10px 0;
                background-color: #ecf0f1;
                padding: 15px;
                border-radius: 5px;
                font-family: monospace;
            }
            .message {
                font-size: 16px;
                margin: 20px 0;
                line-height: 1.6;
            }
            .warning {
                background-color: #ffe6e6;
                border: 1px solid #ffb3b3;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #cc0000;
            }
            .info {
                background-color: #e6f3ff;
                border: 1px solid #b3d9ff;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                color: #0066cc;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                color: #666;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🔑 Lapangan Kita</div>
                <h1 class="title">Reset Password Berhasil</h1>
            </div>
            
            <div class="message">
                <p>Halo <strong>${userName}</strong>,</p>
                <p>Kami telah berhasil mereset password Anda. Berikut adalah password baru Anda:</p>
            </div>

            <div class="password-container">
                <p style="margin: 0; font-size: 18px; color: #666;">Password Baru Anda:</p>
                <div class="new-password">${newPassword}</div>
                <p style="margin: 0; font-size: 14px; color: #666;">Silakan salin password ini untuk login</p>
            </div>

            <div class="warning">
                <strong>🔒 Keamanan Penting:</strong>
                <ul style="margin: 10px 0;">
                    <li><strong>Segera ganti password ini</strong> setelah login pertama kali</li>
                    <li>Jangan bagikan password ini kepada siapa pun</li>
                    <li>Gunakan password yang kuat dan unik</li>
                    <li>Aktifkan autentikasi dua faktor jika tersedia</li>
                </ul>
            </div>

            <div class="info">
                <strong>💡 Tips Keamanan:</strong>
                <ul style="margin: 10px 0;">
                    <li>Kombinasikan huruf besar, kecil, angka, dan simbol</li>
                    <li>Minimal 8 karakter untuk password yang aman</li>
                    <li>Hindari menggunakan informasi pribadi</li>
                    <li>Gunakan password manager untuk menyimpan password</li>
                </ul>
            </div>

            <div class="message">
                <p>Sekarang Anda dapat login menggunakan email dan password baru ini untuk melanjutkan aktivitas booking lapangan di platform kami.</p>
                <p>Jika Anda tidak merasa meminta reset password, segera hubungi tim support kami.</p>
            </div>

            <div class="footer">
                <p>Email ini dikirim otomatis oleh sistem Lapangan Kita</p>
                <p>Untuk keamanan, jangan membalas email ini</p>
                <p style="margin-top: 15px;">
                    <strong>Lapangan Kita</strong><br>
                    Platform Booking Lapangan Olahraga Terpercaya
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

// Export singleton instance
module.exports = new EmailService();