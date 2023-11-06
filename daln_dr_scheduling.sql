-- phpMyAdmin SQL Dump
-- version 6.0.0-dev+20231029.cbfb41cd76
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2023 at 05:05 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.5

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
  `demand0` int(1) NOT NULL,
  `demand1` int(1) NOT NULL,
  `demand2` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `demand`
--

INSERT INTO `demand` (`id`, `room-id`, `demand0`, `demand1`, `demand2`) VALUES
(22, 1, 0, 1, 1),
(23, 2, 0, 1, 0),
(24, 3, 0, 1, 0),
(25, 4, 0, 1, 0),
(26, 5, 0, 0, 1),
(27, 6, 0, 1, 0),
(28, 7, 0, 1, 1),
(29, 8, 0, 1, 1),
(30, 9, 0, 1, 1),
(31, 10, 0, 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `dr_detail`
--

CREATE TABLE `dr_detail` (
  `id` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `R1` int(11) DEFAULT 0,
  `R2` int(11) DEFAULT 0,
  `R3` int(11) DEFAULT 0,
  `R4` int(11) DEFAULT 0,
  `R5` int(11) DEFAULT 0,
  `R6` int(11) DEFAULT 0,
  `R7` int(11) DEFAULT 0,
  `R8` int(11) DEFAULT 0,
  `R9` int(11) DEFAULT 0,
  `R10` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dr_detail`
--

INSERT INTO `dr_detail` (`id`, `Name`, `R1`, `R2`, `R3`, `R4`, `R5`, `R6`, `R7`, `R8`, `R9`, `R10`) VALUES
(1, 'Kiều Văn Tuấn', 2, 2, 2, 1, 2, 2, 0, 2, 0, 2),
(2, 'Đỗ Anh Giang', 1, 2, 0, 2, 2, 2, 2, 0, 2, 0),
(3, 'Phạm Thị Thu Hiền', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2),
(4, 'Nguyễn Hoài Nam', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2),
(5, 'Nguyễn Trường Sơn', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2),
(6, 'Lưu Thị Minh Diệp', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2),
(7, 'Nguyễn Thế Phương', 2, 2, 2, 2, 2, 2, 2, 2, 2, 2),
(8, 'Trần Việt Hùng', 2, 2, 1, 2, 0, 2, 1, 0, 2, 0),
(9, 'Đinh Thị Quỳnh Hương', 1, 2, 1, 1, 1, 0, 2, 2, 0, 1),
(10, 'Vũ Mạnh Hà', 0, 1, 0, 2, 2, 0, 2, 0, 2, 1),
(11, 'Trần Tuấn Việt', 2, 0, 1, 2, 0, 0, 1, 2, 1, 2),
(12, 'Trần Tuấn Anh', 2, 2, 2, 2, 0, 0, 2, 2, 2, 2),
(13, 'Vũ Thái Hòa', 2, 2, 2, 1, 2, 0, 2, 0, 2, 2),
(14, 'Hồng Thu Hà', 0, 1, 2, 0, 2, 2, 2, 1, 2, 0);

-- --------------------------------------------------------

--
-- Table structure for table `room_detail`
--

CREATE TABLE `room_detail` (
  `id` int(11) NOT NULL,
  `Name` text NOT NULL,
  `Load` int(1) NOT NULL,
  `Priority` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `room_detail`
--

INSERT INTO `room_detail` (`id`, `Name`, `Load`, `Priority`) VALUES
(1, 'Phòng 309 (KKB)  TH1', 2, 0),
(2, 'Phòng 309 (KKB)  TH2', 1, 0),
(3, 'Phòng 309 (KKB)  TH3', 1, 0),
(4, 'PK nhà K1 703', 1, 0),
(5, 'PK nhà K1 704', 1, 0),
(6, 'PK nhà K1 705', 1, 0),
(7, 'PK nhà K1 707', 1, 0),
(8, 'PK nhà K1 708', 1, 0),
(9, 'PK nhà K1 709', 1, 0),
(10, 'Điều trị tầng 9 K1', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `work_assign`
--

CREATE TABLE `work_assign` (
  `id` int(11) NOT NULL,
  `room` text NOT NULL,
  `date` date NOT NULL,
  `session` int(11) NOT NULL,
  `doctor_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `work_assign`
--

INSERT INTO `work_assign` (`id`, `room`, `date`, `session`, `doctor_id`) VALUES
(52, '1', '2023-11-01', 2, 1),
(53, '2', '2023-11-01', 2, 2),
(54, '-1', '2023-11-03', 6, 5),
(55, '-1', '2023-11-04', 9, 6),
(56, '3', '2023-11-03', 7, 6),
(57, '10', '2023-11-05', 10, 7);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `dr_detail`
--
ALTER TABLE `dr_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `room_detail`
--
ALTER TABLE `room_detail`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `work_assign`
--
ALTER TABLE `work_assign`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
