<?php
/**
 * webtrees: online genealogy
 * Copyright (C) 2015 webtrees development team
 * Copyright (C) 2015 JustCarmen
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
namespace Fisharebest\Webtrees;

define('WT_SCRIPT_NAME', 'action.php');
chdir('../../../'); // change the directory to the root of webtrees to load the required files from session.php.
require './includes/session.php';

header('Content-type: text/html; charset=UTF-8');

if (!Filter::checkCsrf()) {
	header('HTTP/1.0 406 Not Acceptable');
	exit;
}

$action = Filter::get('action');
switch ($action) {
	case 'imagetype':
		$xrefs = Filter::postArray('xrefs');

		$data = array();
		foreach ($xrefs as $xref) {
			$row = Database::prepare("SELECT m_type as imagetype FROM `##media` WHERE m_id=?")
				->execute(array($xref))
				->fetchOneRow(PDO::FETCH_ASSOC);

			$data[$xref] = $row['imagetype'];
		};

		header("Content-Type: application/json; charset=UTF-8");
		echo json_encode((object) $data);
		break;
	default:
		header('HTTP/1.0 404 Not Found');
		break;
}