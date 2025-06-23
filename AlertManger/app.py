import smtplib
from email.mime.text import MIMEText
from crewai import Agent, Task, Crew
from crewai.tools import BaseTool
from typing import List
from pydantic import BaseModel, ValidationError
from flask import Flask, request, jsonify
import json
import logging
import os

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set OpenAI API key
os.environ.get("OPENAI_API_KEY")

# Initialize Flask app
app = Flask(__name__)

# ### Pydantic Models for Input Validation
class UserAction(BaseModel):
    user_id: str
    user_name: str
    actions: List[str]

class AnomalyInput(BaseModel):
    emails: List[str]
    timestamp: str
    user_actions: List[UserAction]

class EmailContent(BaseModel):
    subject: str
    timestamp: str
    description: str
    users_involved: List[str]
    recommendation: str

# ### Custom Email Tool
class EmailTool(BaseTool):
    name: str = "EmailNotifier"
    description: str = "Sends email notifications with HTML formatting."

    def _run(self, message: str, recipients: List[str]) -> str:
        sender_email = "scylladetection@gmail.com"
        sender_name = "Scylla Detection Team"
        password = "lskp iyne esgm izeg"  # Replace with your actual Gmail app password from https://myaccount.google.com/apppasswords

        try:
            # Parse and validate JSON message
            email_content = EmailContent.parse_raw(message)

            # Construct HTML email
            users_html = ''.join([f'<li>{user}</li>' for user in email_content.users_involved])
            html_text = f"""
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Security Alert</title>
                    <style>
                        body {{
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }}
                        .container {{
                            max-width: 800px;
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        }}
                        .alert-header {{
                            background-color: #FF4444;
                            color: white;
                            padding: 15px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }}
                        .alert-body {{
                            padding: 20px;
                            color: #333;
                        }}
                        .info-item {{
                            margin-bottom: 10px;
                        }}
                        .info-label {{
                            font-weight: bold;
                            color: #0078d7;
                        }}
                        .users-involved {{
                            list-style-type: disc;
                            padding-left: 20px;
                        }}
                        .recommendation {{
                            background-color: #e2f3ff;
                            padding: 15px;
                            border-radius: 8px;
                            margin-top: 10px;
                            border: 1px solid #b8daff;
                        }}
                        .footer {{
                            text-align: center;
                            margin-top: 20px;
                            color: #888;
                            font-size: 0.9em;
                        }}
                        .highlight {{
                            background-color: #fff59d;
                            padding: 0.2em;
                            border-radius: 3px;
                            color: #666;
                        }}
                        .critical {{
                            color: #ff3d00;
                            font-weight: bold;
                        }}
                        .warning {{
                            color: #ff8800;
                            font-weight: bold;
                        }}
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2 class="alert-header">⚠ Security Alert</h2>
                        <div class="alert-body">
                            <div class="info-item">
                                <span class="info-label">Timestamp:</span> <span class="highlight">{email_content.timestamp}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Description:</span> <span class="warning">{email_content.description}</span>
                            </div>
                            <div class="info-item">
                                 <span class="info-label">Users Involved:</span>
                                 <ul class="users-involved">
                                     {users_html}
                                 </ul>
                            </div>
                            <div class="recommendation">
                                <span class="info-label">Recommendation:</span> <span class="critical">{email_content.recommendation}</span>
                            </div>
                        </div>
                        <div class="footer">
                            <p>Automated message from Scylla Detection Team.</p>
                        </div>
                    </div>
                </body>
                </html>
                """

            # Create MIMEText object
            msg = MIMEText(html_text, "html")
            msg["Subject"] = email_content.subject
            msg["From"] = f"{sender_name} <{sender_email}>"
            msg["To"] = ", ".join(recipients)

            # Send email
            with smtplib.SMTP("smtp.gmail.com", 587) as server:
                server.starttls()
                server.login(sender_email, password)
                server.send_message(msg)
            logging.info(f"Email sent to {recipients}")
            return "Emails sent successfully"
        except ValidationError as e:
            error_msg = f"Invalid JSON message: {e}"
            logging.error(error_msg)
            return error_msg
        except smtplib.SMTPException as e:
            error_msg = f"Failed to send emails: {e}"
            logging.error(error_msg)
            return error_msg
        except Exception as e:
            error_msg = f"Unexpected error: {e}"
            logging.error(error_msg)
            return error_msg

