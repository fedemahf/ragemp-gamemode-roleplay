CREATE TABLE `users` (
  `guid` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `socialClub` varchar(255) NOT NULL,
  `lang` varchar(3) NOT NULL DEFAULT 'eng',
  `adminlvl` int(10) NOT NULL DEFAULT '0',
  `position` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `users`
  ADD PRIMARY KEY (`guid`);

ALTER TABLE `users`
  MODIFY `guid` int(255) NOT NULL AUTO_INCREMENT;
COMMIT;
