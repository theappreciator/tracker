ALTER TABLE User
ADD locale varchar(20);

ALTER TABLE User
ADD timezone varchar(64);

update User set locale = 'en-US', timezone = 'America/New_York';