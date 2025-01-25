import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

def send_winning_email(email, item_name, bid_amount):
    try:
        message = Mail(
            from_email='your_email@example.com',  # Replace with your verified sender email
            to_emails=email,
            subject=f'Congratulations! You won the bid for {item_name}',
            html_content=f"""
            <p>Hi,</p>
            <p>Congratulations! You've won the bid for <strong>{item_name}</strong> with a bid amount of <strong>${bid_amount}</strong>.</p>
            <p>Thank you for participating in the auction!</p>
            """
        )
        sg = SendGridAPIClient(os.getenv('SENDGRID_API_KEY'))  # Store your API key in an environment variable
        response = sg.send(message)
        print(f"Email sent to {email}. Status code: {response.status_code}")
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# #ADD to bidding logic
# winner_email = "winner@example.com"
# item_name = "Vintage Painting"
# bid_amount = 500
# send_winning_email(winner_email, item_name, bid_amount)
# #END ADD to bidding logic