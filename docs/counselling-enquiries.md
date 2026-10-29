# Child counselling enquiries

The programme stays at /programs/education. Existing education album and donation identifiers are unchanged.

## Configure
Add COUNSELLING_EMAIL_TO to .env.local and the deployment environment. Use an existing mailbox approved by the client for counselling enquiries, with access restricted to the appropriate staff. Restart the development server after changing environment variables.
The existing RESEND_API_KEY and EMAIL_FROM are reused. There is deliberately no fallback to EMAIL_TO.

## Content
In Sanity, edit the existing Education & Child Counselling programme document's hero and purpose text to describe both services, then publish. Existing published documents are not overwritten by initialValue defaults.
Update the Education card in Homepage → Programs too. Keep its existing destination.
The counselling section's form labels, privacy notice and process explanation currently live in features/programs/components/CounsellingForm.tsx.

## Intake
This is a contact request for under-18s, not appointment booking or clinical consent.
Only guardian contact details, child first name/age, contact preference and confirmations are sent.
No diagnoses, free-text histories or attachments are collected. Unknown submitted fields are omitted from emails.
The browser form uses required fields; the server independently validates them, applies existing origin/spam/rate checks, and sends through Resend with Reply-To set to the guardian.
These details are processed by Resend and the recipient mailbox. Agree access and retention arrangements with the client before public launch; this implementation does not enforce mailbox retention.

## Manual check
Visit /programs/education#child-counselling. Submit fictional details to the configured test recipient. Confirm the correct destination, fields and Reply-To. Never use a real child's information for testing.
Automated enquiry tests use a fake email provider and do not send emails.
