create table comments(
		id SERIAL,
		user_id INTEGER NOT NULL,
		comment TEXT NOT NULL,
		img TEXT,
		incident_id INTEGER NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT(NOW()),
		updated_at TIMESTAMP NOT NULL DEFAULT(NOW()),
		PRIMARY KEY(id)
	);
