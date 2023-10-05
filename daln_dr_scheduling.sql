-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 05, 2023 at 10:51 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `daln_dr.scheduling`
--

-- --------------------------------------------------------

--
-- Table structure for table `demand`
--

CREATE TABLE `demand` (
  `id` int(11) NOT NULL,
  `room-id` int(11) NOT NULL,
  `doctor-num` int(11) NOT NULL,
  `demand` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dr_detail`
--

CREATE TABLE `dr_detail` (
  `id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `R1` int(2) NOT NULL,
  `R2` int(2) NOT NULL,
  `R3` int(2) NOT NULL,
  `R4` int(2) NOT NULL,
  `R5` int(2) NOT NULL,
  `R6` int(2) NOT NULL,
  `R7` int(2) NOT NULL,
  `note` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `dr_detail`
--

INSERT INTO `dr_detail` (`id`, `Name`, `R1`, `R2`, `R3`, `R4`, `R5`, `R6`, `R7`, `note`) VALUES
(1, 'Lê Tiến Hưng', 0, 0, 0, 0, 0, 0, 0, 'nya'),
(2, 'Dương Thành Công', 0, 0, 0, 0, 0, 0, 0, 'nya'),
(3, 'Dương Thành Công', 0, 0, 0, 0, 0, 0, 0, 'nya'),
(4, 'Dương Thành Công', 0, 0, 0, 0, 0, 0, 0, 'nya'),
(5, 'Dương Thành Công', 0, 0, 0, 0, 0, 0, 0, 'nya'),
(6, 'Lê Tiến Hưng', 0, 0, 0, 0, 0, 0, 0, 'không có');

-- --------------------------------------------------------

--
-- Table structure for table `room_detail`
--

CREATE TABLE `room_detail` (
  `id` int(11) NOT NULL,
  `Name` text NOT NULL,
  `Load` int(1) NOT NULL,
  `Priority` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `work_assign`
--

CREATE TABLE `work_assign` (
  `id` int(11) NOT NULL,
  `room` text NOT NULL,
  `date` date NOT NULL,
  `session` time NOT NULL,
  `doctor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `demand`
--
ALTER TABLE `demand`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `dr_detail`
--
ALTER TABLE `dr_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `room_detail`
--
ALTER TABLE `room_detail`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `work_assign`
--
ALTER TABLE `work_assign`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `demand`
--
ALTER TABLE `demand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `dr_detail`
--
ALTER TABLE `dr_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `room_detail`
--
ALTER TABLE `room_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `work_assign`
--
ALTER TABLE `work_assign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
