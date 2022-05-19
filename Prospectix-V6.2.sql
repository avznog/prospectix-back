CREATE TABLE `cdp` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `firstname` varchar(255),
  `lastname` varchar(255),
  `mail` varchar(255),
  `pseudo` varchar(255),
  `tokenEmail` varchar(255)
);

CREATE TABLE `meetingTableAgenda` (
  `link` varchar(255)
);

CREATE TABLE `events` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cdp` int,
  `prospect` int,
  `event` cases_event,
  `creationDate` timestamp
);

CREATE TABLE `prospects` (
  `id` int PRIMARY KEY,
  `companyName` varchar(255) NOT NULL,
  `activity` varchar(255),
  `phone` varchar(255),
  `streetAddress` varchar(255),
  `city` int,
  `country` int,
  `website` varchar(255),
  `email` varchar(255),
  `lastEvent` prospect_events DEFAULT "N/A" COMMENT 'Dernier événement lié au prospect',
  `comment` varchar(255),
  `nbNo` int
);

CREATE TABLE `prospectContact` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `prospect` int,
  `firstname` varchar(255),
  `lastname` varchar(255),
  `position` varchar(255)
);

CREATE TABLE `sentEmails` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `cdp` int,
  `email` varchar(255),
  `object` varchar(255),
  `message` varchar(255),
  `sendingDate` timestamp
);

CREATE TABLE `bookmarks` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user` int,
  `prospect` int,
  `bookmarkCreation` timestamp
);

CREATE TABLE `websites` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `owner` int,
  `website` varchar(255)
);

CREATE TABLE `emails` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `owner` int,
  `email` varchar(255)
);

CREATE TABLE `phones` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `owner` int,
  `phoneNumber` varchar(255)
);

CREATE TABLE `activities` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `activity` varchar(255)
);

CREATE TABLE `cities` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `city_name` varchar(255),
  `zip_code` int
);

CREATE TABLE `countries` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `countryName` varchar(255)
);

CREATE TABLE `reminders` (
  `id` int PRIMARY KEY,
  `user` int,
  `prospect` int,
  `description` varchar(255),
  `priority` int,
  `remindingDate` varchar(255)
);

CREATE TABLE `meetings` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `meetingType` ENUM ('Extérieur', 'Téléphone/Visio', 'Table de réunion') DEFAULT "Téléphone/Visio",
  `meetingDate` varchar(255),
  `user` int,
  `prospect` int
);

CREATE TABLE `goals` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `isCyclic` boolean DEFAULT true,
  `deadline` datetime,
  `goalTitle` varchar(255),
  `goalDescription` varchar(255),
  `achievementTotalSteps` int,
  `currentAchievement` int,
  `cdp` int
);

ALTER TABLE `events` ADD FOREIGN KEY (`id`) REFERENCES `cdp` (`id`);

ALTER TABLE `events` ADD FOREIGN KEY (`prospect`) REFERENCES `prospects` (`id`);

ALTER TABLE `prospectContact` ADD FOREIGN KEY (`id`) REFERENCES `prospects` (`id`);

ALTER TABLE `sentEmails` ADD FOREIGN KEY (`cdp`) REFERENCES `cdp` (`id`);

ALTER TABLE `sentEmails` ADD FOREIGN KEY (`email`) REFERENCES `emails` (`id`);

ALTER TABLE `bookmarks` ADD FOREIGN KEY (`user`) REFERENCES `cdp` (`id`);

ALTER TABLE `bookmarks` ADD FOREIGN KEY (`prospect`) REFERENCES `prospects` (`id`);

ALTER TABLE `websites` ADD FOREIGN KEY (`owner`) REFERENCES `prospects` (`id`);

ALTER TABLE `websites` ADD FOREIGN KEY (`owner`) REFERENCES `prospectContact` (`id`);

ALTER TABLE `emails` ADD FOREIGN KEY (`owner`) REFERENCES `prospects` (`id`);

ALTER TABLE `emails` ADD FOREIGN KEY (`owner`) REFERENCES `prospectContact` (`id`);

ALTER TABLE `phones` ADD FOREIGN KEY (`owner`) REFERENCES `prospects` (`id`);

ALTER TABLE `phones` ADD FOREIGN KEY (`owner`) REFERENCES `prospectContact` (`id`);

ALTER TABLE `prospects` ADD FOREIGN KEY (`activity`) REFERENCES `activities` (`id`);

ALTER TABLE `prospects` ADD FOREIGN KEY (`city`) REFERENCES `cities` (`id`);

ALTER TABLE `prospects` ADD FOREIGN KEY (`country`) REFERENCES `countries` (`id`);

ALTER TABLE `reminders` ADD FOREIGN KEY (`user`) REFERENCES `cdp` (`id`);

ALTER TABLE `reminders` ADD FOREIGN KEY (`prospect`) REFERENCES `prospects` (`id`);

ALTER TABLE `meetings` ADD FOREIGN KEY (`user`) REFERENCES `cdp` (`id`);

ALTER TABLE `meetings` ADD FOREIGN KEY (`prospect`) REFERENCES `prospects` (`id`);

ALTER TABLE `goals` ADD FOREIGN KEY (`cdp`) REFERENCES `cdp` (`id`);
