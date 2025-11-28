-- Add new notification types to the enum
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'new_script';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'new_content';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'refund_response';
ALTER TYPE notification_type ADD VALUE IF NOT EXISTS 'tracker_reminder';