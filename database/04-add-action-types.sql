ALTER TABLE Action
ADD type varchar(20);

update Action set type = 'count';

insert into Action values(9, 'Success?', 1, 'onoff');
