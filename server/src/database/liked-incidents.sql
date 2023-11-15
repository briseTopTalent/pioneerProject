create table liked_incidents (
		id SERIAL,
    _user INT NOT NULL,
    incident_id INT NOT NULL,
    UNIQUE(_user,incident_id)
);
