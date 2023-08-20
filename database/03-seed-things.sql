insert into Action values(1, '+1', 1);
insert into Action values(2, '+5', 5);
insert into Action values(3, '+10', 10);
insert into Action values(4, '+20', 20);
insert into Action values(5, '+25', 25);
insert into Action values(6, '+40', 40);
insert into Action values(7, '+50', 50);
insert into Action values(8, '+100', 100);

insert into ThingGroup values(1, 1, 'Workouts');

insert into Thing values(1, 1, 1, 'Pushups');
insert into Thing values(2, 1, 2, 'Squats');

insert into ThingAction values(1, 3);
insert into ThingAction values(1, 4);
insert into ThingAction values(1, 5);

insert into ThingAction values(2, 3);
insert into ThingAction values(2, 4);
insert into ThingAction values(2, 5);
insert into ThingAction values(2, 6);
insert into ThingAction values(2, 7);

insert into ThingHistory values(NULL, 1, CURRENT_TIMESTAMP, 10);
insert into ThingHistory values(NULL, 1, CURRENT_TIMESTAMP - INTERVAL 4 DAY, 20);