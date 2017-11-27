<?php
/**
 * webtrees: online genealogy
 * Copyright (C) 2017 webtrees development team
 * Copyright (C) 2017 JustCarmen
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
namespace JustCarmen\WebtreesAddOns\JustLight;

use Fisharebest\Webtrees\Database;
use Fisharebest\Webtrees\Filter;

/** @global Tree $WT_TREE */
global $WT_TREE;

chdir('../../../'); // change the directory to the root of webtrees to load the required files from session.php.
require 'includes/session.php';

if (!Filter::checkCsrf()) {
	http_response_code(406);

	return;
}

switch (Filter::post('action', null, Filter::get('action'))) {
	case 'imagetype':
		$xrefs = Filter::postArray('xrefs');

		$data = array();
		foreach ($xrefs as $xref) {
			$row		 = Database::prepare('SELECT m_type as imagetype FROM `##media` WHERE m_id=?')
				->execute(array($xref))
				->fetchOneRow();
			$data[$xref] = $row->imagetype;
		};

		header('Content-Type: application/json; charset=UTF-8');
		echo json_encode((object) $data);
		break;
	default:
		http_response_code(406);
		break;
}
