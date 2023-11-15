create table notifications(
		id SERIAL,
		_user INTEGER NOT NULL,
		notification_type TEXT NOT NULL,
		notification_id TEXT NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT(NOW()),
		updated_at TIMESTAMP NOT NULL DEFAULT(NOW()),
		PRIMARY KEY(id)
	);
