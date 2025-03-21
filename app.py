from flask import Flask, request, jsonify, send_from_directory
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from flask_cors import CORS
import traceback

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

# Email configuration
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_HOST_USER = "medixir.ai@gmail.com"
# Use an App Password here instead of your regular password
EMAIL_HOST_PASSWORD = "ngvz loba obfg kdav"  # Replace with your App Password
RECIPIENT_EMAIL = "medixir.ai@gmail.com"

# Route to serve the main index.html file
@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

# Route to serve any static files (CSS, JS, images, etc.)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        # Get form data from request
        data = request.json
        name = data.get('name', '')
        email = data.get('email', '')
        message = data.get('message', '')
        
        # Log the received data for debugging
        print(f"Received form data: Name={name}, Email={email}, Message={message}")
        
        # Create email
        msg = MIMEMultipart()
        msg['From'] = EMAIL_HOST_USER
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = f"New message from {name} via AI DrugLab"
        
        # Email body
        body = f"""
        You have received a new message from your website:
        
        Name: {name}
        Email: {email}
        
        Message:
        {message}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # For testing purposes, let's log that we're about to connect to the SMTP server
        print("Attempting to connect to SMTP server...")
        
        try:
            # Connect to SMTP server and send email
            with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
                print("Connected to SMTP server. Starting TLS...")
                server.starttls()
                print("TLS started. Attempting login...")
                server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
                print("Login successful. Sending email...")
                server.send_message(msg)
                print("Email sent successfully!")
        except smtplib.SMTPAuthenticationError:
            print("SMTP Authentication Error: Your username and password were rejected")
            return jsonify({"success": False, "message": "Email authentication failed. Please check your email credentials."}), 500
        except smtplib.SMTPException as smtp_error:
            print(f"SMTP Error: {str(smtp_error)}")
            return jsonify({"success": False, "message": f"SMTP Error: {str(smtp_error)}"}), 500
        
        return jsonify({"success": True, "message": "Email sent successfully"}), 200
    
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        print(traceback.format_exc())  # Print full traceback for debugging
        return jsonify({"success": False, "message": str(e)}), 500

# Add a test route to check if email configuration works
@app.route('/test-email')
def test_email():
    try:
        # Try to connect to the SMTP server without sending an email
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_HOST_USER, EMAIL_HOST_PASSWORD)
            return jsonify({"success": True, "message": "SMTP connection test successful"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"SMTP connection test failed: {str(e)}"}), 500

if __name__ == '__main__':
    # Check if app password is still the placeholder
    if EMAIL_HOST_PASSWORD == "ngvz loba obfg kdav":
        print("="*50)
        print("WARNING: You need to replace 'ngvz loba obfg kdav' with your actual App Password")
        print("Follow the instructions in the comments to set up an App Password")
        print("="*50)
    
    # Print a message to make it clear where to access the website
    print("="*50)
    print("Server is running!")
    print("Access your website at: http://127.0.0.1:5500/")
    print("Visit http://127.0.0.1:5500/test-email to test email connectivity")
    print("="*50)
    app.run(debug=True, host='127.0.0.1', port=5500)