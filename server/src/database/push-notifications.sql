create extension if not exists "uuid-ossp";
create table push_notifications (
		id SERIAL,
    _user INT NOT NULL,
    incident_id INT NOT NULL,
    claimed_by uuid,
    sent_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		PRIMARY KEY(id),
    UNIQUE(_user,incident_id)
);
create table push_notifications_queue_log (
		id SERIAL,
    incident_id INT,
    response_message TEXT,
    error_message TEXT,
    user_id_list TEXT,
    claimed_by uuid,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		PRIMARY KEY(id)
);
