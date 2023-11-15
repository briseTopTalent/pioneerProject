create table push_notifications(
	id serial PRIMARY KEY,
	_user int NOT NULL,
	incident_id int NOT NULL,
	sent_at DATE,
	created_at DATE NOT NULL DEFAULT NOW(),
	UNIQUE(_user,incident_id)
);
