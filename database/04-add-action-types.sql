ALTER TABLE Action
ADD type varchar(20);

CONTINUE;

update Action set type = 'count';

CONTINUE;

insert into Action values(9, 'Success?', 1, 'onoff');