# ### Security Officer Agent
security_officer = Agent(
    role="Security Officer",
    goal="Notify admins about security anomalies",
    backstory="Responsible for sending detailed security notifications",
    verbose=True,
    llm="openai/gpt-4o",  # Requires OpenAI API key
    tools=[EmailTool()]
)

# ### Flask Endpoint
@app.route("/process-anomaly", methods=['POST'])
def process_anomaly():
    """Process anomaly data and send email notifications."""
    try:
        anomaly_data_dict = request.get_json()
        anomaly_data = AnomalyInput(**anomaly_data_dict)
    except ValidationError as e:
        error_message = f"Input validation error: {e}"
        logging.error(error_message)
        return jsonify({"status": "error", "message": error_message}), 400
    except Exception as e:
        error_message = f"Error processing request: {e}"
        logging.error(error_message)
        return jsonify({"status": "error", "message": error_message}), 400

    # Extract data
    processed_emails = anomaly_data.emails

    # Format user actions for task description
    if anomaly_data.user_actions:
        user_actions_str = "\n".join(
            [f"- User ID: {ua.user_id}, Name: {ua.user_name}, Actions: {', '.join(ua.actions)}"
             for ua in anomaly_data.user_actions]
        )
    else:
        user_actions_str = "No specific users involved."

    # Create task description
    task_description = (
        f"An anomaly has been detected with the following details:\n"
        f"Timestamp: {anomaly_data.timestamp}\n"
        f"User actions:\n{user_actions_str}\n\n"
        "Generate a JSON string with the following structure:\n"
        "{\n"
        '  "subject": "Security Alert: Suspicious Activity Detected",\n'
        f'  "timestamp": "{anomaly_data.timestamp}",\n'
        '  "description": "[Analyze the user actions and provide a detailed description of the suspicious activity.]",\n'
        '  "users_involved": ["- User ID: [id], Actions: [actions]", ...] or ["No specific users identified."],\n'
        '  "recommendation": "[Provide a detailed recommendation based on security best practices.]"\n'
        "}\n\n"
        f"Then, use the EmailTool to send the email with the JSON string as the message to the following recipients: {', '.join(processed_emails)}.\n"
        "Finally, return the result of the EmailTool, which will indicate whether the emails were sent successfully."
    )

    # Define task
    notify_admin_task = Task(
        description=task_description,
        agent=security_officer,
        expected_output="Result of the EmailTool indicating whether emails were sent successfully"
    )

    # Create Crew
    security_crew = Crew(
        agents=[security_officer],
        tasks=[notify_admin_task],
        process="sequential",
        verbose=True,
    )

    # Execute Crew and handle result
    try:
        crew_output = security_crew.kickoff()  # Returns a CrewOutput object
        # Extract the task output using 'raw' instead of 'output'
        task_output = crew_output.tasks_output[0]
        result = task_output.raw  # Use 'raw' attribute (adjust if needed based on logs)
        # Debug logging to inspect TaskOutput structure
        logging.info(f"TaskOutput attributes: {dir(task_output)}")
        logging.info(f"TaskOutput raw: {task_output.raw}")
        logging.info(f"Crew execution result: {result}")
        return jsonify({"status": "success", "message": result}), 200
    except Exception as e:
        error_message = f"Failed to process anomaly: {str(e)}"
        logging.error(error_message)
        return jsonify({"status": "error", "message": error_message}), 500

# ### Run the Flask App
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8010, debug=True)  # Set debug=False in production