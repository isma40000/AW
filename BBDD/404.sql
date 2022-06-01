-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-06-2022 a las 18:27:11
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 8.0.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `answers`
--

CREATE TABLE `answers` (
  `answer_id` int(11) NOT NULL,
  `a_body` varchar(5000) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `a_date` date NOT NULL DEFAULT current_timestamp(),
  `question_id` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `answers`
--

INSERT INTO `answers` (`answer_id`, `a_body`, `user_email`, `a_date`, `question_id`) VALUES
(1, 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo,\r\ndependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra\r\npara posicionarse respecto a ella.\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute |\r\nfixed | inherit | initial.\r\n', 'lucas@404.es', '2021-12-14', 1),
(2, 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en\r\nla fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa\r\nun ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.\r\n', 'emy@404.es', '2021-12-15', 2),
(3, 'Buenos días, exactamente hay 143 preguntas.', 'nico@404.es', '2022-06-01', 51),
(4, 'afeeeeeeeeee\r\nfafefafae\r\nafaeffafeaf\r\nafafaefeaf\r\nAdiós.', 'nico@404.es', '2022-06-01', 51),
(5, 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'nico@404.es', '2022-06-01', 51),
(6, 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', 'nico@404.es', '2022-06-01', 51),
(7, 'Creo q ya van las respuestas como la seda.', 'nico@404.es', '2022-06-01', 51),
(8, 'Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.Creo q ya van las respuestas como la seda.', 'nico@404.es', '2022-06-01', 51);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `q_body` varchar(5000) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `q_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `questions`
--

INSERT INTO `questions` (`question_id`, `title`, `q_body`, `user_email`, `q_date`) VALUES
(1, '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé\nque estas propiedades de CSS sirven para posicionar un elemento dentro de la página.\n', 'nico@404.es', '2021-12-15'),
(2, '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener', 'roberto@404.es', '2021-12-15'),
(3, 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\nasignaciones =\ncomparaciones == y ===\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también\ncompara el tipo (como un equals de java).', 'sfg@404.es', '2021-12-15'),
(4, 'Problema con asincronismo en Node', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pgnode. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro\r\nmodulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi\r\nseguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan\r\ndisponibles al momento de usarlos.', 'marta@404.es', '2021-12-15'),
(5, '¿Qué es la inyección SQL y cómo puedo evitarla?\r\n', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que\r\nguardan información en una base de datos (especialmente en PHP y MySQL) y que contienen\r\ngraves problemas de seguridad relacionados principalmente con la inyección SQL.\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario\r\nno da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes\r\nsobre el tema así que decidí escribir esta pregunta.', 'lucas@404.es', '2021-12-15'),
(51, 'Dios cuantas preguntas', 'Q locura', 'nico@404.es', '2022-05-31'),
(52, 'Prueba 554', 'Dew', 'nico@404.es', '2022-05-31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`name`) VALUES
('\'css\''),
('\'javascript\''),
('\'nodejs\''),
('\'poggers\''),
('\'true\''),
('\'xd\''),
('css'),
('css3'),
('html'),
('JavaScript'),
('mysql'),
('nodejs'),
('sql'),
('tag1'),
('tag23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags_questions`
--

CREATE TABLE `tags_questions` (
  `tag_question_id` int(11) NOT NULL,
  `tag_name` varchar(100) NOT NULL,
  `question_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tags_questions`
--

INSERT INTO `tags_questions` (`tag_question_id`, `tag_name`, `question_id`) VALUES
(1, 'css', 1),
(2, 'css3', 1),
(3, 'css', 2),
(4, 'html', 2),
(5, 'JavaScript', 3),
(6, 'nodejs', 4),
(7, 'mysql', 5),
(8, 'sql', 5),
(9, 'javascript', 21),
(34, '\'javascript\'', 34),
(35, '\'css\'', 34),
(36, '\'javascript\'', 35),
(37, '\'css\'', 35),
(38, '\'nodejs\'', 35),
(39, '\'javascript\'', 36),
(40, '\'css\'', 36),
(41, '\'nodejs\'', 36),
(42, '\'javascript\'', 37),
(43, '\'css\'', 37),
(44, '\'nodejs\'', 37),
(45, '\'javascript\'', 38),
(46, '\'css\'', 38),
(47, '\'nodejs\'', 38),
(48, '\'javascript\'', 39),
(49, '\'css\'', 39),
(50, '\'nodejs\'', 39),
(51, '\'javascript\'', 40),
(52, '\'css\'', 40),
(53, '\'nodejs\'', 40),
(54, '\'javascript\'', 41),
(55, '\'css\'', 41),
(56, '\'nodejs\'', 41),
(57, '\'javascript\'', 42),
(58, '\'css\'', 42),
(59, '\'nodejs\'', 42),
(60, '\'javascript\'', 43),
(61, '\'css\'', 43),
(62, '\'nodejs\'', 43),
(63, '\'javascript\'', 44),
(64, '\'css\'', 44),
(65, '\'nodejs\'', 44),
(66, '\'javascript\'', 45),
(67, '\'css\'', 45),
(68, '\'nodejs\'', 45),
(69, '\'javascript\'', 46),
(70, '\'css\'', 46),
(71, '\'nodejs\'', 46),
(72, '\'javascript\'', 47),
(73, '\'css\'', 47),
(74, '\'nodejs\'', 47),
(75, '\'javascript\'', 48),
(76, '\'css\'', 48),
(77, '\'nodejs\'', 48),
(78, '\'javascript\'', 49),
(79, '\'css\'', 49),
(80, '\'nodejs\'', 49),
(81, '\'javascript\'', 50),
(82, '\'css\'', 50),
(83, '\'nodejs\'', 50),
(84, '\'xd\'', 51),
(85, '\'true\'', 51),
(86, '\'poggers\'', 51),
(87, 'tag23', 52);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `email` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `user_img` varchar(1000) NOT NULL DEFAULT '../img/defecto1.png'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`email`, `password`, `name`, `user_img`) VALUES
('emy@404.es', '1234', 'Emy', '/img/defecto3.png'),
('isma8@404.es', '1', 'isma3', '/img/e1bc0c3b9244fc16bd6e95fe079f42ce'),
('lucas@404.es', '1234', 'Marta', '/img/defecto3.png'),
('marta@404.es', '1234', 'Marta', '/img/defecto2.png'),
('nico2@404.es', '1234', 'nicoPoro', '/img/defecto2.png'),
('nico@404.es', '1234', 'Nico', '/img/defecto1.png'),
('peter@404.es', '1234', 'pet24', '/img/wallhaven-72rxqo.jpg'),
('roberto@404.es', '1234', 'Roberto', '/img/defecto1.png'),
('sfg@404.es', '1234', 'SFG', '/img/defecto2.png');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`answer_id`),
  ADD KEY `question_id_FK_a` (`question_id`),
  ADD KEY `user_email_FK_a` (`user_email`);

--
-- Indices de la tabla `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `user_email_FK_q` (`user_email`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`name`);

--
-- Indices de la tabla `tags_questions`
--
ALTER TABLE `tags_questions`
  ADD PRIMARY KEY (`tag_question_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answers`
--
ALTER TABLE `answers`
  MODIFY `answer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT de la tabla `tags_questions`
--
ALTER TABLE `tags_questions`
  MODIFY `tag_question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `question_id_FK_a` FOREIGN KEY (`question_id`) REFERENCES `questions` (`question_id`),
  ADD CONSTRAINT `user_email_FK_a` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`);

--
-- Filtros para la tabla `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `user_email_FK_q` FOREIGN KEY (`user_email`) REFERENCES `users` (`email`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
