<?php
// Footer for bootstrap theme
//
// webtrees: Web based Family History software
// Copyright (C) 2012 webtrees development team.
//
// Derived from PhpGedView
// Copyright (C) 2002 to 2009  PGV Development Team.  All rights reserved.
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//
// $Id: footer.php 13642 2012-03-24 13:06:08Z greg $

if (!defined('WT_WEBTREES')) {
	header('HTTP/1.0 403 Forbidden');
	exit;
}
?>
</div><!-- /.content -->
<?php if ($view!='simple') { ?>
	<div id="push"></div>
	</div><!-- /.wrap -->
	<div id="footer">
		<div class="top">			
			<?php echo contact_links() ?>
			<div class="logo">
				<a href="<?php echo WT_WEBTREES_URL ?>" target="_blank" class="icon-webtrees" title="<?php echo WT_WEBTREES, ' ', WT_VERSION ?>"></a>
			</div>
		</div><!-- /.footer top -->
		<div class="container bottom">
		<?php 
		if (WT_DEBUG || $WT_TREE->getPreference('SHOW_STATS')) {
			echo execution_stats();
		}
		if (exists_pending_change()) {
		?>
			<a class="footer-link-pending" href="#" onclick="window.open('edit_changes.php', '_blank', chan_window_specs); return false;">
				<p class="error center"><?php echo WT_I18N::translate('There are pending changes for you to moderate.') ?></p>
			</a>
		<?php } ?>
		</div><!-- /.footer bottom -->
	</div><!-- /.footer -->
<?php }
