CREATE TABLE `User` (
    `userId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` varchar(255) NOT NULL,
    `hash` varchar(255)
);

CREATE TABLE `ThingGroup` (
    `thingGroupId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `userId` int NOT NULL,
    `name` varchar(32) NOT NULL
);

CREATE TABLE `Thing` (
    `thingId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `thingGroupId` int NOT NULL,
    `sortOrder` int NOT NULL,
    `name` varchar(32) NOT NULL
);

CREATE TABLE `Action` (
    `actionId` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(32) NOT NULL,
    `value` int NOT NULL
);

CREATE TABLE `ThingAction` (
    `thingId` int NOT NULL,
    `actionId` int NOT NULL,
     PRIMARY KEY (thingId, actionId)
);

CREATE TABLE `ThingHistory` (
    `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `thingId` int NOT NULL,
    `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    `change` int NOT NULL
);